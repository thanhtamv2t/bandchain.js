"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAndStringify = void 0;
function sortAndStringify(obj) {
    function sortObject(obj) {
        if (obj === null)
            return null;
        if (typeof obj !== 'object')
            return obj;
        if (Array.isArray(obj))
            return obj.map(sortObject);
        const sortedKeys = Object.keys(obj).sort();
        const result = {};
        sortedKeys.forEach((key) => {
            result[key] = sortObject(obj[key]);
        });
        return result;
    }
    return JSON.stringify(sortObject(obj));
}
exports.sortAndStringify = sortAndStringify;
