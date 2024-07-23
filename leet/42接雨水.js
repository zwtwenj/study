/**
 * @param {number[]} height
 * @return {number}
 */
// var trap = function(height) {
//     let max = Math.max(...height)
//     console.log(max)
//     let min = Math.min(...height)
//     let a = 0
//     let temp = 0
//     function fn (max) {
//         for (let i = min; i < max; i++) {
//             if (height.indexOf(i) === -1) {
//                 a = a + temp
//             } else {
//                 let arr = []
//                 height.forEach(item => {
//                     if (item > i) {
//                         arr.push(1)
//                     } else {
//                         arr.push(0)
//                     }
//                 })
//                 getStart(arr)
//                 getEnd(arr)
//                 temp = arr.filter(item => item === 0).length
//                 a = a + temp
//             }
//         }
//     }
//     function getStart (arr) {
//         if (arr[0] === 0) {
//             arr.shift()
//             getStart(arr)
//         } else {
//             return arr
//         }
//     }
//     function getEnd (arr) {
//         if (arr[arr.length - 1] === 0) {
//             arr.pop()
//             getEnd(arr)
//         } else {
//             return arr
//         }
//     }
//     fn(max)
//     console.log(a)
// };

var trap = function(height) {
    const n = height.length;
    if (n == 0) {
        return 0;
    }

    const leftMax = new Array(n).fill(0);
    leftMax[0] = height[0];
    for (let i = 1; i < n; ++i) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }

    const rightMax = new Array(n).fill(0);
    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; --i) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }

    let ans = 0;
    for (let i = 0; i < n; ++i) {
        ans += Math.min(leftMax[i], rightMax[i]) - height[i];
    }
    return ans;
};

let height = [4,2,3]
trap(height)