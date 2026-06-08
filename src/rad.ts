

export function rxsort(arr:number[]) : number[]{
    if(arr.length==0)
    {
        return [];
    }
    let expPrefix: Map<number,number[]>=new Map();
    let queue: number[]=[];
    let output:number[]=[];
    let maxNumArr:number=Math.max(...arr);
    let exp: number=1;
    let prefixSum:number[]=Array(10).fill(0);
    let freqArr:number[]=Array(10).fill(0);
    let finalOutput:number[]=[];
    while(maxNumArr>0)
    {
        queue.push(exp);
        freqArr=countFreq(arr,exp);
        prefixSum=calPrefixSum(freqArr,exp,expPrefix);
        exp*=10;
        maxNumArr=Math.floor(maxNumArr / 10);
    }
    finalOutput=finalArr(arr,queue,expPrefix);
    output=finalOutput;
    return output;
}

function countFreq(arr:number[],exp:number): number[] {
if(arr.length==0)
{
    return [];
}
let n:number=arr.length;
let arrFreq:number[]=Array(10).fill(0);
let idx:number=n-1;
let digit:number=0;
while(idx>=0)
{
    digit=(Math.floor(arr[idx]!/exp))%10;
    arrFreq[digit] = (arrFreq[digit] ?? 0) + 1;
    idx-=1;

}
return arrFreq;

}

function calPrefixSum(freqArr:number[],exp:number,expPrefix:Map<number,number[]>): number[]{

if (freqArr.length==0)
{
    return [];
}

const n:number=freqArr.length;
let prefixSum:number[]=Array(n).fill(0);
prefixSum[0]=freqArr[0]!;
for(let j=1;j<n;j++)
{
    prefixSum[j]=prefixSum[j-1]!+ freqArr[j]!;
    
}

expPrefix.set(exp,prefixSum);
return prefixSum;
}

function finalArr(arr:number[],queue:number[],expPrefix:Map<number,number[]>):number[]{
        
        if(arr.length==0)
{
    return [];
}
        if(queue.length==0)
{
    return [];
}
        let outputArr:number[]=Array(arr.length).fill(0);  
        let exp:number=queue.shift()!;
        let prefSum:number[]=expPrefix.get(exp)!;
        let finalArr:number[]=calculateArr(prefSum,arr,exp); 
    while(queue.length!=0)
    {
        exp=queue.shift()!;
        prefSum=expPrefix.get(exp)!;
        finalArr=calculateArr(prefSum,finalArr,exp);        
    }
    outputArr=finalArr;
    return outputArr;
}
function calculateArr(prefixSum:number[],arr:number[],exp:number){
    if(arr.length==0)
{
    return [];
}
if(prefixSum.length==0)
{
    return [];
}
    let i=arr.length-1;
    let output:number[]=Array(arr.length).fill(0); 
    while(i>=0)
    {
        let digit=(Math.floor(arr[i]!/exp))%10;
        output[prefixSum[digit]!-1]=arr[i]!;
        prefixSum[digit]=prefixSum[digit]!-1;
        i-=1;

    }
    return output;

}
