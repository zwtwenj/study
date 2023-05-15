let obj = {
    a: 100
}

function fn () {
    a = 10
    console.log(a)
    // console.log(this.a)
}

fn.call(obj)