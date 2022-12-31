import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import https from 'https'
import http from 'http'
import fs from 'fs'

const app = express()
const port = 8082
//同步读取密钥和签名证书
var options = {
    key: fs.readFileSync('./SSLcer/key.key'),
    cert: fs.readFileSync('./SSLcer/pub.crt')
}
var httpsServer = https.createServer(options, app)
var httpServer = http.createServer(app)



dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY2,
})

const openai = new OpenAIApi(configuration)
app.use(cors())
app.use(express.json())

app.get('/hello', function (req, res, next) {
    res.send('Hello Express+https,everything is ok')
})

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex,please use POST to get data',
    })
})

app.post('/', async (req, res) => {
    try {
        let prompt = req.body.prompt
        console.log(prompt);
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            // stop: ["\"\"\""],
        })
        res.send({
            bot: response.data.choices[0].text
        })
    } catch (err) {
        console.log(err)
        res.send(`{"msg":"有一些错误发生了","err":"${err}"}`)
    }
})
// app.listen(port, () => { console.log(`running at ${port}`) })

//https监听8082端口
httpsServer.listen(port, () => {
    console.log("https is running at" + " " + port)
})
//http监听8083端口
httpServer.listen(port + 1, () => {
    console.log("http is running at" + " " + (port + 1))
})