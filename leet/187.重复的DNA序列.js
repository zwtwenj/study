/**
 * @param {string} s
 * @return {string[]}
 */
// 哈希表
// 如果字符在map中重复出现那么就增加一个hash记录
var findRepeatedDnaSequences = function(s) {
    let map = new Set()
    let hash = new Set()
    let L = s.length - 9
    for(let i = 0; i < L; i++){
        let temp = s.substring(i, i+10)
        if (map.has(temp)) {
            hash.add(temp)
        } else {
            map.add(temp)
        }
    }
    return Array.from(hash)
};

let s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
findRepeatedDnaSequences(s)