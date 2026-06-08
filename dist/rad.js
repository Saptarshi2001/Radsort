export function rxsort(arr) {
    if (arr.length == 0) {
        return [];
    }
    let expPrefix = new Map();
    let queue = [];
    let output = [];
    let maxNumArr = Math.max(...arr);
    let exp = 1;
    let prefixSum = Array(10).fill(0);
    let freqArr = Array(10).fill(0);
    let finalOutput = [];
    while (maxNumArr > 0) {
        queue.push(exp);
        freqArr = countFreq(arr, exp);
        prefixSum = calPrefixSum(freqArr, exp, expPrefix);
        exp *= 10;
        maxNumArr = Math.floor(maxNumArr / 10);
    }
    finalOutput = finalArr(arr, queue, expPrefix);
    output = finalOutput;
    return output;
}
function countFreq(arr, exp) {
    if (arr.length == 0) {
        return [];
    }
    let n = arr.length;
    let arrFreq = Array(10).fill(0);
    let idx = n - 1;
    let digit = 0;
    while (idx >= 0) {
        digit = (Math.floor(arr[idx] / exp)) % 10;
        arrFreq[digit] = (arrFreq[digit] ?? 0) + 1;
        idx -= 1;
    }
    return arrFreq;
}
function calPrefixSum(freqArr, exp, expPrefix) {
    if (freqArr.length == 0) {
        return [];
    }
    const n = freqArr.length;
    let prefixSum = Array(n).fill(0);
    prefixSum[0] = freqArr[0];
    for (let j = 1; j < n; j++) {
        prefixSum[j] = prefixSum[j - 1] + freqArr[j];
    }
    expPrefix.set(exp, prefixSum);
    return prefixSum;
}
function finalArr(arr, queue, expPrefix) {
    if (arr.length == 0) {
        return [];
    }
    if (queue.length == 0) {
        return [];
    }
    let outputArr = Array(arr.length).fill(0);
    let exp = queue.shift();
    let prefSum = expPrefix.get(exp);
    let finalArr = calculateArr(prefSum, arr, exp);
    while (queue.length != 0) {
        exp = queue.shift();
        prefSum = expPrefix.get(exp);
        finalArr = calculateArr(prefSum, finalArr, exp);
    }
    outputArr = finalArr;
    return outputArr;
}
function calculateArr(prefixSum, arr, exp) {
    if (arr.length == 0) {
        return [];
    }
    if (prefixSum.length == 0) {
        return [];
    }
    let i = arr.length - 1;
    let output = Array(arr.length).fill(0);
    while (i >= 0) {
        let digit = (Math.floor(arr[i] / exp)) % 10;
        output[prefixSum[digit] - 1] = arr[i];
        prefixSum[digit] = prefixSum[digit] - 1;
        i -= 1;
    }
    return output;
}
//# sourceMappingURL=rad.js.map