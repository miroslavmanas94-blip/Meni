"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Heart, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

type Level = "Lehká" | "Střední" | "Těžká" | "Extrémní" | "18+";
type Kind = "pravda" | "úkol";
type Entry = { id: string; kind: Kind; level: Level; category: string; text: string };
const LEVELS: Level[] = ["Lehká", "Střední", "Těžká", "Extrémní", "18+"];
const CATEGORIES = ["Romantické", "Vtipné", "Trapné", "Poznávací", "Odvážné", "Pohybové", "Kreativní", "Pro páry"];
const THEMES = [
  "první dojem", "společné zážitky", "hudba a filmy", "malé radosti", "kamarádství",
  "sny a plány", "každodenní zvyky", "humor", "dobrodružství", "vzájemná důvěra"
];
const TRUTHS = [
  "Jaká drobnost ti dokáže okamžitě zlepšit náladu, když jde o {t}?",
  "Která tvoje vzpomínka spojená s tématem {t} tě dodnes rozesměje?",
  "Co bys chtěl/a, aby o tvém pohledu na {t} druhý lépe chápal?",
  "Kdy ses naposledy cítil/a trochu nejistě kvůli {t} a co ti pomohlo?",
  "Jaké nečekané překvapení by ti udělalo radost v oblasti {t}?",
  "Který svůj zvyk kolem tématu {t} bys chtěl/a změnit a proč?",
  "Co tě na druhém nejvíc překvapilo, když přišlo na {t}?",
  "Jakou otázku o {t} by ses chtěl/a druhého zeptat, ale zatím nebyla příležitost?",
  "Kdybys mohl/a zopakovat jeden okamžik související s {t}, který by to byl?",
  "Jak by vypadal tvůj ideální den, kdyby se celý točil kolem {t}?"
];
const TASKS = [
  "Řekni druhému tři upřímné komplimenty související s tématem {t}.",
  "Předveď beze slov situaci z oblasti {t} a nech druhého hádat.",
  "Vymysli za 20 sekund krátký reklamní slogan pro vaše společné {t}.",
  "Nakresli prstem do vzduchu symbol, který ti připomíná {t}, a vysvětli ho.",
  "Vymysli legrační přezdívku pro váš nejvtipnější zážitek s tématem {t}.",
  "Popiš {t} třemi slovy, aniž bys použil/a samotné slovo z tématu.",
  "Vytvořte společně krátký příběh o {t}; každý přidá jednu větu.",
  "Předveď jednu emoci, kterou v tobě vyvolává {t}, a nech druhého hádat.",
  "Vymysli originální mini výzvu spojenou s {t}, kterou zvládnete do půl minuty.",
  "Řekni druhému jednu konkrétní věc, kterou bys chtěl/a společně vyzkoušet v oblasti {t}."
];
const LEVEL_TRUTH: Record<Level,string[]> = {
 "Lehká":["Jaká první myšlenka tě napadne, když se řekne {t}?","Co tě na {t} baví nejvíc?","Jaká maličkost kolem {t} ti vždy vykouzlí úsměv?"],
 "Střední":["Který názor na {t} se ti časem změnil?","Co bys chtěl/a v oblasti {t} dělat častěji?","Kdy ses díky {t} dozvěděl/a něco nového o sobě?"],
 "Těžká":["Co se ti o {t} přiznává hůř, ale rád/a bys to řekl/a?","Kterou hranici kolem {t} je pro tebe důležité respektovat?","Co bys na svém přístupu k {t} chtěl/a odvážně změnit?"],
 "Extrémní":["Jakou upřímnou zpětnou vazbu k {t} bys dokázal/a přijmout a proč?","Kterou obavu kolem {t} bys chtěl/a jednou překonat?","Co je na {t} něco, o čem obvykle mluvíš jen s lidmi, kterým důvěřuješ?"],
 "18+":["Jakou dospělou životní zkušenost kolem {t} bys dnes vyhodnotil/a jinak než dřív?","Které osobní hranice při {t} chceš, aby druhý vždy respektoval?","Jaká vážná životní lekce ti pomohla lépe chápat {t}?"]
};
const LEVEL_TASK: Record<Level,string[]> = {
 "Lehká":["Zahraj krátkou scénku o {t} jako herec v němé grotesce.","Řekni jednu hezkou věc o druhém, která souvisí s {t}.","Vymysli legrační gesto pro {t} a nauč ho druhého."],
 "Střední":["Vysvětli {t} pomocí přirovnání, které druhého rozesměje.","Vymysli malý plán, jak společně posunout vaše {t} o krok dál.","Zahraj moderátora a představ {t} jako hlavní zprávu dne."],
 "Těžká":["Sdílej konkrétní přání spojené s {t} a navrhni první krok k jeho splnění.","Vymysli výzvu k {t}, která tě trochu vyvede z komfortní zóny, ale zůstane bezpečná.","Předveď krátký proslov o tom, proč je pro tebe {t} důležité."],
 "Extrémní":["Řekni nahlas jednu věc, kterou chceš v oblasti {t} zkusit, a popiš svůj první krok.","Vymysli odvážnou, ale bezpečnou improvizaci na téma {t} a zahraj ji 20 sekund.","Požádej druhého o upřímnou, laskavou zpětnou vazbu k {t} a vyslechni ji bez přerušení."],
 "18+":["Představ si dospělou životní situaci kolem {t} a společně navrhněte zralé řešení.","Pojmenuj jednu hranici nebo hodnotu v oblasti {t}, kterou chceš jasně komunikovat.","Vymysli klidný a respektující způsob, jak začít obtížný rozhovor o {t}."]
};
const buildBank = (kind: Kind): Entry[] => LEVELS.flatMap((level, li) =>
  Array.from({length:100}, (_, n) => {
    const category = CATEGORIES[(n + li * 3 + (kind === "úkol" ? 2 : 0)) % CATEGORIES.length];
    const theme = THEMES[(n * 7 + li * 3) % THEMES.length];
    const templates = kind === "pravda" ? TRUTHS : TASKS;
    const special = kind === "pravda" ? LEVEL_TRUTH[level] : LEVEL_TASK[level];
    const template = n % 2 === 0 ? templates[(n + li) % templates.length] : special[(n + li) % special.length];
    const variation = [
      " Zkus odpovědět konkrétně a bez dlouhého přemýšlení.",
      " Přidej příklad ze svého života.",
      " Zapoj do odpovědi i druhého hráče.",
      " Zaměř se na detail, který tě napadne jako první.",
      " Zkus být originální a vyhni se obvyklé odpovědi.",
      " Vysvětli také, proč sis vybral/a právě tuto možnost.",
      " Pokud chceš, doplň odpověď krátkým příběhem.",
      " Zkus do toho zapojit humor a lehkost.",
      " Dej si pár vteřin na rozmyšlenou a pak odpověz.",
      " Můžeš si zvolit vlastní způsob, jak výzvu splnit."
    ][Math.floor(n / 10) % 10];
    return { id: kind + "-" + li + "-" + n, kind, level, category, text: template.replaceAll("{t}", theme) + variation };
  })
);
const TRUTH_BANK = buildBank("pravda");
const TASK_BANK = buildBank("úkol");
const USED_KEY = "meni-truth-dare-used-v1";
type UsedState = Record<string,string[]>;

