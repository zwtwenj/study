let NUMBERS = /[0-9]/
const Numberic = 'Numberic'
const Punctuator = 'Punctuator'
let tokens = []

let currentToken;

function start (char) {
    if (NUMBERS.test(char)) {
        currentToken = { type: Numberic, value: ''}
        return number(char)
    }
    throw new TypeError('首字符必须是数字')
}

// 确定一个新的token
function emit(token) {
    currentToken = { type: '', value: ''}
    tokens.push(token)
}

function number (char) {
    if (NUMBERS.test(char)) {
        currentToken.value += char
        return number
    } else if (char === '+' || char === '-') {
        emit(currentToken)
        emit({type: Punctuator, value: char})
        currentToken = { type: Numberic, value: ''}
        return number
    }
}

function tokenizer (input) {
    let state = start;
    for (let char of input) {
        state = state(char);
    }
    if (currentToken.value.length > 0) {
        emit(currentToken)
    }
}

tokenizer("10+20+30-10")
console.log(tokens)