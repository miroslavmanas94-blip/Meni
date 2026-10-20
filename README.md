# LovyGo — v repozitáři Meni

Soukromě působící prototyp aplikace pro páry na dálku. Výchozí jazyk je čeština, vizuál používá jemnou fialovou a růžovou, světlý vzhled a responzivní rozvržení.

## Co je v prototypu

- Přehled vztahu a počet dní od zadaného data.
- Lokální chatový náhled, nálada dne, seznam společných plánů a vzpomínky.
- Nastavení data vztahu, oslovení a tmavého režimu.
- Ukládání v `localStorage` konkrétního prohlížeče.
- Rozhraní přizpůsobené telefonu i desktopu.

## Důležité limity

Toto je front-endový prototyp, nikoli hotová zabezpečená služba pro skutečné páry. Bez backendu se data nesynchronizují mezi zařízeními a druhý partner je neuvidí. Chat obsahuje demonstrační zprávu. Nejsou implementované skutečné účty, párování, videohovory, push notifikace ani synchronizace playlistu. Nepoužívej ho k ukládání citlivých informací.

## Spuštění lokálně

```bash
npm install
npm run dev
``

Otevři http://localhost:3000.

## Cloudflare Workers

Projekt obsahuje základní konfiguraci OpenNext pro Cloudflare Workers. Před nasazením ověř kompatibilitu aktuálních verzí Next.js a OpenNext, spusť `npm run cf:build` a `npm run cf:preview`. Zatím se nic nenasazuje a existující Worker `meni` není přepisován. Produkční deploy proveď až po ověření buildu a potvrzení cílového názvu/domény.