export default function TruthOrDareGame({ onClose }: { onClose: () => void }) {
 const [stage,setStage] = useState<"setup"|"play">("setup");
 const [girl,setGirl] = useState("");
 const [boy,setBoy] = useState("");
 const [level,setLevel] = useState<Level>("Lehká");
 const [category,setCategory] = useState("Všechny typy");
 const [kind,setKind] = useState<Kind|null>(null);
 const [turn,setTurn] = useState(0);
 const [current,setCurrent] = useState<Entry|null>(null);
 const [used,setUsed] = useState<UsedState>({});
 const [adultConfirmed,setAdultConfirmed] = useState(false);
 const [showAdultGate,setShowAdultGate] = useState(false);
 const [notice,setNotice] = useState("");
 useEffect(()=>{try{const raw=localStorage.getItem(USED_KEY);if(raw)setUsed(JSON.parse(raw) as UsedState)}catch{}},[]);
 const pool = useMemo(()=>[...TRUTH_BANK,...TASK_BANK].filter(p=>p.level===level&&(category==="Všechny typy"||p.category===category)),[level,category]);
 const usedKey = level+"|"+category;
 const remaining = pool.filter(p=>!(used[usedKey]||[]).includes(p.id));
 const chooseKind = (next:Kind) => {
   if(!girl.trim()||!boy.trim()){setNotice("Nejdřív vyplň jméno holky i kluka.");return;}
   if(level==="18+"&&!adultConfirmed){setShowAdultGate(true);return;}
   const candidates=pool.filter(p=>p.kind===next&&!(used[usedKey]||[]).includes(p.id));
   if(!candidates.length){setNotice("Tahle sada už je vyčerpaná. Obnov sadu, nebo změň úroveň či typ.");return;}
   const pick=candidates[Math.floor(Math.random()*candidates.length)];
   setKind(next);setCurrent(pick);setStage("play");setTurn(t=>t+1);
   const updated={...used,[usedKey]:[...(used[usedKey]||[]),pick.id]};setUsed(updated);try{localStorage.setItem(USED_KEY,JSON.stringify(updated))}catch{}
 };
 const next = () => {
   setStage("setup");setCurrent(null);setKind(null);
 };
 const resetSet = () => {
   const updated={...used,[usedKey]:[]};setUsed(updated);try{localStorage.setItem(USED_KEY,JSON.stringify(updated))}catch{}
   setNotice("Použité položky této sady byly obnoveny.");
 };
 return <div className="td-overlay"><section className="td-app" role="dialog" aria-modal="true" aria-label="Pravda, nebo úkol">
  <header className="td-header"><button className="td-back" onClick={stage==="play"?next:onClose}><ArrowLeft size={17}/> {stage==="play"?"Zpět k výběru":"Zavřít"}</button><div className="td-logo"><span><Heart size={18} fill="currentColor"/></span><div><b>Pravda, nebo úkol</b><small>Bez kódu · jeden telefon · dva hráči</small></div></div><span className="td-counter">{TRUTH_BANK.length} pravd · {TASK_BANK.length} úkolů</span></header>
  {stage==="setup"?<div className="td-setup"><div className="td-intro"><span className="td-eyebrow"><Sparkles size={14}/> VAŠE PRAVIDLA, VAŠE TEMPO</span><h2>Dvě jména.<br/><em>Jedna odvážná hra.</em></h2><p>Vyberte si úroveň a typy výzev. Hra běží bez místnosti a bez kódu, přímo na jednom telefonu.</p></div>
   <div className="td-names"><label>Jméno holky<input value={girl} maxLength={24} onChange={e=>setGirl(e.target.value)} placeholder="Např. Eliška"/></label><label>Jméno kluka<input value={boy} maxLength={24} onChange={e=>setBoy(e.target.value)} placeholder="Např. Matěj"/></label></div>
   <div className="td-label">Úroveň</div><div className="td-levels">{LEVELS.map((l,i)=><button key={l} className={level===l?"active":""} onClick={()=>setLevel(l)}><b>{l}</b><small>{["Na rozehřátí","Pohodová výzva","Více odvahy","Pro zkušené hráče","Jen pro dospělé"][i]}</small></button>)}</div>
   <label className="td-label" htmlFor="td-category">Typ otázek a úkolů</label><select id="td-category" className="td-select" value={category} onChange={e=>setCategory(e.target.value)}><option>Všechny typy</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
   <div className="td-stats"><div><b>{TRUTH_BANK.filter(p=>p.level===level).length}</b><small>pravd na úrovni</small></div><div><b>{TASK_BANK.filter(p=>p.level===level).length}</b><small>úkolů na úrovni</small></div><div><b>{remaining.length}</b><small>zbývá v sadě</small></div></div>
   <div className="td-choose"><button onClick={()=>chooseKind("pravda")}><span>?</span><b>Pravda</b><small>Odpověz upřímně</small></button><button onClick={()=>chooseKind("úkol")}><span>↗</span><b>Úkol</b><small>Přijmi výzvu</small></button></div>
   <div className="td-rules"><ShieldCheck size={18}/><p><b>Bez nátlaku.</b> Každý může úkol přeskočit. Nic se nenahrává ani neposílá. Použité položky se ukládají v tomto prohlížeči, dokud sadu neobnovíte.</p></div>
   {showAdultGate&&<div className="td-adult"><b>Potvrzení věku 18+</b><p>Tato oddělená úroveň obsahuje pouze témata dospělého života, osobních hranic a vztahové komunikace; neobsahuje explicitní sexuální obsah. Potvrzení je vlastní prohlášení, nikoli ověření totožnosti.</p><label><input type="checkbox" checked={adultConfirmed} onChange={e=>setAdultConfirmed(e.target.checked)}/> Oba hráči potvrzují, že jim je alespoň 18 let.</label><button className="td-confirm" onClick={()=>{setShowAdultGate(false);if(!adultConfirmed)setNotice("Úroveň 18+ zůstala zamčená.");}}>Potvrdit</button></div>}
   <div className="td-bottom-actions"><button className="td-reset" onClick={resetSet}><RotateCcw size={14}/> Obnovit použité položky</button><button className="td-close" onClick={onClose}>Zpět do Meni</button></div>
  </div>:<div className="td-play"><div className="td-turn"><span className="td-turn-badge">KOLO {turn}</span><span>Na řadě je <b>{turn%2===1?girl||"Holka":boy||"Kluk"}</b></span><span>{current?.level} · {current?.category}</span></div><div className="td-prompt"><span>{kind==="pravda"?"PRAVDA":"ÚKOL"}</span><div className="td-big-icon">{kind==="pravda"?"?":"↗"}</div><h2>{current?.text}</h2><p>{kind==="pravda"?"Odpověz tak upřímně, jak chceš.": "Zvládni výzvu, nebo ji bez vysvětlování přeskoč."}</p><button className="td-done" onClick={next}><Check size={17}/> Hotovo, předat telefon</button><button className="td-skip" onClick={next}>Přeskočit bez vysvětlování</button></div><div className="td-play-footer"><span><ShieldCheck size={15}/> Respektujte hranice obou hráčů.</span><button onClick={()=>chooseKind(kind==="pravda"?"úkol":"pravda")}>Změnit na {kind==="pravda"?"úkol":"pravdu"}</button></div></div>}
  {notice&&<div className="td-notice" role="status">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
 </section></div>;
}
