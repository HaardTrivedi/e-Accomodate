import React from 'react';
import AccountItem from './AccountItem.js';

const AccountList = ({ accounts, setLoading }) => {
        return (
                <div className='accountList'>
                        <div className='accountContainer'>
                                {accounts.map((account, i) => {
                                        return <AccountItem 
                                                        key={i} 
                                                        id={i} 
                                                        account={account}
                                                        setLoading = {setLoading}
                                                />;
                                })}
                        </div>
                </div>
        );
};

export default AccountList;