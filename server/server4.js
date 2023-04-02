import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
// import https from 'https'
import http from 'http'
import axios from "axios"
import HttpsProxyAgent from 'https-proxy-agent'
import HttpProxyAgent from 'http-proxy-agent'
dotenv.config()

const port = 8082
const app = express()
const openAIKeys = process.env.OPENAI_API_KEY1
const httpAgent = new HttpsProxyAgent("http://10.0.0.200:1082")
const httpsAgent = new HttpProxyAgent("http://10.0.0.200:1082")
// var options = {
//     key: fs.readFileSync('./SSLcer/'),
//     cert: fs.readFileSync('./SSLcer/pub.crt')
// }
// var httpsServer = https.createServer(options, app)
var httpServer = http.createServer(app)
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
        console.log("question: "+prompt);
        const response = await ask(`${prompt}`)
        res.send({
            bot: response
        })
    } catch (err) {
        // console.log(err)
        res.send(`{"msg":"有一些错误发生了","err":"${err}"}`)
    }
})




const ask = async (input) => {
    try {
        let data = {
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "user", "content": input }
            ]
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAIKeys}`
            },
            data: data,
            // httpAgent: httpAgent,
            // httpsAgent: httpsAgent,
            Proxy: {
                host: "10.0.0.200",
                port:1082,
                protocol:"https"
            }
        };
        let completion = await axios(config)
            .then((response) => {
                // console.log("response.data:", JSON.stringify(response.data));
                return response.data.choices[0].message.content
            })
            .catch((error) => {
                // console.log(error);
            });

        return completion
    } catch (error) {
        // console.log(error);
    }
};


httpServer.listen(port + 1, () => {
    console.log("http is running at" + " " + (port + 1))
})