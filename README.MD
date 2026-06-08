# Radsort Unit Test Report

## Test setup

- Added unit tests for the exported `rxsort` function in `tests/rad.test.mjs`.
- Updated `package.json` so `npm test` builds the TypeScript output and runs Node's built-in test runner.
- `src/rad.ts` was not changed.

## Command run

```powershell
npm.cmd test
```

Note: `npm test` and `npx` are blocked in this PowerShell session by the local script execution policy, so `npm.cmd test` was used instead.

## Test results

- Total tests: 5
- Passing tests: 2
- Failing tests: 3

## Passing unit tests

- `rxsort` returns an empty array for an empty input.
- `rxsort` does not mutate the input array.

## Failing unit tests

### `rxsort` sorts single-digit positive numbers in ascending order

- Input: `[3, 1, 2]`
- Expected: `[1, 2, 3]`
- Actual: `[]`

### `rxsort` sorts multi-digit positive numbers in ascending order

- Input: `[170, 45, 75, 90, 802, 24, 2, 66]`
- Expected: `[2, 24, 45, 66, 75, 90, 170, 802]`
- Actual: `[]`

### `rxsort` preserves duplicate values while sorting

- Input: `[5, 3, 5, 1, 3]`
- Expected: `[1, 3, 3, 5, 5]`
- Actual: `[]`
