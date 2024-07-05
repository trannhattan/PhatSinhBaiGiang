const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
}));


app.post('/api/getGeminiAnswer', async (req, res, next) => {
    try {
        const { question, gemini_model } = req.body;
        if(question != "") {
            const model = genAI.getGenerativeModel({ model: gemini_model});

            const result = await model.generateContentStream([question]);
            for await(const chunk of result.stream){
                const chunkText = chunk.text();
                res.write(chunkText);
            }
        }
        else {
            res.write(err);
        }
        res.end();
        
    } catch (error) {
      return next(error)
    }  
    
})

app.get('/api/trongnuoc', (req, res) => {
    //Response
    fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY2}&q=Hanoi&aqi=no`)
    .then(r => r.text())
    .then(data => {
        res.json(data);
    });
})


app.listen(process.env.PORT);