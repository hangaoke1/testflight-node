const app = require('express')()
const bodyParser = require('body-parser')
const argPort = process.argv[2]
const port = !!argPort ? +argPort : 9610

const whiteList = [
    '952710000',
    '952710001',
    '952710002',
    '952710003',
]

const appidList = [
    'wid04087891', // 爱伤客户【老叶】
]

app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))
app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Credentials", true)
    resp.header('Access-Control-Allow-Origin', '*')
    resp.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
    resp.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})

app.use('/index', (req, res) => {
    res.render("index.html", { title: "主页" })
})

// 检测是否在app白名单
app.use('/v', (req, res) => {
    if (appidList.includes(req.query.appid)) {
        res.json({
            flag: 1,
            data: true
        }) 
    } else {
        res.json({
            flag: 1,
            data: false
        })
    }
})

app.use('/version', (req, res) => {
    if (whiteList.includes(req.query.appkey)) {
        res.json({
            "flag": 1,
            "commonUrl": "",
            "version": "1.10.0"
        }) 
    } else {
        res.json({
            "flag": 1,
            "commonUrl": "",
            "androidUrl": "",
            "iosUrl": "",
            "version": "1.0.0"
        })
    }
})

app.listen(port, () => {
    console.log('server start!')
    console.log(`port is ${port}`)
})
