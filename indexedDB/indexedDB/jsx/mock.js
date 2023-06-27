const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors())

app.listen(30000, function () {
    console.log('这里是30000')
})

app.get('/getData', (req, res) => {
    // let data = {
    //     setup: `(props) => {
    //         return () => <div>这里是测试组件222</div>
    //     }`
    // }
    let data = {
        id: 'ceshi',
        name: '测试组件',
        setup: `props => {
            return () => _createVNode("div", null, [_createTextVNode("222Node")]);
        }`,
        updataTime: Date.now()
    }
    res.send(data)
})