import React, { useState, useContext } from 'react';
import UserContext from '../../../UserContext';
import PropertyInput from '../PropertyInput/PropertyInput';
import LoadSpinner from '../../LoadingScreen/LoadSpinner';
import './AddPropertyPage.css';

const propertyIn = {
        propType: '',
        houseNum: '',
        street: '',
        city: '',
        province: '',
        country: '',
        roomType: '',
        accomodates: '',
        rules: '',
        availDate: '',
        amenities: ''
};

const priceIn = {
        accomodates: 0
};

const roomIn = {
        bedrooms: 0,
        bathrooms: 0
};

const AddPropertyPage = () => {
        const { user, setUser } = useContext(UserContext);
        const pID = user ? user.pID : null;
        const guestID = user ? user.guestID : null;
        const hostID = user ? user.hostID : null;
        const [propertyInput, setPropertyInput] = useState(propertyIn);
        const [accomodates, setPrice] = useState(priceIn);
        const [succ, setSucc] = useState(false);
        const [error, setError] = useState(false);
        const [hostRegistered, setHostRegistered] = useState(false);
        const [loading, setLoading] = useState(false);
        // eslint-disable-next-line
        const [rooms, setRooms] = useState(roomIn);

        const handleLoadUser = (newUser) => {
                setUser(newUser);
        };

        const propertySubmit = async () => {
                setSucc(false);
                setError(false);
                setLoading(true);
                try {
                        if (!propertyValidate(propertyInput, accomodates)) {
                                throw Error('Validation Error');
                        }
                        let totRooms = createRooms(rooms.bedrooms, rooms.bathrooms);
                        if (hostID) {
                                const response = await fetch(
                                        'http://localhost:8080/api/property/add-property',
                                        {
                                                method: 'post',
                                                headers: {
                                                        'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                        property: { ...propertyInput, hostID: hostID },
                                                        accomodates: { ...accomodates },
                                                        rooms: totRooms
                                                })
                                        }
                                );
                                if (response.ok) {
                                        setSucc(true);
                                        setError(false);
                                        setLoading(false);
                                        return;
                                }
                                throw Error('Unable to Add Property');
                        } else if (pID) {
                                const newHostID = await registerHost(
                                        propertyInput,
                                        totRooms,
                                        { ...accomodates },
                                        pID
                                );
                                const newUser = {
                                        pID: pID,
                                        guestID: guestID,
                                        hostID: newHostID.hostID
                                };
                                setHostRegistered(true);
                                setError(false);
                                setLoading(false);
                                setTimeout(() => {
                                        setHostRegistered(false);
                                        console.log('Registration as Host Complete');
                                }, 2000);
                                handleLoadUser(newUser);
                                return;
                        }
                        throw Error('Unable to Add Property');
                } catch (err) {
                        setLoading(false);
                        setSucc(false);
                        setHostRegistered(false);
                        setError(true);
                }
        };

        const onPropertyChange = (name, value) => {
                setPropertyInput({ ...propertyInput, [name]: value });
        };

        const onPriceChange = (name, value) => {
                setPrice({ ...accomodates, [name]: value });
        };

        const ErrorMessage = error ? (
                <div className='error-message'>Unable to add property.</div>
        ) : null;
        const SuccMessage = succ ? (
                <div className='succ-message'>
                        Property Addition Successful.
                </div>
        ) : null;
        const RegisterHostMessage = hostRegistered ? (
                <div className='succ-message'>
                        You have been registered as a host.
                </div>
        ) : null;

        return (
                <div>
                        <LoadSpinner loading={loading} />
                        <div className='add-prop-page'>
                                <div className='login-box add-prop-box'>
                                        <PropertyInput
                                                className='add-prop-input add-prop-host'
                                                onPropertyChange={onPropertyChange}
                                                onPriceChange={onPriceChange}
                                        />
                                        <div>
                                                <button
                                                        className='submitButton'
                                                        onClick={propertySubmit}>
                                                        Submit
                                                </button>
                                                {ErrorMessage}
                                                {SuccMessage}
                                                {RegisterHostMessage}
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

const createRooms = (bedrooms, bathrooms) => {
        let rooms = [];
        for (let i = 0; i < bedrooms; i++) {
                let tempRoom = {
                        roomType: 'bedrooms',
                        num: 1
                };
                rooms.push(tempRoom);
        }

        for (let i = 1; i < bathrooms; i++) {
                let tempRoom = {
                        roomType: 'bathrooms',
                        num: 1
                };
                rooms.push(tempRoom);
        }
        return rooms;
};

const registerHost = async (pID, property, accomodates, rooms) => {
        const response = await fetch(
                'http://localhost:8080/api/host-register',
                {
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                                pID: pID,
                                property: property,
                                accomodates: accomodates,
                                rooms: rooms
                        })
                }
        );
        if (response.ok) {
                const hostID = await response.json();
                return hostID;
        }
        throw new Error('Network response was not ok.');
};

const propertyValidate = (property, price) => {
        const { propType, houseNum, street, city, province, country } = property;
        const { accomodates } = price;

        if (propType.length === 0 || houseNum.length === 0 || street.length === 0 || city.length === 0 || province.length === 0 || country.length === 0 || accomodates === 0) {
                return false;
        }
        return true;
};

export default AddPropertyPage;
export { createRooms, registerHost, propertyValidate };
