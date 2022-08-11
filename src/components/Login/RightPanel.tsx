import React, { useState } from 'react';
import { Container, Button, InputGroup, FormControl, Spinner } from 'react-bootstrap';
import { Redirect, useHistory } from 'react-router';
import { toastify } from '../common/notification';
import axios from 'axios';

import config from '../../config.json';
import Signup from './Signup';
import './Login.css'

const RightPanel = ({ setUser }: { setUser: Function }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<any>(' ');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [action, setAction] = useState('Login')
    const history = useHistory();

    const handleLogin = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (username === '' || password === '') return;

        setIsLoading(true);

        // const url = config['baseHost_backend'] + '/login';
        const url = config['baseHost_backend'] + '/drm-sign-in';
        
        const requestOptions = {
            email: username,
            password: password,
        };


        axios
            .post(url, requestOptions)
            .then((response) => {
                console.log('response', response);

                setIsLoading(false);
                if (response.data.statusCode === 200) {
                    console.log('Login responce', response)
                    localStorage.setItem('$AuthToken11', response.data.body.access_token);
                    localStorage.setItem('$AuthToken', response.data.body.access_token);
                    setUser({
                        id: response.data.body.user_info.id,
                        email: response.data.body.user_info.email,
                        name: `${response.data.body.user_info.first_name} ${response.data.body.user_info.last_name}`,
                        role: response.data.body.user_info.role,
                        type:response.data.body.user_info.type,
                        ID:response.data.body.user_info.ID,
                        authToken: response.data.access_token,
                    });

                    setIsSuccess(true);

                    // if (response.data.body.user.role === "super_admin") {
                    // 	history.push("/dashboard");
                    // }

                    toastify('success', 'Login Success');
                    history.push('/dashboard');
                } else {
                    toastify('failure', 'Invalid Username and Password');
                    history.push('/');
                }
            })
            .catch((err) => {
                toastify('failure', 'Invalid Username and Password');
                setIsLoading(false);
            });
    };
    return (
        <div>
            {isSuccess ? (
                <Redirect to='/dashboard' />) : ""}

            <Container
                className='d-flex align-items-center justify-content-center'
                style={{ minHeight: '100vh', flexDirection: 'column' }}>
                {action === 'Login' ?
                    (
                        <>
                            <div
                                style={{
                                    marginTop: '2%',
                                    width: '450px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <h1 className='lable-2'>Sign in to Cognitgo</h1>
                            </div>
                            <div
                                style={{
                                    height: '250px',
                                    width: '450px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginTop: '5%',
                                    marginLeft: '10%',
                                }}>
                                <form onSubmit={handleLogin} id='login'>
                                    <div style={{marginLeft: '-5%'}}>
                                        <div>
                                            <InputGroup className='input'>
                                                <FormControl
                                                    placeholder='Email'
                                                    aria-label='Email'
                                                    aria-describedby='basic-addon1'
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    name='username'
                                                    id='username'
                                                />
                                            </InputGroup>
                                            <InputGroup className='input'>
                                                <FormControl
                                                    placeholder='Password'
                                                    aria-label='password'
                                                    name='password'
                                                    type={showPassword ? 'text' : 'password'}
                                                    id='password'
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    aria-describedby='basic-addon1'
                                                />
                                                <Button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    variant='outline-secondary'
                                                    id='button-addon2'>
                                                    {showPassword ? (
                                                        <svg
                                                            style={{ height: '25px' }}
                                                            fill='none'
                                                            viewBox='0 0 24 24'
                                                            stroke='currentColor'
                                                            strokeWidth={2}>
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            style={{ height: '25px' }}
                                                            fill='none'
                                                            viewBox='0 0 24 24'
                                                            stroke='currentColor'
                                                            strokeWidth={2}>
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                                            />
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                                            />
                                                        </svg>
                                                    )}
                                                </Button>
                                            </InputGroup>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <Button
                                                className='button'
                                                size='lg'
                                                type='submit'
                                                style={{
                                                    width: '85%',
                                                    marginLeft: '2%',
                                                    padding: '3%',
                                                    marginTop: '3%',
                                                }}
                                                onClick={handleLogin}>
                                                {isLoading ? (
                                                    <Spinner animation='border' variant='primary' />
                                                ) : (
                                                    'Sign in'
                                                )}
                                            </Button>
                                        </div>
                                        <br />
                                        {/* <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        paddingRight: '11%',
                                        marginTop: '12px',
                                    }}>
                                    <a href='/forgot-password'>Forgot password?</a>
                                </div> */}
                                    </div>
                                </form>
                            </div>

                        </>) : <Signup />}
                {action === "Login" ?
                 <span className='action-label'>Need an account? <span className='action-label-link' onClick={() => { setAction('Signup') }}>SignUp</span></span>
                 : <span className='action-label signupAsk'>Already a user? <span className='action-label-link' onClick={() => { setAction('Login') }}>Login</span></span>}
            </Container>

        </div>
    );
};

export default RightPanel;
