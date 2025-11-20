# Factory Flow – Dev Roadmap

> ADHD-friendly rule: **only do one section per session**.  
> Stop when a section is done. That’s a win.

---

## 0. Project Setup

- [x] Create a new Vite project (`npm create vite@latest factory-flow -- --template react-ts`)
- [x] Install deps (`npm install`)
- [x] Run dev server once to confirm it works (`npm run dev`)
- [x] Delete boilerplate UI and leave a clean `<App />` with “Factory Flow” text

---

## 1. Basic Layout (No Game Logic Yet)

- [ ] In `App.tsx`, create a simple 2-column layout:
  - [ ] Left: “Production” panel
  - [ ] Right: “Market & Inventory” panel
- [ ] Add a top bar showing:
  - [ ] Cash (hardcode a number for now)
  - [ ] Tool price (just a number, not interactive yet)
- [ ] Add placeholders:
  - [ ] A list for buildings on the left
  - [ ] A list for resources/inventory on the right

Stop here if this is your first session.

---

## 2. Game State (Types + Initial Data)

- [ ] Create a `types.ts` (or similar) file with:
  - [ ] `ResourceId = "iron_ore" | "coal" | "steel" | "tools"`
  - [ ] `Recipe` type with `inputs` and `outputs`
  - [ ] `BuildingType` type
- [ ] Create a `buildings.ts` file with the 4 building definitions:
  - [ ] Mine (produces Iron Ore)
  - [ ] Quarry (produces Coal)
  - [ ] Smelter (Iron Ore + Coal → Steel)
  - [ ] Factory (Steel → Tools)
- [ ] In `App.tsx`, create a `GameState` object in React state:
  - [ ] `cash`
  - [ ] `resources` (record of each resource)
  - [ ] `buildingsOwned` (record of how many of each building)
- [ ] Render `GameState` values in the UI (still static, no ticking)

Stop here if this feels like enough.

---

## 3. Game Loop (Tick System)

- [ ] Create a pure function `stepGameState(state): GameState`
  - [ ] For now, only handle raw production:
    - [ ] Mines add Iron Ore
    - [ ] Quarries add Coal
- [ ] In a `useEffect`, set up an interval (e.g. every 1000ms):
  - [ ] Call `setGameState(prev => stepGameState(prev))`
  - [ ] Clean up interval on unmount
- [ ] Confirm: Iron Ore and Coal numbers increase over time on screen

If this works, call it a win for the day.

---

## 4. Full Production Chain

- [ ] Update `stepGameState` to:
  - [ ] Use Smelters to convert Iron Ore + Coal → Steel (respect recipe ratios)
  - [ ] Use Factories to convert Steel → Tools
- [ ] Make sure resources never go negative
- [ ] Display per-tick changes somewhere (even simple text is fine)

---

## 5. Buying Buildings

- [ ] Add a `buyBuilding(id: string)` function
  - [ ] Calculate cost using baseCost + multiplier
  - [ ] If `cash` is enough, subtract cost and increment `buildingsOwned[id]`
- [ ] Add “Buy” buttons next to each building in the UI
- [ ] Confirm:
  - [ ] Clicking “Buy” spends cash
  - [ ] New buildings increase production in the next ticks

Stop after this; you now have a real idle core.

---

## 6. Market & Demand (Simple)

- [ ] Add fields to `GameState`:
  - [ ] `toolPrice`
  - [ ] `marketMood` (start at 1.0)
- [ ] Add a basic slider or input to change `toolPrice`
- [ ] Implement a `computeDemand(price, marketMood)` function
- [ ] In `stepGameState`:
  - [ ] Calculate demand
  - [ ] Sell `min(demand, tools)` each tick
  - [ ] Add revenue to `cash` and subtract sold Tools from inventory
- [ ] Display:
  - [ ] Tools in warehouse
  - [ ] Last tick’s revenue

---

## 7. Save / Load (Local Storage)

- [ ] Create a `serializeGameState` and `deserializeGameState`
- [ ] On every N seconds (e.g. 5s), save game state to `localStorage`
- [ ] On app start:
  - [ ] Try to load from `localStorage`
  - [ ] If nothing is there, use the default initial state

---

## 8. Nice-to-haves (Optional, Only If You Want)

Pick **one** of these at a time, only if you feel like it:

- [ ] Add 1–2 simple upgrades (e.g., +10% production for Mines)
- [ ] Add a basic CSS layout to make columns look clean
- [ ] Show small text like “Demand: XX tools/tick”
- [ ] Add a very simple offline progress:
  - [ ] Save a `lastUpdated` timestamp
  - [ ] On load, estimate a small amount of “while you were away” production

---

## 9. Done for MVP When…

You can check these off to call the MVP “done”:

- [ ] Game runs in the browser with a visible tick loop
- [ ] Resources flow Mine → Quarry → Smelter → Factory → Tools
- [ ] You can buy more buildings and see production increase
- [ ] You can change Tool price and see sales change
- [ ] Game state persists between refreshes

When these are checked, you officially have a working idle factory game MVP. 🎉

---

## Deployment

- `npm run build` – confirm the static bundle compiles locally.
- Push to `main` to trigger `.github/workflows/deploy.yml`, which publishes `dist` to GitHub Pages under `https://jordanschnur.com/factory-flow`.
- After the workflow succeeds, verify the live site loads assets with the `/factory-flow/` base and that the back button returns to `https://jordanschnur.com`.
Deploy