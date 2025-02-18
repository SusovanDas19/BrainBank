"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomHash = void 0;
const randomHash = (len) => {
    const options = "ccbHnjkccnnksckskNJmkm5585299mscNhNJNJABXB";
    const length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor((Math.random() * length))];
    }
    return ans;
};
exports.randomHash = randomHash;
