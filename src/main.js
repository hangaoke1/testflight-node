const app = require('express')()
const bodyParser = require('body-parser')
const _ = require('lodash')
const argPort = process.argv[2]
const port = !!argPort ? +argPort : 9610
const config = require('../config')

app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json({limit: '2mb'}))
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}))
app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Credentials", true)
    resp.header('Access-Control-Allow-Origin', '*')
    resp.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
    resp.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})

app.use('/index', (req, res) => {
	res.render("index.html",{ title:"主页" })
})

app.use('/refreshToken', (req, res) => {
	res.render("refreshToken.html",{ fingerprintUrl: config.serverUrl.fingerprint, title: "指纹同步" })
})

app.use('/refreshCustom', (req, res) => {
	res.render("refreshCustom.html",{ title: "指纹同步" })
})

app.use('/refreshTokenUrl', (req, res) => {
	res.render("refreshTokenUrl.html",{ title: "指纹同步" })
})

app.listen(port, () => {
    console.log('server start!')
    console.log(`port is ${port}`)
})
