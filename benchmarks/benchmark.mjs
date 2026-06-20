import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import process from "node:process";

import { rxsort } from "../dist/rad.js";

const args = new Set(process.argv.slice(2));
const quick = args.has("--quick");
const outputArg = process.argv.indexOf("--output");
const outputPath = outputArg >= 0 ? process.argv[outputArg + 1] : undefined;

const sizes = quick ? [1_000, 10_000, 50_000] : [100, 1_000, 10_000, 50_000, 100_000, 200_000];
const rangeValues = quick ? [10, 1_000, 1_000_000] : [10, 100, 1_000, 10_000, 1_000_000, 1_000_000_000];
const rangeSize = quick ? 10_000 : 50_000;
const sampleCount = quick ? 5 : 7;

function makeRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };
}

function randomArray(size, range, seed) {
  const random = makeRandom(seed);
  return Array.from({ length: size }, () => random() % range);
}

const dataPatterns = [
  {
    name: "random",
    range: 1_000_000,
    generate: (size, seed) => randomArray(size, 1_000_000, seed),
  },
  {
    name: "sorted",
    range: 1_000_000,
    generate: (size, seed) => randomArray(size, 1_000_000, seed).sort((a, b) => a - b),
  },
  {
    name: "reverse",
    range: 1_000_000,
    generate: (size, seed) => randomArray(size, 1_000_000, seed).sort((a, b) => b - a),
  },
  {
    name: "duplicates",
    range: 8,
    generate: (size, seed) => randomArray(size, 8, seed),
  },
  {
    name: "small-range",
    range: 100,
    generate: (size, seed) => randomArray(size, 100, seed),
  },
];

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return false;
  }
  return true;
}

function iterationsFor(size) {
  if (size <= 100) return 500;
  if (size <= 1_000) return 100;
  if (size <= 10_000) return 20;
  if (size <= 50_000) return 5;
  if (size <= 100_000) return 3;
  return 1;
}

function median(values) {
  const ordered = [...values].sort((a, b) => a - b);
  return ordered[Math.floor(ordered.length / 2)];
}

function verify(name, sort, source, expected) {
  const input = source.slice();
  const actual = sort(input);
  if (!arraysEqual(actual, expected)) {
    throw new Error(`${name} returned an incorrect result`);
  }
}

function measure(sort, source) {
  const iterations = iterationsFor(source.length);
  const samples = [];

  for (let warmup = 0; warmup < 2; warmup++) {
    sort(source.slice());
  }

  for (let sample = 0; sample < sampleCount; sample++) {
    const inputs = Array.from({ length: iterations }, () => source.slice());
    const start = performance.now();
    for (const input of inputs) sort(input);
    samples.push((performance.now() - start) / iterations);
  }

  return {
    medianMs: median(samples),
    minMs: Math.min(...samples),
    maxMs: Math.max(...samples),
    samples,
    iterationsPerSample: iterations,
  };
}

const algorithms = {
  radsort: (input) => rxsort(input),
  native: (input) => input.sort((a, b) => a - b),
};

function runAlgorithm(name, source, expected) {
  try {
    verify(name, algorithms[name], source, expected);
    return { status: "ok", ...measure(algorithms[name], source) };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    };
  }
}

function createSource(benchmark) {
  if (benchmark.suite === "value-range") {
    return randomArray(benchmark.size, benchmark.range, benchmark.seed);
  }

  return benchmark.generate(benchmark.size, benchmark.seed);
}

function benchmarkCase(benchmark) {
  const source = createSource(benchmark);
  const expected = source.slice().sort((a, b) => a - b);

  return {
    suite: benchmark.suite,
    pattern: benchmark.pattern,
    size: benchmark.size,
    range: benchmark.range,
    radsort: runAlgorithm("radsort", source, expected),
    native: runAlgorithm("native", source, expected),
  };
}

const cases = [];

for (let patternIndex = 0; patternIndex < dataPatterns.length; patternIndex++) {
  const dataPattern = dataPatterns[patternIndex];

  for (const size of sizes) {
    cases.push({
      suite: "size-pattern",
      pattern: dataPattern.name,
      size,
      range: dataPattern.range,
      seed: 0x9e3779b9 ^ size ^ patternIndex,
      generate: dataPattern.generate,
    });
  }
}

for (const range of rangeValues) {
  cases.push({
    suite: "value-range",
    pattern: "random",
    size: rangeSize,
    range,
    seed: 0x85ebca6b ^ range,
  });
}

const system = {
  timestamp: new Date().toISOString(),
  platform: process.platform,
  release: os.release(),
  architecture: process.arch,
  cpu: os.cpus()[0]?.model ?? "unknown",
  logicalCpus: os.cpus().length,
  memoryGiB: Number((os.totalmem() / 2 ** 30).toFixed(2)),
  node: process.version,
  v8: process.versions.v8,
};

console.log(`Radsort benchmark: ${system.platform} ${system.release}, ${system.node}, ${system.cpu}`);
console.log(`Profile: ${quick ? "quick" : "full"}; values are median milliseconds`);

const results = [];
for (const [index, benchmark] of cases.entries()) {
  const result = benchmarkCase(benchmark);
  results.push(result);
  const rad = result.radsort.status === "ok" ? result.radsort.medianMs.toFixed(3) : "ERROR";
  const native = result.native.status === "ok" ? result.native.medianMs.toFixed(3) : "ERROR";
  const detail = result.suite === "value-range" ? `range=${result.range}` : result.pattern;
  console.log(`${String(index + 1).padStart(2)}/${cases.length} ${detail.padEnd(12)} n=${String(result.size).padStart(6)} radsort=${rad.padStart(9)} native=${native.padStart(9)}`);
}

const report = {
  system,
  methodology: {
    profile: quick ? "quick" : "full",
    deterministicSeed: true,
    sampleCount,
    statistic: "median",
    datasetGenerationTimed: false,
    inputCopyTimed: false,
    correctnessChecked: true,
  },
  results,
};

if (outputPath) {
  const absoluteOutput = path.resolve(outputPath);
  await mkdir(path.dirname(absoluteOutput), { recursive: true });
  await writeFile(absoluteOutput, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${absoluteOutput}`);
}
