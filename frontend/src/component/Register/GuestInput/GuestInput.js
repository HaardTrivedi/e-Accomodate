import React from 'react';
import Select from 'react-select';
import './GuestInput.css';

const countryOpt = [
        { value: 'Canada', label: 'Canada' },
        { value: 'United States', label: 'United States' }
];

const GuestInput = ({ onChange, input, onSelectChange }) => {
        const {
                firstName,
                midName,
                lastName,
                email,
                password,
                confirmPassword,
                houseNum,
                street,
                city,
                province,
                phoneNum,
                country
        } = input;

        const handleSelectChange = (name) => {
                return (newValue) => {
                        onSelectChange(name, newValue.value);
                };
        };

        return (
                <div>
                        <div>
                                <p className='register-title'>
                                        Personal Information
                                </p>
                        </div>
                        <div>
                                <input
                                        className='login-input register-fn'
                                        name='firstName'
                                        type='firstName'
                                        placeholder='First Name'
                                        onChange={onChange}
                                        value={firstName}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-mn'
                                        name='midName'
                                        type='midName'
                                        placeholder='Middle Name'
                                        onChange={onChange}
                                        value={midName}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-ln'
                                        name='lastName'
                                        type='lastName'
                                        placeholder='Last Name'
                                        onChange={onChange}
                                        value={lastName}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-email'
                                        name='email'
                                        type='email'
                                        placeholder='Email Address'
                                        onChange={onChange}
                                        value={email}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-password'
                                        name='password'
                                        type='password'
                                        placeholder='Password (6 - 24 characters)'
                                        onChange={onChange}
                                        value={password}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-password'
                                        name='confirmPassword'
                                        type='password'
                                        placeholder='Confirm Password'
                                        onChange={onChange}
                                        value={confirmPassword}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-addr'
                                        name='houseNum'
                                        type='houseNum'
                                        placeholder='Apt #'
                                        onChange={onChange}
                                        value={houseNum}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-addr'
                                        name='street'
                                        type='street'
                                        placeholder='Street'
                                        onChange={onChange}
                                        value={street}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-addr'
                                        name='city'
                                        type='city'
                                        placeholder='City'
                                        onChange={onChange}
                                        value={city}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-addr'
                                        name='province'
                                        type='province'
                                        placeholder='Province'
                                        onChange={onChange}
                                        value={province}
                                />
                        </div>
                        <div>
                                <input
                                        className='login-input register-phone'
                                        name='phoneNum'
                                        type='tel'
                                        placeholder='Phone Number'
                                        onChange={onChange}
                                        value={phoneNum}
                                />
                        </div>
                        <div className='opt-prop'>
                                <p className='subtitle-prop'>Country:</p>
                                <Select
                                        name='country'
                                        className='select'
                                        placeholder='Select...'
                                        options={countryOpt}
                                        onChange={handleSelectChange('country')}
                                        value={{
                                                value: country,
                                                label: country
                                        }}
                                />
                        </div>
                        <div style={{ marginBottom: 10 + 'px' }}></div>
                </div>
        );
};

export default GuestInput;
