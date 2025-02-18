export const randomHash = (len:number) => {
    const options = "ccbHnjkccnnksckskNJmkm5585299mscNhNJNJABXB";
    const length  = options.length;
    let ans = "";
    for(let i=0; i<len; i++){
        ans += options[Math.floor((Math.random() * length))]
    }
    return ans;
}