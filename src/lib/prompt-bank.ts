export type GameId = "truth" | "know" | "rather" | "think" | "match" | "quick" | "story" | "wheel" | "compat" | "secret" | "voice" | "custom";
export type BankPrompt = { id: string; game: GameId; category: string; text: string; kind: "question" | "task" };
const topics = [
 "první dojem","společné vzpomínky","každodenní maličkosti","humor","důvěra","podpora v těžký den","sny do budoucna","cestování","jídlo","hudba","filmy a příběhy","koníčky","přátelství","učení se novým věcem","odpočinek","překvapení","společné tradice","řešení neshod","osobní hodnoty","odvaha","kreativita","dětství","malé radosti","plány na víkend","to, co vás rozesměje"
];
const categories = ["Poznávání","Vzpomínky","Každodennost","Humor","Důvěra","Sny a plány","Společný čas","Kreativita","Názory","Překvapení"];
const truthFrames = [
 "Kterou konkrétní maličkost kolem {t} bych ti chtěl/a někdy poděkovat?",
 "Jaká tvoje vzpomínka na {t} mi podle tebe nejvíc utkvěla v hlavě?",
 "Co bych se o tvém pohledu na {t} měl/a dozvědět, ale ještě jsem se nezeptal/a?",
 "Kdybys měl/a vysvětlit, proč je pro tebe {t} důležité, čím bys začal/a?",
 "Který okamžik spojený s {t} by sis přál/a prožít ještě jednou?",
 "Co tě na mém přístupu k tématu {t} nejvíc překvapuje?",
 "Kdy ses naposledy díky {t} cítil/a opravdu pochopeně?",
 "Jakou drobnost týkající se {t} si o tobě často neuvědomuji?",
 "Co bys chtěl/a, abychom v oblasti {t} dělali častěji?",
 "Jaká je tvoje nejvtipnější příhoda související s {t}?",
 "Co je na tématu {t} něco, na co jsi na sebe hrdý/á?",
 "Jaký malý krok v oblasti {t} by ti v nejbližší době udělal radost?",
 "Co tě v souvislosti s {t} dokáže snadno znervóznit a co ti pomáhá?",
 "Jak se tvůj názor na {t} změnil za posledních pár let?",
 "Kterou otázku o {t} by sis přál/a, abych ti položil/a?",
 "Jak by vypadal tvůj ideální společný zážitek spojený s {t}?",
 "Co je jedna věc kolem {t}, kterou bys rád/a vyzkoušel/a poprvé?",
 "Který můj zvyk týkající se {t} ti připadá milý nebo legrační?",
 "Jak bych tě mohl/a lépe podpořit, když právě řešíš {t}?",
 "Kdyby naše společná kapitola o {t} měla název, jak by zněl?"
];
const knowFrames = [
 "Jakou možnost bych si nejspíš vybral/a, kdyby šlo o {t}?",
 "Co by mě v situaci týkající se {t} potěšilo nejvíc?",
 "Který detail o {t} bych si všiml/a jako první?",
 "Jak bych pravděpodobně reagoval/a, kdyby se nám při {t} něco pokazilo?",
 "Kterou ze dvou cest bych u {t} upřednostnil/a: pohodlnou, nebo dobrodružnou?",
 "Co bych si o tématu {t} přál/a změnit jako první?",
 "Jaký dárek nebo gesto spojené s {t} by mě nejvíc vystihovalo?",
 "Kdybych měl/a volný den věnovat tématu {t}, jak bych ho strávil/a?",
 "Která drobnost kolem {t} mi dokáže okamžitě zlepšit náladu?",
 "Co bych si na {t} naplánoval/a dopředu a co nechal/a spontánně?",
 "Jaký můj názor na {t} bys tipnul/a, i kdybychom o něm ještě nemluvili?",
 "Co by mě na {t} nejspíš rozesmálo?",
 "Jak bych popsal/a svůj ideální výsledek v oblasti {t}?",
 "Který problém kolem {t} bych chtěl/a řešit jako první?",
 "Jakou roli bych si při společné aktivitě s tématem {t} vybral/a?",
 "Co bych si zvolil/a, kdybych mohl/a v tématu {t} něco okamžitě umět?",
 "Jakou vzpomínku spojenou s {t} bych si nejspíš uchoval/a?",
 "Jaký kompromis kolem {t} by mi připadal férový?",
 "Který způsob překvapení spojený s {t} by mi seděl nejvíc?",
 "Co bych v oblasti {t} raději dělal/a společně než sám/sama?"
];
const thinkFrames = [
 "Kdybych právě teď mohl/a vybrat jednu věc související s {t}, co by to bylo?",
 "Jakou barvou bych podle tebe popsal/a {t} a proč?",
 "Která ze tří možností by mě u {t} nejvíc lákala: klid, smích, nebo dobrodružství?",
 "Jaký první nápad mě napadne, když řekneš {t}?",
 "Kdybych měl/a téma {t} proměnit ve film, jaký žánr bych zvolil/a?",
 "Jakou superschopnost bych chtěl/a využít při {t}?",
 "Které místo bych si spojil/a s tématem {t}?",
 "Jakou písničku bych vybral/a jako soundtrack k {t}?",
 "Co bych při {t} udělal/a jako úplně první?",
 "Kdyby {t} bylo zvíře, které bych vybral/a?",
 "Jaký předmět bych použil/a jako symbol pro {t}?",
 "Co bych o {t} tipoval/a, kdybych měl/a jen pět sekund na odpověď?",
 "Jak by vypadal můj vysněný scénář pro {t}?",
 "Jakou překážku bych při {t} čekal/a nejméně?",
 "Kterou ze svých vlastností bych při {t} nejvíc využil/a?",
 "Jakou vtipnou přezdívku bych dal/a tématu {t}?",
 "Kdybych mohl/a poslat jednu zprávu o {t} z budoucnosti, co by v ní bylo?",
 "Jaký nečekaný zvrat bych do příběhu o {t} přidal/a?",
 "Co bych při {t} nejspíš zapomněl/a vzít s sebou?",
 "Jakou malou odměnu bych si po {t} vybral/a?"
];
const matchFrames = [
 "Jak důležitý je pro tebe {t} na stupnici od 1 do 10 a proč?",
 "Co je podle tebe nejlepší společný způsob, jak prožít {t}?",
 "Která hodnota by měla při rozhodování o {t} dostat přednost?",
 "Kolik plánování podle tebe vyžaduje příjemné {t}?",
 "Co je pro tebe při {t} důležitější: pohodlí, nebo nové zážitky?",
 "Jakou jednu věc by měl každý z nás při {t} respektovat?",
 "Co by podle tebe udělalo z obyčejného {t} skvělou vzpomínku?",
 "Jaký rozpočet nebo množství času je pro {t} podle tebe tak akorát?",
 "Kdy je podle tebe nejlepší chvíle věnovat se {t}?",
 "Jaký kompromis kolem {t} by fungoval pro oba?",
 "Co bychom si měli o {t} vyjasnit předem?",
 "Jaký malý rituál by mohl naše {t} zpříjemnit?",
 "Co je podle tebe nejčastější chyba, kterou lidé při {t} dělají?",
 "Jak bychom měli poznat, že se nám {t} povedlo?",
 "Co bys při {t} raději sdílel/a a co si nechal/a jen pro sebe?",
 "Jak moc je při {t} důležitá spontánnost oproti jistotě?",
 "Která část {t} by měla být vždy dobrovolná a bez nátlaku?",
 "Co nám může pomoci, když máme na {t} odlišný názor?",
 "Jaký nový nápad by stálo za to při {t} společně otestovat?",
 "Co by sis přál/a, abychom si po {t} řekli?"
];
const compatFrames = [
 "Vyberte každý jednu prioritu pro {t}: klid, dobrodružství, nebo překvapení. Co zvítězilo?",
 "Dokončete každý větu „Při {t} se cítím nejlépe, když…“ a porovnejte odpovědi.",
 "Každý navrhněte ideální plán pro {t}; v čem se vaše plány potkávají?",
 "Ohodnoťte samostatně důležitost {t} od 1 do 10 a vysvětlete rozdíl.",
 "Každý vyberte jednu věc, kterou byste při {t} určitě zachovali, a jednu, kterou byste změnili.",
 "Popište každý třemi slovy, co pro vás znamená {t}, a najděte společné slovo.",
 "Každý navrhněte kompromis pro situaci kolem {t}; který připadá férovější oběma?",
 "Odpovězte každý, co je při {t} důležitější: plán, flexibilita, nebo týmová domluva.",
 "Každý řekněte, co by vám v oblasti {t} pomohlo cítit se víc vyslyšeně.",
 "Každý vymyslete jeden malý cíl související s {t} na příští měsíc.",
 "Vyberte každý jednu vzpomínku na {t}; co mají vaše příběhy společného?",
 "Každý pojmenujte jednu obavu a jednu naději spojenou s {t}.",
 "Každý vyberte, zda je pro {t} lepší tradice, nebo nová zkušenost, a zdůvodněte to.",
 "Vymyslete každý odlišný způsob, jak si užít {t}, a zkuste spojit oba nápady.",
 "Každý popište, co je podle vás u {t} známka dobré spolupráce.",
 "Porovnejte, jakou roli má při {t} humor a jakou vážnost.",
 "Každý navrhněte gesto podpory, které by vám při {t} udělalo radost.",
 "Každý vyberte jednu hranici, kterou je při {t} důležité respektovat.",
 "Každý navrhněte otázku, kterou byste si o {t} chtěli navzájem položit.",
 "Řekněte každý, jak poznáte, že jste si při {t} opravdu porozuměli."
];
const quickActions = [
 "Řekni druhému tři věci, které na něm oceňuješ.",
 "Vymysli originální název pro vaše dnešní dobrodružství.",
 "Popiš svou dnešní náladu jen pomocí čtyř emoji.",
 "Vymysli krátký slogan pro váš tým a řekni ho jako moderátor.",
 "Předveď beze slov běžnou činnost a nech druhého hádat.",
 "Vytvoř z pěti slov mini příběh, ve kterém jste oba hrdinové.",
 "Řekni jazykolam dvakrát za sebou bez chyby.",
 "Vymysli tři neobvyklé využití obyčejné ponožky.",
 "Popiš druhého jako počasí a vysvětli svůj výběr.",
 "Vymysli jméno pro imaginární kavárnu, kterou byste provozovali.",
 "Vyslov větu „tohle je nejlepší plán“ třemi různými emocemi.",
 "Nakresli prstem do vzduchu symbol vašeho dua a nech druhého hádat.",
 "Vymysli reklamní slogan pro nejvšednější věc v místnosti.",
 "Řekni krátké poděkování za něco konkrétního z posledního týdne.",
 "Vymysli bezpečnou mini výzvu, kterou zvládnete oba do minuty.",
 "Popiš ideální společný den v přesně sedmi slovech.",
 "Vymysli legrační název pro film o vašem dnešním dni.",
 "Zkus vyjmenovat pět věcí určité barvy, které máte poblíž.",
 "Vytvoř slovní erb vašeho týmu ze tří symbolů.",
 "Řekni jednu laskavou věc, kterou druhý možná neví, že dělá dobře."
];
const storyOpenings = [
 "Ve schránce se objevil dopis, který měl být doručen před sto lety…",
 "Na mapě vašeho města se přes noc objevila nová ulička…",
 "Obyčejný deštivý den přerušilo zaklepání na okno zvenčí…",
 "Na bleším trhu jste našli krabičku se dvěma jmény…",
 "Váš robotický pomocník si najednou začal psát deník…",
 "Vlak zastavil na stanici, která nebyla na žádné mapě…",
 "V knihovně se otevřela kniha, ve které byl popsán váš zítřek…",
 "Při pikniku jste objevili malou lahvičku se zprávou…",
 "Město vyhlásilo soutěž, jejíž hlavní cenou je splněné přání…",
 "Z rádia se ozvala zpráva určená přesně vám dvěma…",
 "Dostali jste klíč, ale nikdo vám neřekl, co odemyká…",
 "V parku se objevil strom, na kterém rostly papírové hvězdy…",
 "Vaše oblíbená hra se stala skutečností a první úkol zněl…",
 "Na obloze se objevilo souhvězdí ve tvaru vašeho tajného symbolu…",
 "Neznámý cestovatel vám nabídl výměnu jedné vzpomínky za jednu mapu…",
 "Našli jste dveře za regálem, které vedly do úplně jiného ročního období…",
 "Váš společný playlist začal předpovídat drobné události…",
 "Z budoucnosti přišla pohlednice s jedinou větou…",
 "Na slavnosti zhasla světla a po jejich rozsvícení se změnilo všechno…",
 "Váš domácí mazlíček vám přinesl předmět, který nikdo z vás nepoznal…",
 "V kavárně vám servírovali dezert s tajným vzkazem…",
 "V muzeu se jeden obraz změnil pokaždé, když jste se otočili…",
 "Našli jste deník, který doplňoval věty podle vašich odpovědí…",
 "Váš výtah tentokrát zastavil v patře, které neexistovalo…",
 "Na dveřích se objevil seznam tří úkolů podepsaný vašimi budoucími já…"
];
const ratherOptions = [
 "vyrazit na výlet bez plánu","naplánovat každý detail dobrodružství","uvařit nové jídlo doma","ochutnat neznámou kuchyni venku","dostat ručně psaný dopis","dostat osobní hlasovou zprávu","strávit den u moře","objevovat horské stezky","hrát kooperativní deskovku","zkusit společný kreativní workshop","uspořádat piknik v parku","udělat filmový maraton podle tématu","objevovat neznámé město","připravit malé překvapení","vytvořit společný playlist","založit vlastní tradici","povídat si dlouho bez telefonů","soutěžit v legračních minihrách","strávit víkend offline","mít den plný drobných laskavostí","navštívit muzeum s neobvyklou výstavou","vyrazit na ranní procházku","zkusit nový sport pro začátečníky","vyměnit si knihy s osobním vzkazem","natočit krátký komediální film","vytvořit časovou kapsli","učit se společně cizí fráze","postavit něco z věcí, které už máte","naplánovat den podle náhodných voleb","uspořádat domácí kvíz","navštívit místo z dětství","vymyslet příběh po jedné větě","vyměnit si role při plánování večera","udělat seznam budoucích dobrodružství"
];
const voiceTasks = [
 "Nahraj desetivteřinovou zprávu, která druhému zlepší den.",
 "Vyprávěj hlasem sportovního komentátora, jak probíhal tvůj dnešek.",
 "Řekni tři komplimenty tak, jako bys uváděl/a slavnostní předávání cen.",
 "Nahraj krátkou pohádku, ve které jste oba hlavní postavy.",
 "Popiš zvuk, který ti připomíná domov, a proč.",
 "Zazpívej nebo rytmicky přeříkej jednu větu, kterou si sami vymyslíte.",
 "Nahraj pozvánku na vaše vysněné dobrodružství.",
 "Řekni stejnou větu jako tajný agent, učitel a pohádkový vypravěč.",
 "Vyprávěj o malé radosti posledních dní, jako by šlo o velkou novinku.",
 "Nahraj hlasovou pohlednici z místa, kam bys chtěl/a společně jet.",
 "Vymysli znělku pro váš imaginární podcast.",
 "Popřej druhému hezký den co nejkreativnějším způsobem.",
 "Popiš svůj oblíbený okamžik tak, aby si ho druhý dokázal představit.",
 "Přečti vlastní krátkou básničku o obyčejné maličkosti.",
 "Nahraj falešnou reklamu na váš nejlepší společný zvyk.",
 "Vysvětli složitou věc, kterou máš rád/a, jako malému dítěti.",
 "Zahraj zvukovou hádanku a nech druhého uhodnout, co předvádíš.",
 "Nahraj vzkaz svému budoucímu já, který si pustíš za rok.",
 "Vymysli dramatický trailer pro váš příští společný večer.",
 "Řekni, za co jsi dnes vděčný/á, jednou větou a vlastním stylem."
];
const wheelActions = [
 "Vytáhněte otázku, na kterou jste se ještě nikdy nezeptali.",
 "Každý vymyslete jeden laskavý úkol pro druhého; druhý si může vybrat.",
 "Vyberte společné téma a střídejte se ve větách po pěti slovech.",
 "Zahrajte si rychlé „co bys radši“ a oba zdůvodněte volbu.",
 "Pojmenujte jednu společnou vzpomínku a doplňte detail, který si pamatujete jinak.",
 "Vymyslete malý plán, který zvládnete uskutečnit během příštího týdne.",
 "Zkuste minutovou kreativní výzvu s věcmi, které máte po ruce.",
 "Každý řekněte jednu věc, kterou byste chtěli druhému lépe porozumět.",
 "Vymyslete nový společný rituál pro obyčejný den.",
 "Zahrajte si slovní příběh, kdy každý přidá jednu větu.",
 "Každý popište druhého třemi pozitivními slovy.",
 "Vymyslete překvapení, které nestojí žádné peníze.",
 "Vyberte písničku, která vystihuje dnešní náladu, a vysvětlete proč.",
 "Položte si otázku o snu, který jste ještě neprobrali.",
 "Vymyslete společný název pro tým a jeho speciální schopnost.",
 "Řekněte si navzájem jednu věc, kterou jste se od sebe naučili.",
 "Naplánujte ideální volnou hodinu bez povinností.",
 "Vymyslete tři možné konce pro krátký příběh.",
 "Zahrajte si hádání myšlenek: jeden vybere předmět, druhý se ptá.",
 "Každý navrhněte jednu drobnou věc, která vám zlepší společný týden."
];
const customIdeas = [
 "Jaká otázka by vám pomohla poznat se v něčem novém?",
 "Vymyslete pravidlo, které by vaši vlastní hru odlišilo od ostatních.",
 "Napište otázku, na kterou lze odpovědět příběhem místo jedním slovem.",
 "Vytvořte úkol, který podporuje spolupráci a netlačí nikoho přes hranice.",
 "Vymyslete kvízovou otázku o společné vzpomínce.",
 "Napište začátek příběhu, který musí druhý dokončit.",
 "Vymyslete legrační kategorii pro vlastní balíček otázek.",
 "Položte otázku o snu, který si chcete jednou splnit.",
 "Vymyslete laskavou výzvu, kterou lze splnit i na dálku.",
 "Napište otázku, na kterou oba odpovíte a pak porovnáte podobnosti.",
 "Vymyslete úkol, který se dá zvládnout za méně než minutu.",
 "Položte otázku o malé věci, která vám zlepšuje obyčejný den.",
 "Vytvořte otázku, u které neexistuje správná ani špatná odpověď.",
 "Vymyslete týmovou výzvu, ve které potřebujete nápady obou hráčů.",
 "Napište otázku o tom, co byste se chtěli společně naučit.",
 "Vymyslete kreativní úkol s papírem, tužkou nebo emoji.",
 "Položte otázku o tom, jak každý z vás nejraději odpočívá.",
 "Vytvořte úkol, který končí společným vtipem nebo názvem.",
 "Napište otázku, která pomůže vyřešit drobnou neshodu s respektem.",
 "Vymyslete překvapivou, ale bezpečnou mini hru pro dva."
];
const categoriesFor = (game: GameId, i: number) => categories[(i * 7 + game.length) % categories.length];
function uniquePrompts(game: GameId, items: string[], kind: "question"|"task" = "question"): BankPrompt[] {
 const seen = new Set<string>(); const out: BankPrompt[] = [];
 for (const text of items) { const clean=text.trim(); if (!clean || seen.has(clean)) continue; seen.add(clean); out.push({id:game+"-"+out.length,game,category:categoriesFor(game,out.length),text:clean,kind}); if(out.length===500) break; }
 return out;
}
function combine(game: GameId, frames: string[], list: string[], kind: "question"|"task" = "question") {
 const out:string[]=[];
 for(let a=0;a<list.length && out.length<500;a++) for(let b=0;b<frames.length && out.length<500;b++) out.push(frames[b].replaceAll("{t}",list[a]));
 return uniquePrompts(game,out,kind);
}
const ratherItems:string[]=[];
for(let a=0;a<ratherOptions.length;a++) for(let b=a+1;b<ratherOptions.length;b++) ratherItems.push("Co bys radši: "+ratherOptions[a]+", nebo "+ratherOptions[b]+"?");
const quickFrames = [
 "Zvládni tuto výzvu do 30 sekund: {t}",
 "Udělej z toho krátkou scénku: {t}",
 "Přidej k tomu nečekaný vtip a předveď: {t}",
 "Vysvětli svůj nápad druhému jednou větou a splň: {t}",
 "Proměň to v týmovou výzvu a proveď: {t}",
 "Předveď to beze slov a nech druhého hádat: {t}",
 "Vytvoř nejprve plán ve třech krocích a pak zkus: {t}",
 "Zkus nejvtipnější bezpečnou verzi této výzvy: {t}",
 "Proveď tuto kreativní výzvu s věcmi, které máš poblíž: {t}",
 "Udělej to jako moderátor soutěže: {t}",
 "Zkus tuto výzvu bez použití slova „já“: {t}",
 "Vymysli k tomu vlastní pravidlo a proveď: {t}",
 "Splň to společně s druhým hráčem, každý přidejte část: {t}",
 "Předveď to třemi různými emocemi: {t}",
 "Udělej z toho reklamu na vaše duo: {t}",
 "Přeměň to v desetivteřinový příběh: {t}",
 "Splň výzvu a pak řekni, co bylo nejtěžší: {t}",
 "Zkus to s nedominantní rukou, pokud je to pohodlné: {t}",
 "Přidej k tomu vlastní zvukový efekt: {t}",
 "Vymysli název pro svůj pokus a proveď: {t}"
];
const storyFrames = [
 "{t} Co uděláte jako první a proč?",
 "{t} Kdo se objeví jako nečekaný spojenec?",
 "{t} Jaká drobná stopa vám pomůže pokračovat?",
 "{t} Jaké pravidlo tohoto světa právě zjistíte?",
 "{t} Co se pokazí tím nejvtipnějším způsobem?",
 "{t} Jakou volbu musíte udělat společně?",
 "{t} Jaká tajná schopnost se jednomu z vás probudí?",
 "{t} Co vám záhadná postava nabídne výměnou za pomoc?",
 "{t} Jakou stopu objevíte na úplně obyčejném místě?",
 "{t} Co by mohlo celý plán změnit?",
 "{t} Jaký předmět se ukáže být mnohem důležitější, než vypadal?",
 "{t} Jak se do příběhu zaplete mluvící zvíře?",
 "{t} Co vás rozesměje, i když je situace vážná?",
 "{t} Jakou hádanku musíte vyřešit ve dvou?",
 "{t} Co se stane, když se rozhodnete jít opačným směrem?",
 "{t} Jakou laskavost vám někdo nečekaně oplatí?",
 "{t} Jaký je nejodvážnější, ale bezpečný další krok?",
 "{t} Co najdete za posledními dveřmi?",
 "{t} Jak příběh změní jedna zdánlivě bezvýznamná věta?",
 "{t} Jaké zakončení by vás oba překvapilo?"
];
const voiceFrames = [
 "Nahraj hlasovou zprávu k tématu {t} tak, aby druhému vykouzlila úsměv.",
 "Vysvětli {t} hlasem rozhlasového moderátora.",
 "Vytvoř krátkou zvukovou pohlednici o tématu {t}.",
 "Popiš {t} jako trailer k dobrodružnému filmu.",
 "Vymysli pro {t} krátkou znělku a nahraj ji.",
 "Vyprávěj o {t} jako pohádkový vypravěč.",
 "Nahraj vzkaz o {t}, jako bys volal/a z budoucnosti.",
 "Popiš {t} pomocí tří zvuků a jedné věty.",
 "Vymysli legrační reklamu na {t} a nahraj ji.",
 "Nahraj upřímnou zprávu o tom, co pro tebe {t} znamená.",
 "Řekni o {t} jednu pravdu, jeden vtip a jednu naději.",
 "Představ {t} jako nejnovější zprávu dne.",
 "Nahraj desetivteřinovou básničku na téma {t}.",
 "Popiš {t} tak, aby si to druhý dokázal živě představit.",
 "Nahraj hlasovou hádanku související s {t}.",
 "Zahraj tři různé postavy, které mluví o {t}.",
 "Pozvi druhého hlasovou zprávou k zážitku spojenému s {t}.",
 "Vysvětli {t} co nejjednodušeji a zakonči překvapením.",
 "Nahraj krátké poděkování za něco kolem tématu {t}.",
 "Vymysli úvod podcastu, jehož tématem je {t}."
];
const customFrames = [
 "Navrhněte vlastní otázku o tématu {t}, na kterou oba odpovíte po svém.",
 "Vytvořte pravidlo minihry o tématu {t}, které potřebuje spolupráci.",
 "Napište úkol inspirovaný tématem {t}, který lze dobrovolně přeskočit.",
 "Vymyslete k tématu {t} kvízovou otázku s odpovědí, kterou zná jen váš pár.",
 "Napište příběhovou kartu začínající tématem {t}.",
 "Vytvořte otázku o tématu {t}, která odhalí nečekaný názor.",
 "Vymyslete rychlou kreativní výzvu inspirovanou tématem {t}.",
 "Napište otázku o tématu {t}, která nemá jedinou správnou odpověď.",
 "Vytvořte týmový úkol o tématu {t}, kde každý přidá jeden nápad.",
 "Vymyslete tajnou kartu o tématu {t} pro váš vlastní balíček.",
 "Napište otázku o tématu {t}, která vyvolá příjemnou vzpomínku.",
 "Vytvořte z tématu {t} krátkou hádanku pro druhého hráče.",
 "Vymyslete legrační výzvu o tématu {t}, kterou lze splnit na dálku.",
 "Napište otázku o tématu {t}, která pomáhá lépe si porozumět.",
 "Vytvořte kartu, na které oba navrhnete rozdílné řešení tématu {t}.",
 "Vymyslete úkol o tématu {t}, který trvá méně než minutu.",
 "Napište otázku o tématu {t}, kterou jste si ještě nikdy nepoložili.",
 "Vytvořte společnou kreativní misi inspirovanou tématem {t}.",
 "Napište kartu o tématu {t}, která končí překvapivou volbou.",
 "Vymyslete vlastní způsob bodování pro výzvu na téma {t}."
];
export const PROMPT_BANKS: Record<GameId, BankPrompt[]> = {
 truth: combine("truth",truthFrames,topics),
 know: combine("know",knowFrames,topics),
 rather: uniquePrompts("rather",ratherItems),
 think: combine("think",thinkFrames,topics),
 match: combine("match",matchFrames,topics),
 quick: combine("quick",quickFrames,quickActions,"task"),
 story: combine("story",storyFrames,storyOpenings),
 wheel: uniquePrompts("wheel",Array.from({length:25},(_,i)=>wheelActions[i]).flatMap((base,i)=>topics.map(topic=>base.replace(/[.!?]$/,"")+" — "+topic+"."))),
 compat: combine("compat",compatFrames,topics),
 secret: combine("secret",truthFrames.map((f)=>"Tajně a jen podle sebe: "+f),topics),
 voice: combine("voice",voiceFrames,topics,"task"),
 custom: combine("custom",customFrames,topics)
};
export function getPromptBank(game: GameId): BankPrompt[] { return PROMPT_BANKS[game] || PROMPT_BANKS.truth; }
export function pickPrompt(game: GameId, usedIds: string[] = []): BankPrompt | null {
 const bank=getPromptBank(game); const used=new Set(usedIds); const available=bank.filter(p=>!used.has(p.id));
 return available.length ? available[Math.floor(Math.random()*available.length)] : null;
}
