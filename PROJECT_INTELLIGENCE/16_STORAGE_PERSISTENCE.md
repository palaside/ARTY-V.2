# 16_STORAGE_PERSISTENCE

## STORAGE MECHANISMS SURVEYED

| Mechanism | Present in Code? | Actively Used? | Evidence |
|---|---|---|---|
| `localStorage` | YES | **YES** (1 key) | See ST-01 |
| `sessionStorage` | NO | — | grep = 0 results |
| `indexedDB` | YES (deletion only) | **PARTIAL** — `deleteDatabase` called but nothing writes | See ST-02 |
| `localforage` | NO (not in deps) | — | — |
| `dexie` / `pouchdb` | NO | — | — |
| SQLite / sql.js / wa-sqlite | NO | — | — |
| Browser Cache API | NO | — | — |
| Cookies | NO | — | — |
| In-memory only (React state) | YES | Extensively | Almost everything |
| File system | NO | — | — |

---

## ST-01: LocalStorage — `artyc2_battery_coords`

- **DATA:** Battery firing position (`easting`, `northing`, `altitude`, `simDir`)
- **LOCATION:** `window.localStorage`
- **KEY:** `artyc2_battery_coords`
- **WRITE:** `LoginModal.tsx` inside `handleSetupSubmit`:
  ```typescript
  localStorage.setItem('artyc2_battery_coords', JSON.stringify(coords))
  ```
- **READ:** `LoginModal.tsx` inside `handleLogin` (post-mock-auth):
  ```typescript
  const cachedCoords = localStorage.getItem('artyc2_battery_coords');
  if (cachedCoords) {
    try { parsed = JSON.parse(cachedCoords); onSuccess({..., restored:true}); }
    catch(e) { /* fallback to Setup */ }
  }
  ```
- **LIFETIME:** persists across browser sessions until (a) user clears browser storage, or (b) Kill Switch (`App.tsx:302` = `localStorage.clear()`)
- **KEYS_USED:** exactly 1 (`artyc2_battery_coords`)
- **SERIALIZATION:** JSON.stringify (plain), no encryption, no schema version
- **RISKS:**
  - No schema version → future refactor will break existing users
  - No integrity check → tampering not detected
  - Contains battery coordinates → if considered sensitive, this is a data-exposure risk (visible in DevTools → Application tab)
  - `Kill Switch` uses `localStorage.clear()` (nuclear) — will also wipe any future non-app keys
- **EVIDENCE:** `LoginModal.tsx:44,73`, `App.tsx:302`
- **CONFIDENCE:** VERIFIED

## ST-02: IndexedDB — `fdc_offline_queue`

- **DATA:** UNKNOWN — no code creates/opens this database
- **LOCATION:** `window.indexedDB`
- **DATABASE NAME:** `fdc_offline_queue`
- **WRITE:** ❌ **NONE** — no `indexedDB.open()` call in any source file
- **READ:** ❌ NONE
- **DELETE:** `App.tsx:306` inside `handleKillSwitch`:
  ```typescript
  try {
    indexedDB.deleteDatabase('fdc_offline_queue');
  } catch (e) { /* ignored */ }
  ```
- **LIFETIME:** N/A (never created)
- **⚠️ FINDING:** This is **DEAD_CLEANUP_CODE** — deleting a database that will never exist. Historical artifact suggesting an offline queue feature was **planned but not implemented**.
- **EVIDENCE:** grep `indexedDB` in `src/` returns exactly 1 line (App.tsx:306) — no other references
- **CONFIDENCE:** VERIFIED

## ST-03: In-Memory State (React)

- **DATA:** All other application state (targets, guns, calibration, munitions, fire mission, logs, window layout, session flags)
- **LIFETIME:** Session — lost on:
  - Browser refresh (F5)
  - Tab close
  - Kill Switch (partial — see BR-005)
- **RISKS:**
  - Refresh mid-fire-mission loses activeTarget + progress
  - Window layout not persisted → user must re-arrange every session
  - Logs lost on refresh
- **CONFIDENCE:** VERIFIED

---

## PERSISTED KEYS INVENTORY

| Key | Value Type | Set By | Read By | Cleared By |
|---|---|---|---|---|
| `artyc2_battery_coords` | JSON string | LoginModal Setup submit | LoginModal Login (post-auth) | Kill Switch (`localStorage.clear()`) |

**Grand total persisted keys:** 1

## SERIALIZATION SUMMARY

- **Only 1 serialize/deserialize point:** JSON.stringify / JSON.parse on battery coords
- No custom encoders/decoders
- No compression
- No encryption

## STORAGE OBSERVABILITY

- **In DevTools (Chrome/Firefox):**
  - Application → Storage → Local Storage → `<origin>` → key `artyc2_battery_coords`
  - Application → Storage → IndexedDB → (nothing — never created)

## MIGRATION / VERSIONING STRATEGY

- **NONE.** If code changes shape of `batteryCoords`, existing users with a saved key will either:
  - Get partial data (missing new fields → NaN in state)
  - Get parse error (fallback to Setup — data loss)

## OFFLINE / OFFLINE-FIRST STATUS

- **VERIFIED:** App works fully offline (no network dependencies at runtime)
- **HOWEVER:** naming `fdc_offline_queue` implies an original intent of an **offline-first queue-and-sync** pattern that was **not implemented**
- The `viteSingleFile` build makes the app a self-contained HTML file that can be run offline

## SECURITY CONSIDERATIONS

- LocalStorage is accessible to any JS on same origin → **XSS** would expose battery coords
- No PII/passwords stored
- `operatorId` and `accessKey` are entered fresh each login (not persisted)
- Kill Switch does not remove browser history, extension storage, or IndexedDB except the specifically-named DB

## FUTURE-PROOFING RECOMMENDATIONS (INFERRED, NOT IMPLEMENTED)

- Wrap persistence in a `useLocalStorage` hook with schema/version
- Consider `localforage` for future queue implementation
- Add checksum + version field to serialized JSON
- Convert `localStorage.clear()` in Kill Switch to targeted `removeItem` for specific keys to avoid nuking future features
