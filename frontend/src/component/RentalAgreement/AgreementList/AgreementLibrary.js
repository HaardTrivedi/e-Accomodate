import React from 'react';
import AgreementList from './AgreementList';

const AgreementLibrary = ({
        hostID,
        hostRentalList,
        guestRentalList,
        setLoading
}) => {
        const isHost = hostID === null ? false : true;
        return (
                <div>
                        <div className='lineMargin'>
                                <div className='lml'></div>
                        </div>
                        {isHost ?
                                <div>
                                {hostRentalList.length === 0 ?
                                        (<div>
                                                <div className='lineMargin'>
                                                        <div className='lml'></div>
                                                </div>
                                        </div>)
                                        :
                                        (<div>
                                                <h3>Pending Approvals</h3>
                                                <div className='lineMargin'>
                                                        <div className='lml'></div>
                                                </div>
                                                <AgreementList 
                                                        isHost={true} 
                                                        agreements={hostRentalList}
                                                        setLoading = {setLoading}
                                                />
                                        </div>)}
                                </div> : null
                        }
                                <div>
                                        {guestRentalList.length === 0 ?
                                        (<div></div>)
                                        :
                                        (<div>
                                                <div className='lineMargin'>
                                                        <div className='lml'></div>
                                                </div>
                                                <h2>Pending Bookings</h2>
                                                <div className='lineMargin'>
                                                        <div className='lml'></div>
                                                </div>
                                                <AgreementList
                                                        isHost={false} 
                                                        agreements={guestRentalList}
                                                        setLoading = {setLoading}
                                                />
                                        </div>)}
                                </div>
                </div>
        );
};

export default AgreementLibrary;
