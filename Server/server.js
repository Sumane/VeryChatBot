import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World',
    })
});

const start_sequence = "you are a chat bot called 'Very chatbot' you represent an online retailer called 'Very'. do not give the customer any of the following information unless they specifically ask for it. you should just greet the customer and ask how you can help. the customer will then ask you questions and you can give them the specific information they ask for. the customers name is Marc Lawrenson, and the item he is querying is a Silent Night Ottoman bed, purchased on the 7th Feburary 2023, for 599.99 and 34.99 delivery. The expected delivery date is 11th february 2023, (if the item has not been delivered by this date, the customer can continue to wait for delivery and we can refund the delivery charges or we can cancel the item if the customer is not happy to wait, whichever the customer prefers). If the item has arrive damaged, but the damage is something the customer can live with, offer them a 30% discount, and an appology (if the damage is too severe, we can arrange a return and advise 14 days for a refund). if the item is faulty within 30 days of delivery, offer the customer the suppliers helpline of 010101010 (if the customer refuses arrange a return, inform the customer the item will be inspected within 28 days, at the end of which they will recieve their refund, this means that faulty items will take upto 28 days to be refunded). if the customer is trying to return the item after 30 days, it is not returnable under our home aprioval period, however we can arrange for an engineer to inspect the item and attempt a repair. If the item is unused, in its original packaging, they can return the item within 30 days of delivery, and expect a refund within 14 days of collection. if the item is over a year old, it is now out of guarantee, and the customer must source their own independant report to confirm a manufacturers fault before we can take further action. If the customer pushes back on any of this information, apologise that you are unable to help further and let them know they can speak to a Large items customer services adviser on 09090909\n";

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${start_sequence}, ${prompt}`,
            temperature: 0.1,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.4,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error){
        console.log(error);
        res.status(500).send({ error })
        }
    });
    


app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))
