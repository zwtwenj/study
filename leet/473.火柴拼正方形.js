/**
 * @param {number[]} matchsticks
 * @return {boolean}
 */
// var makesquare = function(matchsticks) {
//     matchsticks.sort((a, b) => b - a)
//     let a = 0
//     matchsticks.forEach(i => {
//         a = a + i
//     })
//     // 正方形边长
//     let len = a / 4
//     let arr = [len, len, len, len]
//     let x = []
//     for (let i = 0; i < matchsticks.length; i++) {
//         let temp = matchsticks[i]
//         if (temp > len) {
//             i = matchsticks.length
//             return false
//         } else {
//             for (let j = 0; j < 4; j++) {
//                 if (arr[j] >= temp) {
//                     arr[j] = arr[j] - temp
//                     x.push(j)
//                     j = 4
//                 } else if ( j === 3) {
//                     // console.log(arr)
//                     // console.log(matchsticks[i - 1])
//                 }
//             }
//         }
//     }
//     let b = new Set(arr)
//     if (arr[0] === 0 && b.size === 1) {
//         return true
//     } else {
//         return false
//     }
// }
var makesquare = function(matchsticks) {
    let totalLen = 0
    matchsticks.forEach(i => {
        totalLen = totalLen + i
    })
    if (totalLen % 4 !== 0) {
        return false;
    }
    matchsticks.sort((a, b) => a - b);
    for (let i = 0, j = matchsticks.length - 1; i < j; i++, j--) {
        const temp = matchsticks[i];
        matchsticks[i] = matchsticks[j];
        matchsticks[j] = temp;
    }

    const edges = new Array(4).fill(0);
    return dfs(0, matchsticks, edges, Math.floor(totalLen / 4));
}

const dfs = (index, matchsticks, edges, len) => {
    if (index === matchsticks.length) {
        return true;
    }
    for (let i = 0; i < edges.length; i++) {
        edges[i] += matchsticks[index];
        if (edges[i] <= len && dfs(index + 1, matchsticks, edges, len)) {
            return true;
        }
        edges[i] -= matchsticks[index];
    }
    return false;
};

let matchsticks = [5,5,5,5,4,4,4,4,3,3,3,3]
console.log(makesquare(matchsticks))