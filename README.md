# DUO ❤️ — hry pro dva odkudkoliv

DUO je mobilně orientovaná aplikace s romantickými, vtipnými a společnými hrami. Projekt je v GitHub repozitáři **Meni**.

## Co aktuálně obsahuje

- Výběr režimu „Jsme spolu osobně“ / „Jsme každý jinde“.
- 12 herních režimů: Pravda, nebo úkol; Kdo mě zná lépe?; Co bys radši?; Hádej, co si myslím; Jak moc se známe?; Rychlá výzva; Příběh na pokračování; Kolo překvapení; Kompatibilita odpovědí; Tajná otázka; Poznej můj hlas (návod na volitelné externí hlasovky); Vlastní hra.
- 250 generovaných variant otázek/úkolů pro každý z 10 herních typů včetně editoru soukromého obsahu.
- Nastavitelný počet kol, skóre, XP, výsledky a historie lokálně v prohlížeči.
- Volitelné potvrzení 18+; možnost přeskočit otázku bez penalizace.
- Responzivní design a základní PWA manifest/service worker.

## Důležité limity — čti před použitím

**Aktuální build ještě není ověřen a aplikace není potvrzeně nasazená.** Vytváření kódu a čekárna jsou zatím uživatelský průchod / lokální demo. Místnosti, hráči, odpovědi a skóre se mezi různými telefony zatím nesynchronizují; samotný kód DUO-XXXX není skutečný serverový pokoj. Lokální úložiště funguje jen v daném prohlížeči a zařízení. Odhalování odpovědí mezi dvěma lidmi tedy zatím nemůže být bezpečně synchronizováno. Není implementováno serverové ověřování, databáze, RLS, expirace online relací ani ochrana proti opakovanému bodování. Nezadávejte citlivé údaje.

Aplikace nevyžaduje kameru ani přístup k telefonním hovorům. Funkce „Poznej můj hlas“ nepřenáší hlas přímo v aplikaci; uživatelé mohou dobrovolně použít svou obvyklou aplikaci pro volání/zprávy.

## Lokální spuštění

```bash
npm install
npm run dev
```

Otevři http://localhost:3000.

## PWA

Manifest je na `/manifest.webmanifest`; základní service worker cachuje úvodní stránku pro omezený offline fallback. Pro plnou offline podporu je potřeba testovat produkční build.

## Nasazení

Základní OpenNext konfigurace pro Cloudflare je v repozitáři, ale build ani deploy nebyly ověřeny. Před nasazením spusť `npm run typecheck`, `npm run build`, následně `npm run cf:build` a `npm run cf:preview`. Nasazení zatím neproběhlo a existující Cloudflare Worker `meni` nebyl přepsán. Pro skutečné online pokoje je třeba nasadit samostatné API s trvalým úložištěm / Durable Objects a připojit jej k frontendu.
