import axios from "axios";
import dotenv from 'dotenv';
import { utils } from 'ethers';
import express from 'express';

dotenv.config()


const http = axios.create({
    baseURL: "https://api-connect.starton.io/v1",
    headers: {
        "x-api-key": process.env.API_KEY
    },
})

const app = express();

const getBlockchains = async () => {
    const blockchains = await http.get('/blockchain');
    const supportedChains = blockchains.data.items.filter(chain => chain.name.includes(process.argv[2]));

    if (process.argv[3] && process.argv[3] === '--show-networks') {
        console.log(`Supported networks for ${process.argv[2]}: `);
        supportedChains.map(blockchain => {
            console.log(blockchain.networks);
        })
    }


    // const blockchains = erc20Templates.map(erc20Template => {
    //     console.log(erc20Template.name, ":", erc20Template.blockchains)
    //    return erc20Template.blockchains
    // })
    // console.log("Returned Blockchains ==> ", blockchains);

    // templates.data.items.map(template => console.log(".....", template.tags[0].name, ": ", templates));
    return blockchains.data
}

const getTemplates = async () => {
    const templates = await http.get('/template');
    const erc20Templates = templates.data.items.filter(template => template.name.includes(process.argv[2]));
    const blockchains = erc20Templates.map(erc20Template => {
        console.log(erc20Template.name, ":", erc20Template.blockchains)
        return erc20Template.blockchains
    })
    console.log("Returned Blockchains ==> ", blockchains);

    // templates.data.items.map(template => console.log(".....", template.tags[0].name, ": ", templates));
    return templates.data
}

app.use(express.json())

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
})

app.get('/', (req, res) => {
    console.log("Hello Peers");
})

app.post('/verify-signature', (req, res, next) => {
    console.log("Response from front >> ", req.body);
    const message = "On n'interchange pas une equipe qui gagne";
    const signature = req.body.userSignature;
    const userAddress = utils.verifyMessage(message, signature);

    if (userAddress) {
        res.statusCode = 200;
        res.send(`User connected with wallet ${userAddress}`);
    }
    else {
        res.statusCode = 401;
        res.send("This User is not correctly authenticated")
    }

    next();
})

app.get('/templates', async (req, res) => {
    console.log('Show all Starton Templates');
    const template = await getTemplates(req.body.template)
})

const port = process.env.PORT_NUMBER
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
