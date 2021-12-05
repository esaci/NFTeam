import React from 'react';
import axios from 'axios';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import Web3 from 'web3';

const LoginForm = ({contract, web3}) => {

    const handleSubmit = async () => {
        if (window.ethereum){
            const _web3 = new Web3(window.ethereum);
        try{
            // Request account access if needed
            await window.ethereum.enable();
            console.log("OK")
        } catch (error){
            console.error(error);
        }
        }

            // console.log('Web3 >> ', await web3.eth.accounts.sign());      
            // console.log('Web3 >> ', await web3.eth.accounts);      
            // console.log('Web3 >> ', await web3.eth.getAccounts());      
    }
    return (
        <Grid textAlign='center' style={{ height: '50vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
                Create account
            </Header>
            <Form size='large'>
                <Segment stacked>
                <Form.Input fluid icon='ethereum' iconPosition='left' placeholder='Wallet address' />
                <Form.Input
                    fluid
                    icon='spotify'
                    iconPosition='left'
                    placeholder='spotify userName'
                />

                <Button onClick={handleSubmit} color='green' fluid size='large'>
                    Join NFTeam
                </Button>
                </Segment>
            </Form>
            <Message>
                New to us? <a href='#'>Sign Up</a>
            </Message>
            </Grid.Column>
        </Grid>
    )
}

export default LoginForm