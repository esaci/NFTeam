import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const http = axios.create({
    baseURL: "https://api-connect.starton.io/v1",
    headers: {
        "x-api-key": process.env.API_KEY
    },
})

const getBlockchains = async () => {
    const blockchains = await http.get('/blockchain');
    const supportedChains = blockchains.data.items.filter(chain => chain.name.includes(process.argv[2]));

    if (process.argv[3] && process.argv[3] === '--show-networks'){
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

module.exports = {
    getBlockchains
}

//getBlockchains();