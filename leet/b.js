const array1 = [1, 2, 3, 4, 5]
const array2 = [6, 7, 8, 9, 10]

function fn (arr1, arr2, k) {
    const pairsSum = []
    for (const value1 of arr1) {
        for (const value2 of arr2) {
            pairsSum.push(value1 + value2)
        }
    }
    pairsSum.sort((a, b) => a - b)
    console.log(pairsSum.slice(0, k))
    
}

fn(array1, array2, 2)