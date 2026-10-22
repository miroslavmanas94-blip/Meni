import { getPromptBank, type GameId } from "../src/lib/prompt-bank";
// @ts-nocheck
interface Env { ROOMS: DurableObjectNamespace<Room> }
type Player = { id: string; name: string; joinedAt: number; ready: boolean; lastSeen: number };
type RoomState = { code: string; players: Player[]; mode: "together"|"distance"; phase: "lobby"|"game"; game: string|null; rounds: number; round: number; prompt: {id?:string;text:string;category:string}|null; usedPrompts: Record<string,string[]>; answers: Record<string,string>; revealed: boolean; scores: Record<string,number>; nextVotes: string[]; createdAt: number };
const headers = { "content-type":"application/json; charset=utf-8", "access-control-allow-origin":"*", "access-control-allow-methods":"GET,POST,OPTIONS", "access-control-allow-headers":"content-type" };
const json = (data: unknown, status=200) => new Response(JSON.stringify(data), {status,headers});
const games = ["truth","know","rather","think","match","quick","story","wheel","compat","secret","voice","custom"];
function promptFor(game:string, state:RoomState) {
 const validGame = (games.includes(game) ? game : "truth") as GameId;
 const bank = getPromptBank(validGame);
 if (!state.usedPrompts) state.usedPrompts = {};
 const used = new Set(state.usedPrompts[validGame] || []);
 let available = bank.filter(item => !used.has(item.id));
 if (!available.length) {
  state.usedPrompts[validGame] = [];
  available = bank;
 }
 const prompt = available[Math.floor(Math.random() * available.length)];
 state.usedPrompts[validGame] = [...(state.usedPrompts[validGame] || []).filter(id => id !== prompt.id), prompt.id];
 return {id:prompt.id,text:prompt.text,category:prompt.category};
}
export class Room {
 state: DurableObjectState; env: Env;
 constructor(state: DurableObjectState, env: Env) { this.state=state; this.env=env; }
 async fetch(request: Request) {
  if(request.method==="OPTIONS") return new Response(null,{headers});
  const url=new URL(request.url); const code=url.pathname.split("/").filter(Boolean).pop()||"";
  let state=await this.state.storage.get<RoomState>("state");
  if(request.method==="POST") {
   const body=await request.json() as any;
   if(url.pathname.endsWith("/create")) {
    if(state && Date.now()-state.createdAt < 12*60*60*1000) return json({error:"Místnost už existuje."},409);
    const id=crypto.randomUUID(); const player:Player={id,name:String(body.nickname||"Hráč 1").slice(0,24),joinedAt:Date.now(),lastSeen:Date.now(),ready:false};
    state={code,players:[player],mode:body.mode==="together"?"together":"distance",phase:"lobby",game:null,rounds:10,round:0,prompt:null,answers:{},revealed:false,scores:{[id]:0},nextVotes:[],usedPrompts:{},createdAt:Date.now()};
    await this.state.storage.put("state",state); return json({state,token:id});
   }
   if(!state) return json({error:"Místnost neexistuje nebo vypršela."},404);
   if(url.pathname.endsWith("/join")) {
    if(state.players.length>=2) return json({error:"Místnost už je plná."},409);
    const id=crypto.randomUUID(); state.players.push({id,name:String(body.nickname||"Hráč 2").slice(0,24),joinedAt:Date.now(),lastSeen:Date.now(),ready:false}); state.scores[id]=0;
    await this.state.storage.put("state",state); return json({state,token:id});
   }
   const token=String(body.token||""); const player=state.players.find(p=>p.id===token);
   if(!player) return json({error:"Nejsi členem této místnosti."},403);
   player.lastSeen=Date.now();
   switch(body.action) {
    case "configure":
     if(state.phase!=="lobby") return json({error:"Hru už nelze měnit."},409);
     state.mode=body.mode==="together"?"together":"distance"; state.rounds=Math.max(1,Math.min(50,Number(body.rounds)||10)); if(games.includes(body.game)) state.game=body.game; break;
    case "ready":
     player.ready=!!body.ready; break;
    case "start":
     if(state.players.length!==2) return json({error:"Nejdřív se musí připojit oba hráči."},409);
     if(!state.players.every(p=>p.ready)) return json({error:"Oba hráči musí potvrdit připravenost."},409);
     state.phase="game"; state.game=games.includes(body.game)?body.game:(games.includes(state.game||"")?state.game:"truth"); state.round=1; state.prompt=promptFor(state.game,state); state.answers={}; state.revealed=false; break;
    case "answer":
     if(state.phase!=="game") return json({error:"Hra ještě nezačala."},409);
     if(Object.prototype.hasOwnProperty.call(state.answers,token)) return json({error:"Odpověď už byla potvrzena."},409);
     state.answers[token]=String(body.answer||"").slice(0,500); if(String(body.answer||"").trim()) state.scores[token]=(state.scores[token]||0)+1; state.revealed=state.players.every(p=>Object.prototype.hasOwnProperty.call(state.answers,p.id)); break;
    case "next":
     if(!state.revealed) return json({error:"Počkejte, až odpoví oba hráči."},409);
     if(!state.nextVotes.includes(token)) state.nextVotes.push(token);
     if(state.players.some(p=>!state.nextVotes.includes(p.id))) { await this.state.storage.put("state",state); return json({state,waitingForPartner:true}); }
     state.nextVotes=[];
     if(state.round>=state.rounds){state.phase="lobby";state.game=null;state.prompt=null;state.round=0;state.answers={};state.revealed=false;state.players.forEach(p=>p.ready=false);}
     else {state.round++;state.prompt=promptFor(state.game||"truth",state);state.answers={};state.revealed=false;}
     break;
    case "leave":
     state.players=state.players.filter(p=>p.id!==token); delete state.scores[token]; delete state.answers[token]; state.phase="lobby";state.game=null;state.round=0;state.prompt=null;state.answers={};state.revealed=false;state.nextVotes=[];state.players.forEach(p=>p.ready=false); break;
    default: return json({error:"Neznámá akce."},400);
   }
   await this.state.storage.put("state",state); return json({state});
  }
  if(request.method==="GET") {
   if(!state) return json({error:"Místnost neexistuje nebo vypršela."},404);
   const token=url.searchParams.get("token")||""; const player=state.players.find(p=>p.id===token);
   if(!player) return json({error:"Nejsi členem této místnosti."},403);
   player.lastSeen=Date.now(); await this.state.storage.put("state",state);
   const safe={...state,answers:state.revealed?state.answers:Object.fromEntries(Object.keys(state.answers).map(k=>[k,"Odpověď potvrzena"]))};
   return json({state:safe,token});
  }
  return json({error:"Metoda není podporována."},405);
 }
}
export default {
 async fetch(request:Request,env:Env) {
  const url=new URL(request.url);
  if(url.pathname==="/health") return json({ok:true,service:"DUO rooms"});
  const parts=url.pathname.split("/").filter(Boolean);
  if(parts[0]!=="rooms"||!parts[1]) return json({error:"Použij /rooms/:code/create, /join nebo /rooms/:code"},404);
  const code=parts[1].toUpperCase().replace(/[^A-Z0-9-]/g,"").slice(0,16);
  if(!/^DUO-\d{4}$/.test(code)) return json({error:"Neplatný kód místnosti."},400);
  const stub=env.ROOMS.getByName(code);
  return stub.fetch(request);
 }
};