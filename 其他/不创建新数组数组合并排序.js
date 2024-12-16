const a = [1, 3, 5, 6, 7, 9]
const b = [0, 2, 4, 8, 10, 11]

function contant (a, b) {
    let L = 0
    let R = a.length - 1
    let index = 0
    b.forEach(element => {
        if (element === 10) {
            console.log(element)
        }
        for (let i = L; i <= R; i++) {
            let temp = a[i]
            console.log(temp)
            if (temp < element) {
                if (i === R) {
                    index = i + 1
                } else {
                    L = i + 1
                }
            } else {
                index = i
                i = R + 1
            }
        }
        console.log(index)
        a.splice(index, 0, element)
        L = L + 1
        R = R + 1
    });
    return a
}
console.log(contant(a, b))
