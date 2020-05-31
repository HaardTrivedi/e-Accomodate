import React from 'react';
import Select from 'react-select';
import './EmployeeInput.css';

const locationOptions = [
        { value: 'manager', label: 'Manager' },
        { value: 'employee', label: 'Employee' }
];

const EmployeeInput = ({ onChange }) => {
        const handleSelectChange = (name) => {
                return (newValue) => {
                        onChange(name, newValue.value);
                };
        };

        const handleChange = (event) => {
                const { name, value } = event.target;
                onChange(name, value);
        };
        return (
                <div>
                        <div>
                                <p className='register-title'>
                                        Employee Information
                                </p>
                        </div>
                        <div style={{ marginBottom: 10 + 'px' }}></div>
                        <div className='opt-prop'>
                                <p className='subtitle-prop'>Employee Type</p>
                                <Select
                                        name='employeeType'
                                        className='select'
                                        placeholder='Select'
                                        options={locationOptions}
                                        onChange={handleSelectChange(
                                                'employeeType'
                                        )}
                                />
                        </div>
                        <div>
                                <p className='subtitle-prop' style={{ marginTop: 12 + 'px' }}>Position</p>
                                <input
                                        className='login-input register-salary'
                                        name='position'
                                        placeholder='Position'
                                        onChange={handleChange}
                                />
                        </div>
                        <div>
                                <p
                                        className='subtitle-prop'
                                        style={{ marginTop: 12 + 'px' }}>
                                        Salary
                                </p>
                                <input
                                        className='login-input register-salary'
                                        name='salary'
                                        type='number'
                                        placeholder='$'
                                        onChange={handleChange}
                                />
                        </div>
                        <div style={{ marginBottom: 115 + 'px' }}></div>
                </div>
        );
};

export default EmployeeInput;
