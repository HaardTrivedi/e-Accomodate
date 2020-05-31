import React from 'react';
import AgreementItem from '../AgreementItem/AgreementItem';

const AgreementList = ({ isHost, agreements, setLoading }) => {
        return (
                <div className='agreementList'>
                        <div className='agreementContainer'>
                                {agreements.map((agreement, i) => {
                                        return <AgreementItem 
                                                        key={i} 
                                                        id={i} 
                                                        isHost={isHost} 
                                                        agreement={agreement}
                                                        setLoading = {setLoading}
                                                />;
                                })}
                        </div>
                </div>
        );
};

export default AgreementList;