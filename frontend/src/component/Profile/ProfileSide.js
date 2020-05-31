import React, { useState } from 'react';

const ProfileSide = ({ user, onChange, edit, onSubmit, setEdit, employeeID }) => {
        // eslint-disable-next-line
        const [isEmployee, setIsEmployee] = useState((employeeID !== null) ? true : false);
        const [InputStyle, setInputStyle] = useState('profileInput');

        const onEditClick = () => {
                setEdit();
                if (edit) {
                        setInputStyle('');
                } else {
                        setInputStyle('profileInput');
                }
        };

        const onSubmitClick = () => {
                onSubmit();
                if (edit) {
                        setInputStyle('');
                } else {
                        setInputStyle('profileInput');
                }
        };

        return (
                <div className='sideContainer'>
                        <div className='sideContent'>
                                <h3>Profile</h3>
                                <div>
                                        <input
                                                style={{ width: '100%' }}
                                                className={InputStyle}
                                                readOnly={edit}
                                                type='text'
                                                name='firstname'
                                                value={user.firstname}
                                                onChange={onChange}
                                        />
                                        <input
                                                style={{ width: '100%' }}
                                                className={InputStyle}
                                                readOnly={edit}
                                                type='text'
                                                name='midname'
                                                value={user.midname}
                                                onChange={onChange}
                                        />
                                        <input
                                                style={{ width: '100%' }}
                                                className={InputStyle}
                                                readOnly={edit}
                                                type='text'
                                                name='lastname'
                                                value={user.lastname}
                                                onChange={onChange}
                                        />
                                        <input
                                                style={{ width: '100%' }}
                                                className={InputStyle}
                                                readOnly={edit}
                                                type='text'
                                                name='email'
                                                value={user.email}
                                                onChange={onChange}
                                        />
                                        <div>
                                                <input
                                                        style={{ width: '100%' }}
                                                        className={InputStyle}
                                                        readOnly={edit}
                                                        type='text'
                                                        name='housenum'
                                                        value={user.housenum}
                                                        onChange={onChange}
                                                />
                                                <input
                                                        style={{ width: '100%' }}
                                                        className={InputStyle}
                                                        readOnly={edit}
                                                        type='text'
                                                        name='street'
                                                        value={user.street}
                                                        onChange={onChange}
                                                />
                                                <input
                                                        style={{ width: '100%' }}
                                                        className={InputStyle}
                                                        readOnly={edit}
                                                        type='text'
                                                        name='city'
                                                        value={user.city}
                                                        onChange={onChange}
                                                />
                                                <input
                                                        style={{ width: '100%' }}
                                                        className={InputStyle}
                                                        readOnly={edit}
                                                        type='text'
                                                        name='province'
                                                        value={user.province}
                                                        onChange={onChange}
                                                />
                                                <input
                                                        style={{ width: '100%' }}
                                                        className={InputStyle}
                                                        readOnly={edit}
                                                        type='text'
                                                        name='country'
                                                        value={user.country}
                                                        onChange={onChange}
                                                />
                                        </div>
                                        <input
                                                style={{ width: '100%' }}
                                                className={InputStyle}
                                                readOnly={edit}
                                                type='text'
                                                name='phonenumber'
                                                value={user.phonenumber}
                                                onChange={onChange}
                                        />
                                        {isEmployee ?
                                                (<div>
                                                        <input
                                                                style={{ width: '100%' }}
                                                                className={InputStyle}
                                                                readOnly={true}
                                                                type='text'
                                                                name='emplyeeID'
                                                                value={'Employee ID: ' + employeeID}
                                                        />
                                                </div>) : null}
                                </div>

                                <div className='lineMargin'>
                                        <div className='lml'></div>
                                </div>
                                <div>
                                        <div className='edit-container'>
                                                <p
                                                        type='submit'
                                                        name='edit'
                                                        className='editButton'
                                                        onClick={onEditClick}>
                                                        Edit
                                                </p>
                                        </div>

                                        {!edit ? (
                                                <div className='submit-container'>
                                                        <button
                                                                type='submit'
                                                                name='submit'
                                                                className='submitButton'
                                                                onClick={onSubmitClick}>
                                                                Submit
                                                        </button>
                                                </div>
                                        ) : null}
                                </div>
                        </div>
                </div>
        );
};

export default ProfileSide;
