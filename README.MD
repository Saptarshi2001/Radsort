# Radsort

Small radix sort library built with TypeScript for arrays of non-negative
integers.

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

```bash
git clone https://github.com/Saptarshi2001/Radsort.git
npm run build
npm test
```

## Current Test Status

The test suite currently passes and covers empty inputs, sorted output,
duplicate preservation, and input immutability.

## Benchmarks

The repository includes a deterministic benchmark suite that compares `rxsort`
with JavaScript's numeric `Array.prototype.sort((a, b) => a - b)` across input
sizes, data patterns, and value ranges.

```bash
npm run benchmark
npm run benchmark:quick
```


### Methodology

- Every data set is generated from a deterministic seeded PRNG.
- Random, sorted, reverse-sorted, duplicate-heavy, and small-range inputs are
  tested at 100, 1,000, 10,000, 50,000, 100,000, and 200,000 elements.
- A separate test holds the array length at 50,000 and changes only the random
  value limit: 10, 100, 1,000, 10,000, 1 million, and 1 billion.
- Each result is the median of seven samples after two warm-up calls. Smaller
  inputs run multiple sorts per sample.
- Data generation and the fresh input copy are outside the timed section.


### Windows Results

Measured on 2026-06-20 with Node.js 22.17.1 (V8 12.4), Windows 11 x64, and an
Intel Core i7-13620H. Times are median milliseconds; lower is better.

| Pattern | Size | Radsort | Native sort | Faster choice |
| --- | ---: | ---: | ---: | --- |
| Random, values 0-999,999 | 1,000 | 0.088 | 0.134 | Radsort 1.52x |
| Random, values 0-999,999 | 10,000 | 0.772 | 1.741 | Radsort 2.26x |
| Random, values 0-999,999 | 100,000 | 9.961 | 22.401 | Radsort 2.25x |
| Random, values 0-999,999 | 200,000 | 21.992 | 50.984 | Radsort 2.32x |
| Already sorted, values 0-999,999 | 10,000 | 0.754 | 0.115 | Native 6.56x |
| Already sorted, values 0-999,999 | 100,000 | 9.828 | 1.190 | Native 8.26x |
| Reverse sorted, values 0-999,999 | 10,000 | 0.761 | 0.226 | Native 3.37x |
| Reverse sorted, values 0-999,999 | 100,000 | 9.726 | 7.965 | Native 1.22x |
| Random values 0-7 (many duplicates) | 10,000 | 0.215 | 1.135 | Radsort 5.28x |
| Random values 0-7 (many duplicates) | 100,000 | 2.242 | 11.513 | Radsort 5.14x |
| Random values 0-7 (many duplicates) | 200,000 | 3.979 | 24.602 | Radsort 6.18x |
| Small range (0-99) | 10,000 | 0.291 | 1.497 | Radsort 5.14x |
| Small range (0-99) | 100,000 | 3.675 | 16.966 | Radsort 4.62x |
| Small range (0-99) | 200,000 | 7.585 | 40.283 | Radsort 5.31x |

The 50,000-element value-range sweep shows the expected cost per additional
decimal digit:

| Exclusive upper bound | Radsort | Native sort |
| ---: | ---: | ---: |
| 100 | 2.125 ms | 8.446 ms |
| 1,000 | 2.882 ms | 9.258 ms |
| 10,000 | 3.261 ms | 10.288 ms |
| 1,000,000 | 5.087 ms | 9.935 ms |
| 1,000,000,000 | 7.347 ms | 11.877 ms |

### Docker Results

The quick profile was also run in the official Node 22 Debian Bookworm Slim and
Alpine images. Both containers used Docker Desktop's Linux VM and the same WSL2
6.6 kernel; this compares Linux userlands, not independent kernels or hardware.
Each result below names the faster algorithm and its speed advantage.

| Input | Debian result | Alpine result |
| --- | --- | --- |
| 1,000 random values from 0-999,999 | Radsort 1.35x faster | Radsort 1.02x faster |
| 10,000 random values from 0-999,999 | Radsort 2.13x faster | Radsort 2.03x faster |
| 50,000 random values from 0-999,999 | Radsort 1.62x faster | Radsort 1.62x faster |
| 50,000 already-sorted values from 0-999,999 | Native 9.09x faster | Native 7.69x faster |
| 50,000 reverse-sorted values from 0-999,999 | Native 2.44x faster | Native 2.38x faster |
| 50,000 random values from 0-7 | Radsort 3.62x faster | Radsort 4.47x faster |
| 50,000 random values from 0-99 | Radsort 3.13x faster | Radsort 3.19x faster |

Reproduce those runs from Windows PowerShell:

```powershell
docker run --rm -v "${PWD}:/app" -w /app node:22-bookworm-slim `
  node benchmarks/benchmark.mjs --quick `
  --output benchmarks/results/docker-debian-node22.json

docker run --rm -v "${PWD}:/app" -w /app node:22-alpine `
  node benchmarks/benchmark.mjs --quick `
  --output benchmarks/results/docker-alpine-node22.json
```

On Linux or macOS, run the equivalent commands from Bash, Zsh, or another
POSIX-compatible shell:

```bash
docker run --rm -v "$(pwd):/app" -w /app node:22-bookworm-slim \
  node benchmarks/benchmark.mjs --quick \
  --output benchmarks/results/docker-debian-node22.json

docker run --rm -v "$(pwd):/app" -w /app node:22-alpine \
  node benchmarks/benchmark.mjs --quick \
  --output benchmarks/results/docker-alpine-node22.json
```

Raw reports are stored in `benchmarks/results`.

### Recommended Workloads

Radsort has no runtime tuning parameters. For this implementation, its best
configuration is therefore a workload with non-negative integers, unsorted
input, relatively few decimal digits, and roughly 1,000 or more elements.
Duplicate-heavy and small-range inputs produced the largest gains. Native sort
is the better default for already sorted or reverse-sorted data and for tiny
random arrays around 100 elements.
