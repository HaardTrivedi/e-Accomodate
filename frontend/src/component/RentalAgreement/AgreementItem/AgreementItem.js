import React, { useState } from 'react';
import Select from 'react-select';
import './AgreementItem.css';

const AgreementItem = ({ isHost, agreement, setLoading }) => {
        const {
                bookingid,
                guestid,
                hostid,
                signing,
                datefrom,
                dateto,
                datesign,
                paymentstatus,
                propertyid
        } = agreement;
        const [error, setError] = useState(false);
        // eslint-disable-next-line
        const [signed, setSigned] = useState(paymentstatus !== 'pending' ? true : false);
        // eslint-disable-next-line
        const [paid, setPayment] = useState(signing === 'completed' ? true : false);
        const [cardNum, setCardNum] = useState('');
        const [paymentType, setCardType] = useState('');

        const handleCardNumChange = (event) => {
                setCardNum(event.target.value);
        };

        const handleSelectCardTypeChange = () => {
                return (newValue) => {
                        setCardType(newValue.value);
                };
        };

        const paymentOptions = [
                { value: 'direct_debit', label: 'Direct Debit' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'check', label: 'Check' },
                { value: 'cash', label: 'Cash' }
        ];


        const onApproveClicked = async (approval) => {
                try {
                        setLoading(true);
                        const response = await fetch(
                                `http://localhost:8080/api/booking/reservation/host/${hostid}`,
                                {
                                        method: 'post',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                                bookingID: bookingid,
                                                status: approval
                                        })
                                }
                        );
                        setSigned(true);
                        setLoading(false);
                        window.location.reload();
                        if (!response.ok) {
                                throw Error('Unable to approve');
                        }
                } catch (err) {
                        setLoading(false);
                        console.log(err);
                        throw Error(err);
                }
        };

        const onPayClicked = async () => {
                try {
                        setLoading(true);
                        let finCardNum = cardNum;
                        if (paymentType === 'credit_card' || paymentType === 'direct_debit') {
                                setLoading(false);
                                if (cardNum === null || cardNum === '') {
                                        setLoading(false);
                                        setError(true);
                                        return;
                                } else if (cardNum.length < 16) {
                                        setLoading(false);
                                        setError(true);
                                        return;
                                }
                        } else if (paymentType === null || paymentType === '') {
                                setLoading(false);
                                setError(true);
                                return;
                        } else if ((paymentType === 'check' || paymentType === 'cash')) {
                                finCardNum = '000000000000';
                        }
                        const response = await fetch(
                                `http://localhost:8080/api/booking/reservation/guest/${guestid}/payment`,
                                {
                                        method: 'post',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                                propertyID: propertyid,
                                                bookingID: bookingid,
                                                paymentType: paymentType,
                                                cardNum: finCardNum
                                        })
                                }
                        );
                        setPayment(true);
                        setLoading(false);
                        if (!response.ok) {
                                setError(true);
                                throw Error('Unable to pay');
                        }
                        window.location.reload();
                } catch (err) {
                        setLoading(false);
                        console.log(err);
                        throw Error('Unable to process payment')
                }
        };

        const ErrorMessage = error ? (
                <div className='error-message'>Please Enter Banking Details Properly</div>
        ) : null;

        return (
                <div className='agreement-tag'>
                        <div>
                                {paymentstatus === 'approved' ? (
                                        <p className='agreement-sign'
                                                style={{
                                                        color: 'green',
                                                        float: 'right'
                                                }}> Approved  </p>
                                ) : paymentstatus === 'pending' ? (
                                        <p className='agreement-sign'
                                                style={{
                                                        color: 'rgb(255, 174, 66)',
                                                        float: 'right'
                                                }}>  Pending  </p>
                                ) : (
                                                        <p
                                                                className='agreement-sign'
                                                                style={{
                                                                        color: 'black',
                                                                        float: 'right'
                                                                }}>
                                                                Completed
                                                        </p>
                                                )}
                                {isHost ? (
                                        <div> <p className='agreement-text'>Guest | {agreement.guestname}</p> </div>
                                ) : (
                                                <div> <p className='agreement-text'>  Host | {agreement.hostname} </p> </div>
                                        )}
                                <p className='agreement-text'>
                                        {datefrom.split('T')[0]} | {dateto.split('T')[0]}
                                </p>
                                {paymentstatus === 'completed' ? (
                                        <div><p className='agreement-text'>{'Payment Complete'}</p></div>
                                ) : (
                                                <p
                                                        className='agreement-text'
                                                        style={{
                                                                color: 'brown',
                                                                fontWeight: 'bold'
                                                        }}>
                                                        Payment Pending
                                                </p>
                                        )}
                        </div>
                        {isHost && paymentstatus === 'pending' ? (
                                <div>
                                        <button className='submitButton approve-btn'
                                                onClick={() => onApproveClicked('approved')}>
                                                Accept
                                        </button>

                                        <button className='submitButton disapprove-btn'
                                                onClick={() => onApproveClicked('disapproved')}>
                                                Reject
                                        </button>
                                </div>
                        ) : null}
                        {!isHost && paymentstatus === 'approved' ? (
                                <div>
                                        <p className='agreement-text'>  Signed | {datesign.split('T')[0]} </p>
                                        {!isHost && paymentstatus === 'approved' ? (
                                                <div>
                                                        <input className='login-input payment-card-num'
                                                                name='cardNum'
                                                                type='text'
                                                                placeholder='Card Number (16 Digits | No Spaces)'
                                                                maxLength='16'
                                                                onChange={(e) => handleCardNumChange(e)} />
                                                        <Select
                                                                className='select select-payment-type'
                                                                placeholder='Payment Type'
                                                                options={paymentOptions}
                                                                isSearchable={false}
                                                                onChange={handleSelectCardTypeChange()}
                                                        />
                                                        <button className='submitButton payment-btn'
                                                                onClick={() => onPayClicked()}
                                                        > Pay </button>
                                                        <div style={{ marginBottom: 50 + 'px' }}></div>
                                                        <div style={{ margin: 50 + 'px' }}>{ErrorMessage}</div>
                                                </div>
                                        ) : null}
                                </div>
                        ) : null}
                        {!isHost && paymentstatus === 'disapproved' ? (
                                <p
                                        className='agreement-sign'
                                        style={{
                                                color: 'darkred',
                                                textAlign: 'center'
                                        }}>
                                        Request Rejected{' '}
                                        {datesign.split('T')[0]}
                                </p>
                        ) : null}
                        {paymentstatus === 'completed' ? (
                                <p
                                        style={{
                                                textAlign: 'center',
                                                color: 'green',
                                                fontWeight: 'bold'
                                        }}>
                                </p>
                        ) : null}

                        <div className='lineMargin'>
                                <div className='lml'></div>
                        </div>
                </div>
        );
};

export default AgreementItem;
