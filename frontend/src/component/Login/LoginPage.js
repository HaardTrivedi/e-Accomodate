import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import LoadSpinner from '../LoadingScreen/LoadSpinner';
import './LoginPage.css';

const LoginPage = ({ loadUser }) => {
        const [inputValue, setInputValue] = useState({
                email: '',
                password: ''
        });
        const [error, setError] = useState(false);
        const [loading, setLoading] = useState(false);
        const history = useHistory();

        const onChange = (event) => {
                const { name, value } = event.target;
                setInputValue({ ...inputValue, [name]: value });
        };

        const handleButtonSubmit = async (event) => {
                event.preventDefault();
                setLoading(true);
                try {
                        if (
                                inputValue.email.length === 0 ||
                                inputValue.password.length < 6 ||
                                inputValue.password.length > 24
                        ) {
                                throw Error('Invalid Inputs');
                        }
                        const response = await fetch(
                                'http://localhost:8080/api/login',
                                {
                                        method: 'post',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email: inputValue.email, password: inputValue.password })
                                }
                        );
                        if (response.ok) {
                                const data = await response.json();
                                if (data.pID) {
                                        loadUser(data);
                                        setLoading(false);
                                        history.push('/');
                                        return;
                                }
                        }
                        throw Error('Unable to login');
                } catch (err) {
                        console.log(err);
                        setLoading(false);
                        setError(true);
                }
        };

        const ErrorMessage = error ? (
                <div className='error-message'>Invalid email or password.</div>
        ) : null;
        return (
                <div>
                        <LoadSpinner loading={loading} />
                        <div className='login-page'>
                                <div className='login-box'>
                                        <p className='login-title'>
                                                Welcome to e-Accomodate!
                                        </p>
                                        {ErrorMessage}
                                        <form onSubmit={handleButtonSubmit}>
                                                <div>
                                                        <input
                                                                className='login-input'
                                                                name='email'
                                                                type='email'
                                                                value={inputValue.email}
                                                                placeholder='Email'
                                                                onChange={onChange}
                                                                required
                                                        />
                                                        <input
                                                                className='login-input'
                                                                name='password'
                                                                type='password'
                                                                value={inputValue.password}
                                                                placeholder='Password'
                                                                onChange={onChange}
                                                                required
                                                        />
                                                </div>
                                                <div style={{ float: 'right' }}>
                                                        <Link to='/register'>
                                                                <p className='login-register-hint'>
                                                                        Don't
                                                                        have an
                                                                        account?
                                                                </p>
                                                        </Link>
                                                </div>

                                                <div>
                                                        <button
                                                                type='submit'
                                                                className='submitButton'
                                                                onClick={handleButtonSubmit}>
                                                                Login
                                                        </button>
                                                </div>
                                        </form>
                                </div>
                                <div className='login-background'>
                                </div>
                        </div>
                </div>
        );
};

export default LoginPage;
