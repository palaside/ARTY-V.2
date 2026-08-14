# 24_TEST_VALIDATION_MAP

## TEST FRAMEWORK

- **VERIFIED — NONE.**
- No `vitest`, `jest`, `mocha`, `ava`, `playwright`, `cypress`, `testing-library` in `package.json`
- No `vitest.config.*`, `jest.config.*`, `playwright.config.*` files
- No test scripts in `package.json:scripts`

## TEST FILES

- **VERIFIED — NONE.**
- No `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`, `**/*.spec.tsx`
- No `tests/`, `__tests__/`, `e2e/` folders

## LINT

- **VERIFIED — NONE.**
- No `.eslintrc*`, no `eslint.config.*`, no `eslint` in deps
- Rely on TypeScript strict + `noUnusedLocals`/`noUnusedParameters` from `tsconfig.json`

## TYPECHECK

- **VERIFIED:** `tsconfig.json` has:
  ```json
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
  ```
- **BUT:** no `typecheck` npm script wrapping `tsc --noEmit`
- Typecheck runs as part of `vite build` (via `@vitejs/plugin-react`)

## FORMATTER

- **VERIFIED — NONE.**
- No `.prettierrc*`, no `prettier` in deps

## FEATURE TEST COVERAGE

| Feature | Test Status | Evidence |
|---|---|---|
| ALL 40 features | ❌ UNTESTED | No test files exist |

## MANUAL VALIDATION

- **INFERRED:** Development validated via `npm run build` succeeding + manual browser testing
- No test-driven development artifacts

## BUILD-TIME VALIDATION

- `npm run build` runs `vite build`
- Vite invokes TypeScript compiler (via plugin) → catches type errors
- **VERIFIED PASS:** last build in current session output "✓ built in 2.73s" (from earlier tool call `build_project`)

## E2E COVERAGE

- **VERIFIED — NONE.**

## VISUAL REGRESSION

- **VERIFIED — NONE.**
- No Storybook, no Chromatic, no Percy

## ACCESSIBILITY TESTING

- **VERIFIED — NONE.**
- No axe-core, no jest-axe

## PERFORMANCE TESTING

- **VERIFIED — NONE.**
- No Lighthouse CI, no Web Vitals instrumentation

## SECURITY TESTING

- **VERIFIED — NONE.**
- No `npm audit` script wired

## SUMMARY

| Category | Present? |
|---|---|
| Unit tests | ❌ |
| Integration tests | ❌ |
| E2E tests | ❌ |
| Visual regression | ❌ |
| Accessibility tests | ❌ |
| Performance tests | ❌ |
| Security tests | ❌ |
| Linting | ❌ (only tsc built-in unused vars) |
| Formatting | ❌ |
| Typecheck | ✅ (via build) |

**Test coverage of business logic (ballistics.ts, calculations): 0%**

## RISK

**HIGH:** Any refactor of `ballistics.ts` or `App.tsx` timers has no automated safety net. Manual regression testing is the only validation.

## PRE-EXISTING CI/CD

- **UNKNOWN:** No `.github/workflows/`, no `.gitlab-ci.yml`, no `Jenkinsfile` observed in `list_files`
- **INFERRED:** Deployment is manual (`npm run build` → copy `dist/index.html`)
