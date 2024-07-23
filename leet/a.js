// 双指针
function fn (line, flaw) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'])
    const vowelIdxs = []
    for (let i = 0; i < line.length; i++) {
        if (vowels.has(line[i])) {
            vowelIdxs.push(i)
        }
    }
    let left = 0
    let right = 0
    let lengths = []
    while (right < vowelIdxs.length) {
        const lengthDiff = vowelIdxs[right] - vowelIdxs[left] - (right - left)
        if (lengthDiff > flaw) {
            left++
        } else {
            if (lengthDiff === flaw) {
                lengths.push(vowelIdxs[right] - vowelIdxs[left] + 1)
            }
            right++
        }
    }
}

const line = 'asdbuiodevaiifgh'
fn(line, 3)