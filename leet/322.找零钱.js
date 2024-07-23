/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const m = coins.length;
    const n = amount;
    const f = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(1 << 30));
    f[0][0] = 0;
    for (let i = 1; i <= m; ++i) {
        for (let j = 0; j <= n; ++j) {
            f[i][j] = f[i - 1][j];
            if (j >= coins[i - 1]) {
                f[i][j] = Math.min(f[i][j], f[i][j - coins[i - 1]] + 1);
            }
        }
    }
    return f[m][n] > n ? -1 : f[m][n];
    // arr[1] = 1
    // arr[2] = 2
    // arr[3] = arr[1] + 2元 = arr[2] + 1元 = 2
    // arr[4] = arr[1] + 3元（arr[3]）= arr[2] + 2元
};

const coins = [1, 2, 5]
const amount = 11
console.log(coinChange(coins, amount))