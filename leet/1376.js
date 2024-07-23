/**
 * @param {number} n
 * @param {number} headID
 * @param {number[]} manager
 * @param {number[]} informTime
 * @return {number}
 */
var numOfMinutes = function(n, headID, manager, informTime) {
    let res = 0
    let a = new Map()
    a.set(headID, [])
    for (let i = 0; i < n; i++) {
        let f = manager[i]
        if (f === -1) {

        } else {
            if (a.has(f)) {
                a.get(f).push(i)
            } else {
                a.set(f, [i])
            }
        }
    }
    console.log(a)
    for (let item of a) {
        console.log(item)
        let index = item[0]
        let arr = item[1]
        arr.forEach(p => {
            console.log(a.has(p))
        })
    }
};

numOfMinutes(7, 2, [2,2,-1,2,2,2,3], [0,0,1,1,0,0,0])