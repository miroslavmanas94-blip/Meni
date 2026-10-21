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

## Nasazení na Cloudflare Workers

V nastavení Cloudflare nastav:

- **Build command:** `npm run cf:build`
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/` (kořen repozitáře)

Nepoužívej `npx run build` — tento příkaz není platný a vede k chybě „could not determine executable to run“. `npm run cf:build` vytvoří OpenNext artefakty, které následně nasadí Wrangler. Build ani deploy zatím nejsou potvrzené jako úspěšné; po změně nastavení zkontroluj nový deployment log. Existující Cloudflare Worker `meni` nebyl tímto commitem přepsán.

Před nasazením spusť `npm run typecheck`, `npm run build`, následně `npm run cf:build` a `npm run cf:preview`. Pro skutečné online pokoje je třeba nasadit samostatné API s trvalým úložištěm / Durable Objects a připojit jej k frontendu.


## Skutečné online místnosti DUO

Online pokoj používá samostatný Cloudflare Worker s Durable Objects:

1. Z kořene repozitáře spusť `npm install`.
2. Přihlas Wrangler ke svému Cloudflare účtu a nasaď službu příkazem `npm run rooms:deploy`. Tím se vytvoří Worker `duo-room-service` a jeho SQLite Durable Object pro každou místnost.
3. V Cloudflare nastav u webové aplikace build-time proměnnou `NEXT_PUBLIC_DUO_ROOM_API` na adresu nasazeného Workeru, například `https://duo-room-service.<tvuj-workers-subdomain>.workers.dev`. Použij skutečnou adresu, kterou Cloudflare po deployi zobrazí, ne doslovný příklad.
4. Znovu sestav a nasaď webovou aplikaci, aby proměnná byla zahrnutá v klientském buildu.

Po připojení druhého hráče se výběr hry objeví až ve společné čekárně. Hra se spustí, až oba hráči zvolí hru a označí se jako připravení. Odpovědi se přes API neodhalí, dokud neodpoví oba. Bez nasazené služby a nastavené proměnné se online místnosti nespustí; samotný commit není důkazem nasazení ani úspěšného buildu.
