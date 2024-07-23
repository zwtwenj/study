/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    let a = 0
    for (let i = 0; i < nums.length; i++) {
        if (i > a) {
            return false
        }
        a = Math.max(a, i + nums[i])
    }
    console.log(a)
};

let nums = [2,3,1,1,4]
canJump(nums)