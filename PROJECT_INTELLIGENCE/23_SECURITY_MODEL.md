# 23_SECURITY_MODEL

> เฉพาะสิ่งที่ code รองรับ. ห้ามเรียกว่าปลอดภัยถ้าไม่มี evidence.

## AUTHENTICATION

- **VERIFIED — Mock authentication only.**
- Login form accepts any non-empty `operatorId` + `accessKey`
- No server validation, no hash, no OAuth, no JWT, no SSO
- `setTimeout(1500ms)` simulates "cryptohandshake" but performs no cryptographic operation
- **PATH:** `LoginModal.tsx:29-58`
- **CONFIDENCE:** VERIFIED

## AUTHORIZATION

- **VERIFIED — None.**
- Single user role, no permission system
- Any authenticated user has access to all 8 windows + Kill Switch
- No feature flags
- No role/permission enforcement in code

## SECRETS

- **VERIFIED — No secrets stored in code.**
- No API keys (no external APIs)
- No `.env` file, no `import.meta.env` references
- Default Login credentials `ARTY-FDC-401` / `GRID-6400` are hardcoded **placeholders** displayed as initial input values — not authentication tokens (any input works)

## CLIENT-SIDE TRUST

- **VERIFIED — 100% client-side trust.**
- All logic runs in the browser
- No server-side validation of any data
- Users can modify LocalStorage directly via DevTools

## BROWSER STORAGE SECURITY

| Storage | Data | Sensitivity | Encrypted? |
|---|---|---|---|
| LocalStorage `artyc2_battery_coords` | UTM coordinates of firing position | Potentially sensitive (military position) | ❌ No |
| IndexedDB `fdc_offline_queue` | (never created, only deleted) | N/A | N/A |
| In-memory React state | Everything else | Session-only | N/A |

## EXTERNAL APIs

- **VERIFIED — 1 external URL:** Google Fonts CSS (`fonts.googleapis.com`)
- **RISK:** third-party font provider can log user visits (User-Agent, IP, Referer)
- **MITIGATION:** none in current code (could self-host fonts)
- **NO** API keys transmitted (fonts CSS is public)

## SENSITIVE DATA HANDLING

- **VERIFIED:** No PII, credit cards, passwords, health data
- **INFERRED SENSITIVE:** military firing coordinates, target coordinates
- **HANDLING:** stored plaintext in LocalStorage; visible in DevTools; visible in "Simulate Call" logs (Console feed)

## ATTACK SURFACE (Browser-side)

### XSS (Cross-Site Scripting)
- **RISK MEDIUM:** No `dangerouslySetInnerHTML` observed → XSS via injected HTML not possible from user input
- **BUT:** Any XSS from a compromised dependency could:
  - Read all LocalStorage → exfiltrate battery coords
  - Read in-memory state → exfiltrate target list
  - Trigger `handleKillSwitch` → destructive
- **MITIGATION:** none (no CSP header set; app builds as single HTML file)
- **CONFIDENCE:** INFERRED

### CSRF
- **RISK: N/A** — no server, no state-changing HTTP endpoints

### Supply Chain
- **RISK MEDIUM:** 6 runtime deps + 9 dev deps → typical npm supply chain risk
- **UNUSED DEPS:** framer-motion, clsx, tailwind-merge still on disk → still shipped in bundle? — depends on `viteSingleFile` tree-shaking; likely tree-shaken since not imported
- **VERIFIED:** No lockfile observed in `list_files` output — dependency versions may vary across installs

### Session Hijacking
- **RISK: N/A** — no cookies, no session tokens

### Man-in-the-Middle
- **RISK LOW:** if served over HTTPS, only Google Fonts CSS is at risk (public content)

### Local Machine Threats
- **RISK MEDIUM:** anyone with DevTools access sees all state and can trigger any action
- **KEY EXAMPLE:** `handleKillSwitch` accessible via any means

### Kill Switch Abuse
- **RISK:** any user (post-login) can wipe all data via console button OR start menu → single-click destruction
- **MITIGATION:** `window.confirm()` (native, easily dismissed accidentally)

## AUDIT TRAIL

- **VERIFIED:** In-memory `logs` array captures events (max 50 entries)
- **NOT PERSISTED:** logs lost on refresh or Kill Switch
- **NOT SENT ANYWHERE:** no server log endpoint
- **NOT TAMPER-EVIDENT:** simple string array; can be modified via React DevTools

## OPSEC MODE

- **PARTIAL PROTECTION:** header toggle `hideBatteryCoords`
- **HIDES:** battery + guns on map
- **DOES NOT HIDE:** battery coords in header text (`E:X N:Y`), FDC ballistics calculations, or target coordinates
- **EVIDENCE:** F030 in Feature Inventory

## CRYPTOGRAPHIC OPERATIONS

- **VERIFIED — NONE.**
- No `crypto.subtle` calls
- No hashing, no signing, no encryption
- "Cryptohandshake" is text label + delay, not actual cryptography

## COMPLIANCE

- **UNKNOWN** — no evidence of compliance targeting:
  - FIPS
  - Common Criteria
  - Military security standard (STANAG etc.)
  - GDPR / HIPAA / PCI

## SUMMARY SECURITY POSTURE

| Aspect | Status |
|---|---|
| Auth | **VERIFIED MOCK** — no real check |
| Authz | **VERIFIED NONE** |
| Secrets | **VERIFIED NONE STORED** |
| Encryption at rest | **VERIFIED NONE** |
| Encryption in transit | **INFERRED** (depends on hosting) |
| XSS | **VERIFIED NO dangerouslySetInnerHTML** |
| CSRF | **N/A** |
| Audit log | **PARTIAL** (in-memory only) |
| Data classification | **UNKNOWN** |
| Threat model | **UNKNOWN** (no document) |

**DO NOT DEPLOY AS-IS to a production environment handling real operational data.**
