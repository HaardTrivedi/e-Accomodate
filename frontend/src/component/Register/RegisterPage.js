import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import TabsControl from '../ReactTab/ReactTab.js';
import GuestInput from './GuestInput/GuestInput';
import EmployeeInput from './EmployeeInput/EmployeeInput';
import PropertyInput from '../Property/PropertyInput/PropertyInput';
import {
        createRooms,
        registerHost,
        propertyValidate
} from '../Property/AddPropertyPage/AddPropertyPage';
import './RegisterPage.css';
import LoadSpinner from '../LoadingScreen/LoadSpinner';

const Register = () => {
        const [inputValue, setInputValue] = useState({
                firstName: '',
                midName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                houseNum: '',
                street: '',
                city: '',
                province: '',
                phoneNum: '',
                country: ''
        });
        const [propertyInput, setPropertyInput] = useState({
                propType: '',
                houseNum: '',
                street: '',
                city: '',
                province: '',
                country: '',
                roomType: '',
                rules: '',
                amenities: '',
                availDate: ''
        });
        const [price, setPrice] = useState({
                accomodates: 0
        });
        const [rooms, setRooms] = useState({
                bedrooms: 0,
                bathrooms: 0
        });
        const [employeeInput, setEmployeeInput] = useState({
                position: '',
                employeeType: '',
                salary: 0
        });

        const [loading, setLoading] = useState(false);
        const [register, setRegister] = useState('Guest');
        const [error, setError] = useState(false);

        const history = useHistory();

        const onChange = (event) => {
                const { name, value } = event.target;
                setInputValue({ ...inputValue, [name]: value });
        };

        const onSelectChange = (name, value) => {
                setInputValue({ ...inputValue, [name]: value });
        };

        const onPropertyChange = (name, value) => {
                setPropertyInput({ ...propertyInput, [name]: value });
        };
        const onRoomsChange = (name, value) => {
                setRooms({ ...rooms, [name]: value });
        };
        const onPriceChange = (name, value) => {
                setPrice({ ...price, [name]: value });
        };
        const onEmployeeChange = (name, value) => {
                setEmployeeInput({ ...employeeInput, [name]: value });
        };

        const handleButtonSubmit = async () => {
                setLoading(true);
                try {
                        if (!guestValidation(inputValue)) {
                                throw Error('Input validation error.');
                        }
                        if (register === 'Host') {
                                if (!propertyValidate(propertyInput, price)) {
                                        throw Error('Validation error');
                                }

                                const person = await registerGuest(inputValue);
                                // eslint-disable-next-line
                                const bbRooms = createRooms(
                                        rooms.bedrooms,
                                        rooms.bathrooms
                                );
                                await registerHost(
                                        person.pID,
                                        propertyInput,
                                        price,
                                        [rooms.bedrooms, rooms.bathrooms]
                                );
                                setLoading(false);
                                history.push('/login');
                                return;
                        } else if (register === 'Employee') {
                                await registerEmployee({
                                        ...inputValue,
                                        ...employeeInput
                                });
                                setLoading(false);
                                history.push('/login');
                                return;
                        } else if (register === 'Guest') {
                                await registerGuest(inputValue);
                                setLoading(false);
                                history.push('/login');
                                return;
                        }
                } catch (err) {
                        console.log(err);
                        setLoading(false);
                        setError(true);
                }
        };

        const ErrorMessage = error ? (
                <div className='error-message'>
                        Something went wrong. Unable to register.
                </div>
        ) : null;

        return (
                <div>
                        <LoadSpinner loading={loading} />
                        <div className='register-page'>
                                <div className='login-box register-box'>
                                        <p className='login-title'>Register</p>
                                        <div className='tabs-container'>
                                                <TabsControl setTab={setRegister}>
                                                        <div name='Guest'> <GuestInput onChange={onChange} input={inputValue} onSelectChange={onSelectChange} /></div>
                                                        <div name='Host'>
                                                                <GuestInput onChange={onChange} input={inputValue} onSelectChange={onSelectChange} />
                                                                <PropertyInput onPropertyChange={onPropertyChange} onPriceChange={onPriceChange} onRoomsChange={onRoomsChange} />
                                                        </div>
                                                        <div name='Employee'>
                                                                <GuestInput onChange={onChange} input={inputValue} onSelectChange={onSelectChange} />
                                                                <EmployeeInput input={employeeInput} onChange={onEmployeeChange} />
                                                        </div>
                                                </TabsControl>
                                        </div>
                                        <div>
                                                <button className='submitButton' onClick={handleButtonSubmit}>Register</button>
                                        </div>
                                        {ErrorMessage}
                                </div>
                        </div>
                </div>
        );
};

const guestValidation = (input) => {
        const {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                street,
                city,
                province,
                phoneNum
        } = input;

        if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || street.length === 0 || city.length === 0 || province.length === 0 || phoneNum.length === 0 || phoneNum.length < 10 || password.length < 6 || password.length > 24 || password !== confirmPassword) {
                return false;
        }
        return true;
};

const registerGuest = async (input) => {
        const newInput = { ...input };
        delete newInput.confirmPassword;
        const response = await fetch(
                'http://localhost:8080/api/guest-register',
                {
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newInput)
                }
        );
        if (response.ok) {
                const user = await response.json();
                return user;
        }
        console.log(response);
        throw new Error('Network response was not ok.');
};

const registerEmployee = async (input) => {
        const newInput = { ...input };
        delete newInput.confirmPassword;
        const response = await fetch(
                'http://localhost:8080/api/employee-register',
                {
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newInput)
                }
        );
        if (response.ok) {
                const user = await response.json();
                return user;
        }
        throw new Error('Network response was not ok.');
};

export default Register;
