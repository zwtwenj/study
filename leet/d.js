 
function main(n,nums){
 
    let sum = 0;
    for(let i=0;i<nums.length;i++){
        sum+=nums[i]
    }
 
 
    // 分给两个人，不能评分直接返回
    if (sum % 2 != 0) {
        console.log(-1);
        return;
    }
 
    //二维DP转为1维DP
    let dp = new Array((sum / 2) + 1);
    dp[0] = 0;
    for (let i = 1; i <= (sum / 2); i++) {
        dp[i] = n;
        
    }
 
    for (let i = 1; i <= n; i++) {
        for (let j = (sum / 2); j >= nums[i - 1]; j--) {
            dp[j] = Math.min(dp[j], dp[j - nums[i - 1]] + 1);
        }
    }
 
    if (dp[sum / 2] == n) {
        console.log(-1);
    } else {
        console.log(dp[sum / 2]);
    }
}
 
main(10, [1, 1, 1 ,1 ,1, 9, 8, 3 ,7, 10])