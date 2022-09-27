import React, { useState } from 'react';
import { auth, provider } from './firebase';
import { toastInfo } from './shared/toastInfo';
import { makeStyles } from '@material-ui/core/styles';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import GoogleLogo from './images/Google G Logo.png';
import ImageLogo from './images/logo-bitmessage.png';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import api from './services/api';
import './Login.css';


function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            margin: theme.spacing(1),
          },
        },
    }));

    const signInGoogle = () => {
        const google ="google";

        auth.signInWithPopup(provider)
            .catch((error) => toastInfo(`${error}`, google, "top-center"));
    };

    const loginAnonymously = () => {
        const anonymous = "anonymous";

        auth.signInAnonymously()
            .catch((error) => toastInfo(`${error}`, anonymous, "top-center"));
                   
    };

    return (
        <div className="login"> 
            <div className="login__container">
                <h1 className='color-gray'>BitMessage - Chat</h1>
                <img 
                    src={ImageLogo}
                    alt="Logo" 
                />

                <div className="inputs_login">
                    <TextField
                        required
                        id="outlined-required"
                        label="Usuário"
                        name="email"
                        onChange={event => setEmail(event.target.value)}
                    />

                    <TextField
                        required
                        id="outlined-required"
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />

                <Button onClick={loginApi} className="background-success" variant="contained">Entrar</Button>
                </div>
           
                <div className="login__withGoogle" onClick={signInGoogle}>
                    <img 
                        src={GoogleLogo}
                        alt="Google Logo" 
                    />
                    <span>Google</span>
                </div>

                <div className="login__withGoogle login__Anonymously" onClick={loginAnonymously}>
                    <PermIdentityIcon />
                    <span>Login Teste</span>
                </div>
            </div>
        </div>
    )
}

export default Login
