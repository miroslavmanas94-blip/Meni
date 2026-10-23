"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Heart, RotateCcw, ShieldCheck, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";

type Level = "Lehká" | "Střední" | "Těžká" | "Extrémní" | "18+";
type Kind = "pravda" | "úkol";
type Stage = "setup" | "wheel" | "reveal" | "done";
type Card = { id: string; level: Level; category: string; kind: Kind; text: string };
const LEVELS: Level[] = ["Lehká", "Střední", "Těžká", "Extrémní", "18+"];
const CATEGORIES = ["Flirtování", "Vtipné", "Trapné", "Poznávací", "Odvážné", "Pohybové", "Kreativní", "Pro páry"];
const TRUTHS: Record<Level,string[]> = {
 "Lehká":["Co ti na druhém vykouzlilo první úsměv?","Jaký kompliment si pamatuješ dodnes?","Která písnička nejlépe vystihuje tvoji náladu?","Jaké malé gesto ti zlepší den?","Jak by vypadal tvůj ideální společný večer?"],
 "Střední":["Co tě na druhém příjemně překvapilo?","Jak poznáš, že se ti někdo opravdu líbí?","Který společný zážitek by sis rád/a zopakoval/a?","Co je pro tebe nejhezčí způsob, jak projevit zájem?","Jakou maličkost bys chtěl/a, aby si o tobě druhý zapamatoval?"],
 "Těžká":["Co se ti říká těžko, i když bys chtěl/a být upřímný/á?","Kdy ses naposledy cítil/a opravdu pochopený/á?","Jaká nejistota ti občas brání udělat první krok?","Co potřebuješ, abys někomu mohl/a důvěřovat?","Jakou otázku ses bál/a položit, ale rád/a bys znal/a odpověď?"],
 "Extrémní":["Přiznej něco odvážného, co by o tobě druhý možná nečekal.","Jaký romantický krok bys chtěl/a někdy zažít?","Kdy jsi naposledy cítil/a motýly v břiše a proč?","Co je pro tebe nejodvážnější způsob, jak dát najevo city?","Jaké přání bys vyslovil/a, kdybys věděl/a, že nebudeš souzen/a?"],
 "18+":["Jaký druh dospělé romantické atmosféry ti připadá nejpřitažlivější?","Jak poznáš, že je flirt oboustranný a příjemný?","Která drobná pozornost v dospělém vztahu v tobě probudí jiskru?","O jakém romantickém zážitku by sis rád/a s partnerem/partnerkou promluvil/a?","Jak nejraději komunikuješ svoje hranice a přání v intimním vztahu?"]
};
const TASKS: Record<Level,string[]> = {
 "Lehká":["Řekni druhému tři milé věci.","Předveď svou nejvtipnější taneční pózu po dobu pěti sekund.","Vymysli pro druhého přezdívku a vysvětli ji.","Zazpívej jednu větu jako operní pěvec.","Udělej dramatickou reklamu na váš společný večer."],
 "Střední":["Udrž oční kontakt deset sekund, pokud je to oběma příjemné.","Vymysli originální kompliment, který není o vzhledu.","Zahraj beze slov, jak vypadá tvoje první rande snů.","Nech druhého vybrat písničku a věnuj mu refrén.","Řekni, co bys naplánoval/a na překvapivé společné odpoledne."],
 "Těžká":["Řekni druhému něco hezkého, co sis dosud nechával/a pro sebe.","Předveď, jak bys nenápadně flirtoval/a na večírku.","Vymysli osobní pozvánku na rande během dvaceti sekund.","Popiš svůj ideální romantický moment jako filmový trailer.","Zeptej se druhého na něco, co vám pomůže se lépe poznat."],
 "Extrémní":["Věnuj druhému upřímný kompliment a dívej se mu do očí, pokud je to příjemné.","Zahraj krátkou scénku prvního setkání jako v romantickém filmu.","Vymysli odvážnou, ale respektující zprávu, kterou bys poslal/a na rande.","Řekni, jaké gesto by ti dodalo odvahu projevit zájem.","Vyberte si společnou mini výzvu, kterou oba dobrovolně přijmete."],
 "18+":["Popiš romantickou atmosféru pro dospělé, ve které by ses cítil/a příjemně.","Vymysli smyslný, ale neexplicitní kompliment, který respektuje hranice druhého.","Pověz, jaká drobná pozornost dokáže navodit jiskru v dospělém vztahu.","Navrhni romantickou aktivitu pro dva, se kterou oba souhlasíte.","Zeptej se druhého, jaký druh flirtu mu připadá příjemný; přijmi jakoukoli odpověď."]
};
const USED_KEY = "meni-truth-dare-used-v2";
const rand = (n:number) => Math.floor(Math.random()*n);
const makeCards = (): Card[] => LEVELS.flatMap((level,li)=>Array.from({length:100},(_,i)=>({
 id: level+"-"+i, level,
 category: CATEGORIES[(i+li*3)%CATEGORIES.length],
 kind: i%2===0?"pravda" as Kind:"úkol" as Kind,
 text: (i%2===0?TRUTHS[level][i%TRUTHS[level].length]:TASKS[level][i%TASKS[level].length])
})));
const BANK = makeCards();

