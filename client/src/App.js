import axios from 'axios';
import LoginForm from './Form';
import Web3Provider from 'web3-react';
import React, { useState, useEffect } from "react";
import { Label, Segment , Container, Header, Placeholder, Button} from 'semantic-ui-react';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from './getWeb3';

import "./App.css";

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [networkId, setNetworkId] = useState(0);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [storageValue, setStorageValue] = useState(0);

  useEffect(() => {
    getWebinstance();
  }, []);

  useEffect(() => {
    initContract();
  }, [web3]);

  useEffect(() => {
    if (networkId) {
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const _instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(_instance);
    }
  }, [networkId]);

  useEffect(() => {
    //run();
  }, [contract]);

  const getWebinstance = async () => {
     // Get network provider and web3 instance.
     const _web3 = await getWeb3();
     setWeb3(_web3);
  }
  const initContract = async () => {
    if (web3){
      // Use web3 to get the user's accounts.
      const _accounts = await web3.eth.getAccounts();
      setAccounts(_accounts);

       // Get the contract instance.
       const _networkId = await web3.eth.net.getId();
       setNetworkId(_networkId);
    }
  }
  
  const handleButton = async () => {
    console.log("Front: Hello")
    await axios.get("http://localhost:4242");
  }

  const run = async () => {
    if (contract) {
      try {
        await runExample()
      } catch (error){
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
      }
    }
  }

  const runExample = async () => {

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    setStorageValue(response);
  };

    if (!web3) {
      return (
        <Segment inverted>
          <div>Loading Web3, accounts, and contract...</div>;
        </Segment>
      )
    }
    return (
      <Segment placeholder>
        <Container>
          <div className="App">
            <Label size='tiny' href="https://www.starton.io/" target="blank" as='a' color='teal' ribbon>
              powered by Starton
            </Label>
          <Segment padded raised inverted verticalAlign='middle'>
            NFTeam
          </Segment>
          
            {/* <div>The stored value is: {storageValue}</div> */}
          </div>
        </Container>
        <Segment placeholder>
          <LoginForm contract = {contract} web3={web3} />
        </Segment>
      </Segment>
    );
}

export default App;
