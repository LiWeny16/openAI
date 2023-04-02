import axios from "axios"
import * as dotenv from 'dotenv'
dotenv.config()
const openAIKeys =process.env.OPENAI_API_KEY2
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
                return response.data.choices[0].message
            })
            .catch((error) => {
                console.log(error);
            });

        return completion
    } catch (error) {
        console.log(error);
    }
};
ask("傻逼")