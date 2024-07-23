/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var isPossibleDivide = function(nums, k) {
    let obj = {}
    nums.forEach(item => {
        obj[item] = obj[item] + 1 || 1
    })
    console.log(obj)
    let min = Math.min(...nums)
    let count = 0
    let res = false
    function fn () {
        for (let i = 0; i < k; i++) {
            if (obj[min + i]) {
                obj[min + i]--
                if (obj[min + i] === 0) {
                    delete obj[min + i]
                }
                count++
                if (count < nums.length && (i === k - 1)) {
                    min = parseInt(Object.keys(obj)[0])
                    fn()
                } else if (count === nums.length && (i === k - 1)) {
                    res = true
                }
            } else {
                i = k
            }
        }
    }
    fn()
    console.log(res)
    return res
};

const nums = [1, 2, 3, 4]
const k = 3
isPossibleDivide(nums, k)