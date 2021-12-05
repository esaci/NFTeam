import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const http = axios.create({
    baseURL: "https://api-connect.starton.io/v1",
    headers: {
        "x-api-key": process.env.API_KEY
    },
})

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

module.exports = {
    getTemplates
}
//getTemplates()