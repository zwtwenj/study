/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const arr = []
    arr[0] = nums[0]
    let len = nums.length
    if (len === 1) {
        return arr[0]
    }
    arr[1] = nums[1]
    if (len === 2) {
        return Math.max(arr[0], arr[1])
    }
    arr[2] = arr[0] + nums[2]
    if (len === 3) {
        return Math.max(arr[2], arr[1])
    }
    for (let i = 3; i < len; i++) {
        arr[i] = Math.max(arr[i - 3], arr[i - 2]) + nums[i]
    }
    return Math.max(arr[len - 1], arr[len - 2])
};

const nums = [0, 0, 0]
console.log(rob(nums))