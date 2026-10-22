"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Phone, PhoneCall, PhoneOff, Video, VideoOff, Mic, MicOff, Maximize2, Minimize2, X, Camera, Users } from "lucide-react";

type Signal = { id:number; from:string; to:string; type:"offer"|"answer"|"ice"|"hangup"; payload?:any; createdAt:number };
type Props = { room:string; token:string; partner:string; partnerToken:string; onNotice:(message:string)=>void };

export default function CallPanel({room,token,partner,partnerToken,onNotice}:Props) {
 const [expanded,setExpanded]=useState(false);
 const [incoming,setIncoming]=useState<Signal|null>(null);
 const [callState,setCallState]=useState<"idle"|"calling"|"ringing"|"connected">("idle");
 const [videoOn,setVideoOn]=useState(true);
 const [audioOn,setAudioOn]=useState(true);
 const [cameraOn,setCameraOn]=useState(true);
 const [error,setError]=useState("");
 const [visible,setVisible]=useState(false);
 const localVideo=useRef<HTMLVideoElement|null>(null);
 const remoteVideo=useRef<HTMLVideoElement|null>(null);
 const localStream=useRef<MediaStream|null>(null);
 const peer=useRef<RTCPeerConnection|null>(null);
 const pendingIce=useRef<RTCIceCandidateInit[]>([]);
 const sequence=useRef(0);
 const processed=useRef(new Set<number>());
 const busy=useRef(false);
 const active=useRef(true);
 const endpoint=(since?:number)=>"/rooms/"+encodeURIComponent(room)+"?token="+encodeURIComponent(token)+(since===undefined?"":"&signalsSince="+since);
 const send=useCallback(async(type:Signal["type"],payload?:any,to?:string)=>{
  const response=await fetch("/rooms/"+encodeURIComponent(room),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"signal",token,to:to||incoming?.from||partnerToken,payload:{type,payload}})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.error||"Signalizace hovoru selhala.");
  return data;
 },[room,token,incoming,partnerToken]);
 const stopMedia=useCallback(()=>{
  peer.current?.close();peer.current=null;pendingIce.current=[];
  localStream.current?.getTracks().forEach(t=>t.stop());localStream.current=null;
  if(localVideo.current)localVideo.current.srcObject=null;
  if(remoteVideo.current)remoteVideo.current.srcObject=null;
  setCallState("idle");setIncoming(null);setVisible(false);setExpanded(false);setError("");
 },[]);
 const createPeer=useCallback(async(withVideo:boolean)=>{
  const pc=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]});
  peer.current=pc;
  pc.onicecandidate=e=>{if(e.candidate)void send("ice",e.candidate.toJSON()).catch(()=>{});};
  pc.ontrack=e=>{if(remoteVideo.current)remoteVideo.current.srcObject=e.streams[0];setCallState("connected");setVisible(true);};
  pc.onconnectionstatechange=()=>{if(pc.connectionState==="connected")setCallState("connected");if(["failed","closed"].includes(pc.connectionState)&&active.current){setError("Spojení se přerušilo.");}};
  const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:withVideo});
  localStream.current=stream;
  stream.getTracks().forEach(track=>pc.addTrack(track,stream));
  if(localVideo.current)localVideo.current.srcObject=stream;
  return pc;
 },[send]);
 const startCall=async(withVideo:boolean)=>{
  if(busy.current)return;busy.current=true;setError("");setVideoOn(withVideo);setVisible(true);setCallState("calling");
  try{
   if(!navigator.mediaDevices?.getUserMedia)throw new Error("Pro hovory povol kameru/mikrofon a otevři web přes HTTPS.");
   const pc=await createPeer(withVideo);
   const offer=await pc.createOffer();await pc.setLocalDescription(offer);
   await send("offer",{sdp:offer.sdp,type:offer.type},partnerToken);
   onNotice("Volání odesláno. Čeká se na přijetí.");
  }catch(e){stopMedia();setError(e instanceof Error?e.message:"Hovor se nepodařilo spustit.");}
  finally{busy.current=false;}
 };
 const accept=async()=>{
  if(!incoming)return;
  try{
   const pc=await createPeer(incoming.payload?.type==="offer" && !!incoming.payload?.sdp?.includes("m=video"));await pc.setRemoteDescription(new RTCSessionDescription(incoming.payload));
   const answer=await pc.createAnswer();await pc.setLocalDescription(answer);await send("answer",{sdp:answer.sdp,type:answer.type},incoming.from);
   setIncoming(null);setVisible(true);setCallState("connected");
  }catch(e){setError(e instanceof Error?e.message:"Hovor se nepodařilo přijmout.");}
 };
 const reject=async()=>{if(incoming)try{await send("hangup",{},incoming.from)}catch{}setIncoming(null);setCallState("idle");};
 const hangup=async()=>{try{await send("hangup",{},incoming?.from)}catch{}stopMedia();};
 useEffect(()=>{active.current=true;let alive=true;
  const poll=async()=>{
   try{
    const res=await fetch(endpoint(sequence.current),{cache:"no-store"});
    if(!res.ok)return;const data=await res.json();
    for(const s of (data.signals||[]) as Signal[]){
     if(processed.current.has(s.id))continue;processed.current.add(s.id);sequence.current=Math.max(sequence.current,s.id);
     if(s.to!==token)continue;
     if(s.type==="offer"&&!peer.current){setIncoming(s);setCallState("ringing");setVisible(true);}
     else if(s.type==="answer"&&peer.current){await peer.current.setRemoteDescription(new RTCSessionDescription(s.payload));for(const candidate of pendingIce.current.splice(0)){try{await peer.current.addIceCandidate(new RTCIceCandidate(candidate));}catch{}}setCallState("connected");}
     else if(s.type==="ice"&&s.payload){if(peer.current?.remoteDescription){try{await peer.current.addIceCandidate(new RTCIceCandidate(s.payload));}catch{}}else{pendingIce.current.push(s.payload);}}
     else if(s.type==="hangup"){stopMedia();onNotice("Druhý účastník ukončil hovor.");}
    }
   }catch{}
  };
  const timer=window.setInterval(()=>{if(alive)void poll()},1000);void poll();
  return()=>{alive=false;window.clearInterval(timer);active.current=false;};
 },[room,token,stopMedia,onNotice]);
 useEffect(()=>()=>{active.current=false;peer.current?.close();localStream.current?.getTracks().forEach(t=>t.stop())},[]);
 const toggleTrack=(kind:"audio"|"video")=>{
  const stream=localStream.current;if(!stream)return;
  const tracks=kind==="audio"?stream.getAudioTracks():stream.getVideoTracks();
  const next=kind==="audio"?!audioOn:!cameraOn;tracks.forEach(t=>t.enabled=next);
  if(kind==="audio")setAudioOn(next);else setCameraOn(next);
 };
 return <div className="call-tools">
  <div className="call-launch-row">
   <button className="call-launch audio" onClick={()=>void startCall(false)} disabled={callState!=="idle"}><Phone size={16}/> Zavolat</button>
   <button className="call-launch video" onClick={()=>void startCall(true)} disabled={callState!=="idle"}><Video size={16}/> Videohovor</button>{callState!=="idle"&&!visible&&<button className="call-launch" onClick={()=>setVisible(true)}>Pokračovat v hovoru</button>}
  </div>
  <p className="call-hint"><Users size={13}/> Hovor je dostupný druhému hráči v této místnosti. Nahrávání je vypnuté.</p>
  {error&&<p className="call-error">{error}</p>}
  {incoming&&<div className="incoming-call"><div><b>Příchozí {incoming.payload?.type==="offer"?"hovor":"volání"}</b><small>{partner||"Druhý hráč"} ti volá.</small></div><button onClick={()=>void accept()} className="btn-primary"><PhoneCall size={15}/> Přijmout</button><button onClick={()=>void reject()} className="btn-secondary"><PhoneOff size={15}/> Odmítnout</button></div>}
  {visible&&<section className={"call-window "+(expanded?"expanded":"")} aria-label="Probíhající hovor">
   <header><div><span className={"call-status-dot "+(callState==="connected"?"live":"")}/><b>{callState==="ringing"?"Příchozí hovor":callState==="calling"?"Volám…":callState==="connected"?"Probíhá hovor":"Hovor"}</b><small>{partner||"Druhý hráč"}</small></div><div className="call-window-actions"><button aria-label={expanded?"Zmenšit":"Zvětšit"} onClick={()=>setExpanded(v=>!v)}>{expanded?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button><button aria-label="Zavřít okno" onClick={()=>setVisible(false)}><X size={16}/></button></div></header>
   <div className="call-video-grid"><div className="remote-video">{callState!=="connected"&&<div className="call-placeholder"><span>♡</span><b>{callState==="calling"?"Čekám, až hovor přijme…":"Připojování…"}</b></div>}<video ref={remoteVideo} autoPlay playsInline/><span className="video-label">{partner||"Druhý hráč"}</span></div><div className="local-video"><video ref={localVideo} autoPlay playsInline muted/><span className="video-label">Ty</span></div></div>
   <div className="call-controls"><button onClick={()=>toggleTrack("audio")} aria-label={audioOn?"Vypnout mikrofon":"Zapnout mikrofon"}>{audioOn?<Mic size={17}/>:<MicOff size={17}/>}</button><button onClick={()=>toggleTrack("video")} aria-label={cameraOn?"Vypnout kameru":"Zapnout kameru"}>{cameraOn?<Camera size={17}/>:<VideoOff size={17}/>}</button><button className="hangup" onClick={()=>void hangup()} aria-label="Ukončit hovor"><PhoneOff size={18}/></button></div>
   <small className="call-privacy">Hovor se nenahrává. Kamera a mikrofon jsou aktivní jen během hovoru.</small>
  </section>}
 </div>;
}
