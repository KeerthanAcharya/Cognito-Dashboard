import React, { useContext, useState } from 'react';
import { Container, Button, InputGroup, FormControl, Spinner, Form } from 'react-bootstrap';
import { Redirect, useHistory } from 'react-router';
import { toastify } from '../common/notification';
import axios from 'axios';
import './signup.css'
import config from '../../config.json';
import { Types, Roles } from '../../utils/utils'
import { UserContext } from '../common/UserContext';
const Signup = () => {
    const [firstName, setfirstName] = useState<string>('');
    const [lastName, setlastName] = useState<string>('');
    const [email, setemail] = useState<string>('');
    const [password, setPassword] = useState<any>(' ');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [filtedRoles, setFilteredRole] = useState<any>([])
    const [type, setType] = useState<any>(null)
    const { authToken } = useContext(UserContext);
    const [role, setRole] = useState<any>(null)

    const history = useHistory();

    const handleSignup = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password || !role || !type) return;

        setIsLoading(true);

        const url = config['baseHost_backend'] + '/create-user';

        var date = new Date() as any;
        var components = [
            date.getYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];

        const options = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            is_active: 1,
            ID: components.join(""),
            role: role,
            type: type,
            contactdetails: {
                cell_number: null,
                work_number: null,
                communication_address: null,
            },
        };


        axios
            .post(`${url}`, options, {
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            })
            .then((response) => {
                console.log('create user response', response);

                setIsLoading(false);
                if (response.data.statusCode === 200) {
                    localStorage.setItem('$AuthToken', response.data.body.access_token);
                    setIsSuccess(true);

                    toastify('success', 'Registration Success');
                    history.push('/auth');
                } else {
                    console.log('response?.data?.body', response?.data?.body?.message)
                    toastify('failure', response?.data?.body.message);
                    return
                }
            })
            .catch((err) => {
                toastify('failure', 'Unable to complete the Signup process, Please Try again!');
                setIsLoading(false);
            });
    };


    const handleTypeChange = (e: any) => {
        setType(e.target.value)
        let filterd = Roles?.filter((role: any) => {
            if (role.type === e.target.value) {
                return role
            }
        }
        )
        setFilteredRole(filterd)
        console.log('filterd', filtedRoles)

    }

    return (
        <div>
            {isSuccess ? (
                <Redirect to='/dashboard' />) : ""}
            <>
                <h1 className='lable-2 text-center'>SignUp here</h1>
                <div>
                    <form onSubmit={handleSignup} id='login' >
                        <div>
                            <div className='main-cont'>
                                <InputGroup className='input w-100'>
                                    <FormControl
                                        placeholder='First Name'
                                        aria-label='FirstName'
                                        aria-describedby='basic-addon1'
                                        onChange={(e) => setfirstName(e.target.value)}
                                        name='FirstName'
                                        id='FirstName'
                                    />
                                </InputGroup>
                                <InputGroup className='input w-100'>
                                    <FormControl
                                        placeholder='Last Name'
                                        aria-label='LastName'
                                        aria-describedby='basic-addon1'
                                        onChange={(e) => setlastName(e.target.value)}
                                        name='LastName'
                                        id='LastName'
                                    />
                                </InputGroup>
                                <InputGroup className='input w-100'>
                                    <FormControl
                                        placeholder='Email'
                                        aria-label='Email'
                                        aria-describedby='basic-addon1'
                                        onChange={(e) => setemail(e.target.value)}
                                        name='email'
                                        id='email'
                                    />
                                </InputGroup>
                                <InputGroup className='input w-100'>
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
                                <InputGroup className='input w-100'>
                                    <Form.Select
                                        aria-describedby='basic-addon1'
                                        onChange={handleTypeChange}
                                    >
                                        <option value="null">Select Type</option>
                                        {Types?.map((type: any, index: any) => (
                                            <option value={type.value}>{type.label}</option>
                                        ))}
                                    </Form.Select>
                                </InputGroup>
                                <InputGroup className='input w-100'>
                                    <Form.Select
                                        onChange={(e: any) => { setRole(e.target.value) }}
                                        aria-describedby='basic-addon1'
                                    >
                                        <option value="null">Select Role</option>
                                        {filtedRoles?.map((filter: any) => (
                                            <option value={filter.value}>{filter.label}</option>
                                        ))}
                                    </Form.Select>
                                </InputGroup>

                                <Button
                                    className='button mb-3 w-100'
                                    size='lg'
                                    type='submit'
                                    style={{
                                        width: '85%',
                                        marginLeft: '2%',
                                        padding: '3%',
                                        marginTop: '3%',
                                    }}
                                    onClick={handleSignup}>
                                    {isLoading ? (
                                        <Spinner animation='border' variant='primary' />
                                    ) : (
                                        'SignUp'
                                    )}
                                </Button>
                            </div>
                            <br />
                        </div>
                    </form>
                </div>

            </>
        </div>
    );
};

export default Signup;
