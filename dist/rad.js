export function rxsort(arr) {
    if (arr.length == 0) {
        return [];
    }
    let result = arr;
    let output = [];
    let maxNumArr = Math.max(...arr);
    let exp = 1;
    let prefixSum = Array(10).fill(0);
    let freqArr = Array(10).fill(0);
    while (maxNumArr > 0) {
        freqArr = countFreq(result, exp);
        prefixSum = calPrefixSum(freqArr);
        result = finalArr(result, prefixSum, exp);
        exp *= 10;
        maxNumArr = Math.floor(maxNumArr / 10);
    }
    output = result;
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
function calPrefixSum(freqArr) {
    if (freqArr.length == 0) {
        return [];
    }
    const n = freqArr.length;
    let prefixSum = Array(n).fill(0);
    prefixSum[0] = freqArr[0];
    for (let j = 1; j < n; j++) {
        prefixSum[j] = prefixSum[j - 1] + freqArr[j];
    }
    return prefixSum;
}
function finalArr(arr, prefixSum, exp) {
    if (arr.length == 0) {
        return [];
    }
    let outputArr = Array(arr.length).fill(0);
    let finalArr = calculateArr(prefixSum, arr, exp);
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