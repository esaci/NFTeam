import React, { setState, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import Web3 from 'web3';

const LoginForm = ({contract, web3}) => {


    const [userAddress, setUseraddress] = useState('');
    const [spotifyId, setSpotifyId] = useState(null);
    const [isTeamRunning, setIsTeamRunning] = useState(false)

    useEffect(() => {

    }, [])

    const handleAddress = (e) => {
        e.preventDefault();
        setUseraddress(e.target.value);
    }

    const handleId = (e) => {
        e.preventDefault();
        setSpotifyId(e.target.value);
    }

    const handleLaunch = async () => {
        await axios.post("http://localhost:4242/LaunchTeam", {
            artistWallet: userAddress,
            spotifyId: spotifyId
        })
        setUseraddress('');
        setSpotifyId('');
        setIsTeamRunning(true); 
    }
    const handleClose = async () => {
        await axios.post("http://localhost:4242/closeTeam");
        setIsTeamRunning(false);
    }

    const toogleTeam = async () => {
        if (isTeamRunning){
           await handleClose();
        } else {
            await handleLaunch()
        }
    }
    return (
        <Grid textAlign='center' style={{ height: '50vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
                Artists, Launch Your Team !
            </Header>
            <Form size='large'>
                <Segment stacked>
                <Form.Input required onChange={handleAddress} fluid icon='ethereum' iconPosition='left' placeholder='Wallet address' />
                <Form.Input
                    fluid
                    required
                    icon='spotify'
                    iconPosition='left'
                    onChange={handleId}
                    placeholder='spotify ID'
                />

                <Button onClick={toogleTeam} color='green' fluid size='large'>
                    Launch NFTeam
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