export default function TruthOrDareGame({ onClose }: { onClose: () => void }) {
 const [stage,setStage]=useState<Stage>("setup");
 const [girl,setGirl]=useState("");
 const [boy,setBoy]=useState("");
 const [level,setLevel]=useState<Level>("Lehká");
 const [category,setCategory]=useState("Všechny typy");
 const [current,setCurrent]=useState<Card|null>(null);
 const [kind,setKind]=useState<Kind>("pravda");
 const [turn,setTurn]=useState(0);
 const [starter,setStarter]=useState(()=>rand(2));
 const [adultConfirmed,setAdultConfirmed]=useState(false);
 const [showAdultGate,setShowAdultGate]=useState(false);
 const [flipped,setFlipped]=useState(false);
 const [used,setUsed]=useState<string[]>([]);
 const [notice,setNotice]=useState("");
 const [sound,setSound]=useState(true);
 const [soundReady,setSoundReady]=useState(false);
 const audioRef=useRef<AudioContext|null>(null);
 useEffect(()=>{try{const saved=localStorage.getItem(USED_KEY);if(saved)setUsed(JSON.parse(saved) as string[])}catch{}return()=>{audioRef.current?.close().catch(()=>{});};},[]);
 const pool=useMemo(()=>BANK.filter(c=>c.level===level&&(category==="Všechny typy"||c.category===category)),[level,category]);
 const remaining=pool.filter(c=>!used.includes(c.id));
 const player=turn===0?starter:(starter+turn)%2;
 const playerName=player===0?(girl.trim()||"Hráč 1"):(boy.trim()||"Hráč 2");
 const playTone=(frequency=520)=>{if(!sound)return;try{const Ctx=window.AudioContext;if(!Ctx)return;const ctx=audioRef.current||new Ctx();audioRef.current=ctx;void ctx.resume();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type="sine";osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.07,ctx.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.22);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.23);}catch{}};
 const persistUsed=(next:string[])=>{setUsed(next);try{localStorage.setItem(USED_KEY,JSON.stringify(next))}catch{}};
 const startSpin=()=>{if(!girl.trim()||!boy.trim()){setNotice("Nejdřív vyplň jména obou hráčů.");return;}if(level==="18+"&&!adultConfirmed){setShowAdultGate(true);return;}if(!remaining.length){setNotice("Tato sada už je vyčerpaná. Obnov ji nebo změň úroveň.");return;}setStage("wheel");setCurrent(null);setFlipped(false);playTone(440);};
 const reveal=(requestedKind:Kind=kind)=>{const candidates=remaining.filter(c=>c.kind===requestedKind);if(!candidates.length){setNotice("Pro tento typ už nezbývá karta. Zkus druhý typ nebo obnov sadu.");setStage("setup");return;}const card=candidates[rand(candidates.length)];setKind(requestedKind);setCurrent(card);persistUsed([...used,card.id]);setFlipped(false);setStage("reveal");playTone(660);};
 const nextTurn=()=>{setTurn(t=>t+1);setCurrent(null);setFlipped(false);setStage("setup");setNotice("");playTone(560);};
 const resetSet=()=>{persistUsed([]);setNotice("Použité karty byly obnoveny.");};
 const spinChoice=()=>{const selectedKind:Kind=Math.random()<.5?"pravda":"úkol";setKind(selectedKind);playTone(350);window.setTimeout(()=>reveal(selectedKind),650);};
 return <div className="td-overlay"><section className="td-app td-neon" role="dialog" aria-modal="true" aria-label="Pravda, nebo úkol">
  <header className="td-header"><button className="td-back" onClick={stage==="setup"?onClose:()=>setStage("setup")}><ArrowLeft size={17}/>{stage==="setup"?"Zavřít":"Zpět"}</button><div className="td-logo"><span><Heart size={18} fill="currentColor"/></span><div><b>Pravda, nebo úkol</b><small>NEON EDITION · HRA PRO DVA</small></div></div><button className="td-sound" onClick={()=>setSound(s=>!s)} aria-label={sound?"Vypnout zvuk":"Zapnout zvuk"}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}<span>{sound?"Zvuk zapnut":"Zvuk vypnut"}</span></button></header>
  <div className="td-body">
  {stage==="setup"&&<div className="td-setup"><div className="td-intro"><span className="td-eyebrow"><Sparkles size={14}/> KOLO ZAČÍNÁ PRÁVĚ TEĎ</span><h2>Dvě jména.<br/><em>Jedna jiskra.</em></h2><p>Roztočte kolo, odhalte kartu a předávejte si tah. Každou výzvu můžete bez vysvětlování přeskočit.</p></div>
   <div className="td-names"><label>Hráč 1<input value={girl} maxLength={24} onChange={e=>setGirl(e.target.value)} placeholder="Jméno prvního hráče"/></label><label>Hráč 2<input value={boy} maxLength={24} onChange={e=>setBoy(e.target.value)} placeholder="Jméno druhého hráče"/></label></div>
   <div className="td-label">Úroveň hry</div><div className="td-levels">{LEVELS.map((l,i)=><button key={l} className={(level===l?"active ":"")+"td-level-"+i} onClick={()=>{setLevel(l);if(l!=="18+")setShowAdultGate(false)}}><b>{l}</b><small>{["Rozjezd","Jiskření","Odvaha","Napětí","Smyslné · dospělí"][i]}</small></button>)}</div>
   <label className="td-label" htmlFor="td-category">Kategorie</label><select id="td-category" className="td-select" value={category} onChange={e=>setCategory(e.target.value)}><option>Všechny typy</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
   <div className="td-wheel-preview"><div className="td-wheel-ring"><span>?</span><span>♡</span><span>✦</span><span>↗</span><i/></div><div><b>Točí se osud…</b><small>{remaining.length} karet zbývá · {turn+1}. kolo</small></div></div>
   <div className="td-start-row"><button className="td-spin-button" onClick={startSpin}><Zap size={18} fill="currentColor"/> Roztočit kolo <ChevronRight size={18}/></button><button className="td-random-start" onClick={()=>{const s=rand(2);setStarter(s);setTurn(0);setNotice((s===0?(girl.trim()||"Hráč 1"):(boy.trim()||"Hráč 2"))+" začíná.");}} title="Náhodně vybrat začínajícího">⤨ Náhodný start</button></div>
   <div className="td-rules"><ShieldCheck size={18}/><p><b>Bez nátlaku.</b> Přeskočení je vždy v pořádku. Karty se používají bez opakování, dokud sadu neobnovíte.</p></div>
   {showAdultGate&&<div className="td-adult"><b>Úroveň 18+ · potvrzení věku</b><p>Obsah je smyslný a vztahový, ne explicitní. Toto je vlastní prohlášení, nikoli nezávislé ověření věku.</p><label><input type="checkbox" checked={adultConfirmed} onChange={e=>setAdultConfirmed(e.target.checked)}/> Oba hráči potvrzují, že jim je alespoň 18 let.</label><button className="td-confirm" onClick={()=>{setShowAdultGate(false);if(!adultConfirmed)setNotice("Úroveň 18+ zůstává zamčená.");else setNotice("Potvrzení uloženo pro tuto relaci.");}}>Potvrdit</button></div>}
   <div className="td-bottom-actions"><button className="td-reset" onClick={resetSet}><RotateCcw size={14}/> Obnovit karty</button><span className="td-progress-label">HRÁNO {used.length} / {BANK.length}</span><button className="td-close" onClick={onClose}>Zpět do Meni</button></div>
  </div>}
  {stage==="wheel"&&<div className="td-wheel-stage"><span className="td-eyebrow">TAH {turn+1} · NA ŘADĚ</span><h2>{playerName}</h2><p>Vyber, co tě čeká. Nebo nech rozhodnout kolo.</p><div className="td-wheel-visual"><div className="td-wheel-pointer">▼</div><button className="td-wheel-button" onClick={spinChoice} aria-label="Roztočit kolo"><span className="td-wheel-sector sector-one">PRAVDA</span><span className="td-wheel-sector sector-two">ÚKOL</span><span className="td-wheel-center"><Zap size={28}/></span></button></div><div className="td-kind-choice"><button onClick={()=>{setKind("pravda");reveal()}}> <b>?</b><span>Pravda</span></button><button onClick={()=>{setKind("úkol");reveal()}}><b>↗</b><span>Úkol</span></button></div><button className="td-text-back" onClick={()=>setStage("setup")}><ArrowLeft size={15}/> Upravit nastavení</button></div>}
  {stage==="reveal"&&current&&<div className="td-card-stage"><div className="td-turn-line"><span>KOLO {(turn+1).toString().padStart(2,"0")}</span><b>NA ŘADĚ JE {playerName.toLocaleUpperCase("cs-CZ")}</b><span>{current.level} · {current.category}</span></div><button className={"td-flip-card "+(flipped?"is-flipped":"")} onClick={()=>{if(!flipped){setFlipped(true);playTone(780)}}} aria-label="Otočit kartu"><span className="td-card-inner"><span className="td-card-face td-card-back"><Sparkles size={28}/><b>Tvá výzva</b><small>Ťukni pro odhalení</small><span className="td-card-mark">M / DUO</span></span><span className="td-card-face td-card-front"><span className="td-card-type">{current.kind==="pravda"?"PRAVDA":"ÚKOL"}</span><span className="td-card-spark">✦</span><b>{current.text}</b><small>{flipped?"Tvoje kolo. Zvládni to po svém.":" "}</small><span className="td-card-mark">M / DUO</span></span></span></button>{!flipped&&<p className="td-flip-hint">Ťukni na kartu a odhal zadání</p>}{flipped&&<div className="td-card-actions"><button className="td-spin-button" onClick={()=>{setStage("done");playTone(660)}}><Check size={17}/> Hotovo</button><button className="td-skip" onClick={()=>{setStage("done");setNotice("Výzva přeskočena bez penalizace.");playTone(390)}}>Přeskočit bez penalizace</button></div>}</div>}
  {stage==="done"&&<div className="td-done-stage"><span className="td-done-check"><Check size={28}/></span><span className="td-eyebrow">KOLO DOKONČENO</span><h2>Dobrá práce,<br/><em>{playerName}.</em></h2><p>{notice==="Výzva přeskočena bez penalizace."?"Výzva byla přeskočena. Žádné body se neztrácí.":"Tah je hotový. Předej telefon druhému hráči."}</p><div className="td-next-player"><small>DALŠÍ NA ŘADĚ</small><b>{(player===0?boy:girl).trim()||"Druhý hráč"}</b></div><button className="td-spin-button" onClick={nextTurn}>Předat tah <ChevronRight size={18}/></button><button className="td-text-back" onClick={()=>setStage("setup")}>Zpět k nastavení</button></div>}
  </div>{notice&&<div className="td-notice" role="status">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
 </section></div>;
}
