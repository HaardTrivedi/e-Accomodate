import React from 'react';
import './AccountItem.css';

const AccountItem = ({ account }) => {
        let { pid, firstname, midname, lastname, housenum, street, province, email, phonenumber, country } = account;

        return (
                <div className='account' style={{ textAlign: 'left' }}>
                        <div>
                                <h4> {`${firstname} ${midname} ${lastname}`} </h4>
                                <p> {`${email}`} </p>
                                <p> {`${housenum}    ${street}`} </p>
                                <p> {`${province}, ${country}`} </p>
                                <p> {`${phonenumber}`} </p>
                                <p> User ID: {`${pid}`} </p>
                        </div>
                        <div className='lineMargin'>
                                <div className='lml'></div>
                        </div>
                </div>
        );
};

export default AccountItem;
