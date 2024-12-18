let mysql = require('mysql')

let server = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    datebase: 'test'
})
console.log('123')

server.connect((err) => {
    if (err) {
        console.error('连接失败：' + err.stack)
        return
    } else {
        console.log('连接成功')
    }
})

function serverQuery (server, code) {
    return new Promise((res, rej) => {
        return server.query(code, (err, result) => {
            if (err) {
                rej(err)
            } else {
                res(result)
            }
        })
    })
}

serverQuery(server, "use test").then((result) => {
    return serverQuery(server, "select * from stu")
}, (err) => {
    console.log('查询出错' + err.message)
    return
}).then((result) => {
    console.log(result)
}, (err) => {
    console.log('查询出错' + err.message)
    return
})