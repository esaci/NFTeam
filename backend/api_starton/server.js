import axios from "axios";
import dotenv from 'dotenv';
import express from 'express';
import { utils } from 'ethers';

dotenv.config()

const contractAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "userWallet",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "userName",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isArtist",
          "type": "bool"
        }
      ],
      "name": "userAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userWallet",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_userName",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "_isArtist",
          "type": "bool"
        }
      ],
      "name": "addUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_metadataUri",
          "type": "string"
        }
      ],
      "name": "newMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

const byteCode = "0x608060405234801561001057600080fd5b50604051610b4d380380610b4d833981810160405281019061003291906100ce565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610149565b6000815190506100c881610132565b92915050565b6000602082840312156100e4576100e361012d565b5b60006100f2848285016100b9565b91505092915050565b60006101068261010d565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600080fd5b61013b816100fb565b811461014657600080fd5b50565b6109f5806101586000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806306dde62d1461003b578063bfbc01cc14610057575b600080fd5b61005560048036038101906100509190610525565b610073565b005b610071600480360381019061006c91906104c9565b6102f3565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610101576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100f89061069a565b60405180910390fd5b60001515600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610194576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018b906106ba565b60405180910390fd5b6040518060800160405280600254815260200182151581526020018473ffffffffffffffffffffffffffffffffffffffff168152602001838152506003836040516101df9190610653565b90815260200160405180910390206000820151816000015560208201518160010160006101000a81548160ff02191690831515021790555060408201518160010160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600201908051906020019061027a92919061038c565b509050506001600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600260008154809291906102e990610844565b9190505550505050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff1663d204c45e84846040518363ffffffff1660e01b815260040161035592919061066a565b600060405180830381600087803b15801561036f57600080fd5b505af1158015610383573d6000803e3d6000fd5b50505050505050565b828054610398906107e1565b90600052602060002090601f0160209004810192826103ba5760008555610401565b82601f106103d357805160ff1916838001178555610401565b82800160010185558215610401579182015b828111156104005782518255916020019190600101906103e5565b5b50905061040e9190610412565b5090565b5b8082111561042b576000816000905550600101610413565b5090565b600061044261043d846106ff565b6106da565b90508281526020810184848401111561045e5761045d61091f565b5b61046984828561079f565b509392505050565b60008135905061048081610991565b92915050565b600081359050610495816109a8565b92915050565b600082601f8301126104b0576104af61091a565b5b81356104c084826020860161042f565b91505092915050565b600080604083850312156104e0576104df610929565b5b60006104ee85828601610471565b925050602083013567ffffffffffffffff81111561050f5761050e610924565b5b61051b8582860161049b565b9150509250929050565b60008060006060848603121561053e5761053d610929565b5b600061054c86828701610471565b935050602084013567ffffffffffffffff81111561056d5761056c610924565b5b6105798682870161049b565b925050604061058a86828701610486565b9150509250925092565b61059d81610757565b82525050565b60006105ae82610730565b6105b8818561073b565b93506105c88185602086016107ae565b6105d18161092e565b840191505092915050565b60006105e782610730565b6105f1818561074c565b93506106018185602086016107ae565b80840191505092915050565b600061061a600c8361073b565b91506106258261093f565b602082019050919050565b600061063d60138361073b565b915061064882610968565b602082019050919050565b600061065f82846105dc565b915081905092915050565b600060408201905061067f6000830185610594565b818103602083015261069181846105a3565b90509392505050565b600060208201905081810360008301526106b38161060d565b9050919050565b600060208201905081810360008301526106d381610630565b9050919050565b60006106e46106f5565b90506106f08282610813565b919050565b6000604051905090565b600067ffffffffffffffff82111561071a576107196108eb565b5b6107238261092e565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600061076282610775565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156107cc5780820151818401526020810190506107b1565b838111156107db576000848401525b50505050565b600060028204905060018216806107f957607f821691505b6020821081141561080d5761080c6108bc565b5b50919050565b61081c8261092e565b810181811067ffffffffffffffff8211171561083b5761083a6108eb565b5b80604052505050565b600061084f82610795565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156108825761088161088d565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e6f7420616e2061646d696e0000000000000000000000000000000000000000600082015250565b7f7573657220616c72656164792065786973747300000000000000000000000000600082015250565b61099a81610757565b81146109a557600080fd5b50565b6109b181610769565b81146109bc57600080fd5b5056fea2646970667358221220e4bdefc7fc6df677c4b0320286a8af271e1bf68789736b8827fd2ef01efad20c64736f6c63430008060033"

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

    return templates.data
}

const deployContract = async () => {

    const contractInfos = {
        "networkId": "ETHEREUM_ROPSTEN",
        "name": "NFTeamAuth",
        "description": "Authentication contract for our NFteamers",
        "params": [ // parameter values for the smart contract constructors, this will change depending of your contract
            "0x6efd694b5FCc6dc9ce08F27605D61b1B3357307C", // TokenAddress
        ],
        "abi": contractAbi,// Paste here the abi you copied to clipboard
        "bytecode": byteCode,// Paste here the bytecode you copied to clipboard
        "compilerVersion": "0.8.6",
    }
    const retunedInfos = await http.post('/smart-contract/from-bytecode', contractInfos);

    return retunedInfos;
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
    console.log("Hello NFTeam");
})

app.post('/LaunchTeam', (req, res) => {
  //Trigger contract launch function
  console.log(req.body)

})

app.post('/LaunchTeam', (req, res) => {
  //Trigger contract close function
  console.log(req.body)


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

const runDeploy = (async () => {
    const receivedInfos = await deployContract();

    console.log("Deployed Contract  : ", receivedInfos);
})()
