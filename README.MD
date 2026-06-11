# Radsort

Small radix sort library built with TypeScript. Ideal for sorting small arrays of
non-negative integers.

## Installation

Install dependencies:

```bash
npm install radsort
```

## Usage

Import `rxsort` from the package:

```js
import { rxsort } from "radsort";

const values = [170, 45, 75, 90, 802, 24, 2, 66];
const sorted = rxsort(values);

console.log(sorted);
// [2, 24, 45, 66, 75, 90, 170, 802]
```

## For building from source

```
git clone https://github.com/Saptarshi2001/Radsort.git
npm run build
npm test

```

## Current Test Status

The test suite currently passes and covers empty inputs, sorted output,
duplicate preservation, and input immutability.


