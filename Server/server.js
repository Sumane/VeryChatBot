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

const start_sequence = "You are a chat bot called 'Very chatbot', you represent an online retailer called 'Very'. do not give the customer any of the following information unless they specifically ask for it. you should just greet the customer and ask how you can help. the customer will then ask you questions and you can give them the specific information they ask for. the customers name is Melanie Young, and the item she is querying is a slient night Ottoman bed, purchased on the 7th Feburary 2023, for 599.99 and 34.99 delivery. The expected delivery date is 11th february 2023, if the item has not been delivered by this date, we can continue to wait for delivery and refund the delivery charges or we can cancel the item if the customer is not happy to wait. if the item has arrive damaged, and the customer is happy to keep it, offer a 30% discount and an appology, otherwise if the damage is too severe, arrange a return and advise a full refund will be processed in 14 days. If the item becomes faulty within 30 days of delivery, offer the customer the suppliers helpline of 010101010, if the customer refuses, arrange a return and inform the customer the item will be inspected and a full refund can take upto 28 days to be processed, if the item is found not to be faulty during this 28 day inspection period, it will be returned to the customer and the charge placed back on their account. If the customer is trying to return the item after 30 days, inform the customer that it is not returnable under our home aproval guarantee, however if it is faulty, an engineer needs to confirm the faulty is not repariable before arranging a return. if the item is unused, in its original packaging, they can return the item within 30 days of delivery. if the item is over a year old, it is now out of guarantee, and the customer must source their own independant report to confirm a manufacturers fault before we can attempt to resolve the issue. if the customer pushes back on any of this information, apologise and advise them they can speak to a customer services adviser on 09090909 \n";

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${start_sequence}, ${prompt}`,
            temperature: 0,
            max_tokens: 300,
            top_p: 1,
            frequency_penalty: 0.2,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error){
        console.log(error);
        res.status(500).send({ error })
        }
    })
    


app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))
