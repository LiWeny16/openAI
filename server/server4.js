import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
// import https from 'https'
import http from 'http'
import axios from "axios"
dotenv.config()

const port = 8082
const app = express()
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
        console.log(prompt);
        const response = await ask(`${prompt}`)
        res.send({
            bot: response
        })
    } catch (err) {
        console.log(err)
        res.send(`{"msg":"有一些错误发生了","err":"${err}"}`)
    }
})




const openAIKeys = process.env.OPENAI_API_KEY2
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

        };
        let completion = await axios(config)
            .then((response) => {
                console.log("response.data:", JSON.stringify(response.data));
                return response.data.choices[0].message.content
            })
            .catch((error) => {
                console.log(error);
            });

        return completion
    } catch (error) {
        console.log(error);
    }
};


httpServer.listen(port + 1, () => {
    console.log("http is running at" + " " + (port + 1))
})