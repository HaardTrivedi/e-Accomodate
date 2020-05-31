import React, { useState, useEffect, useContext } from 'react';
import TabControl from '../ReactTab/ReactTab';
import UserContext from '../../UserContext';
import ProfileSide from './ProfileSide';
import PropertyMap from '../Property/PropertyList/PropertyMap';
import AgreementLibrary from '../RentalAgreement/AgreementList/AgreementLibrary';
import AccountsList from '../Account/AccountList'
import ReviewList from '../Review/ReviewList/ReviewList';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import LoadSpinner from '../LoadingScreen/LoadSpinner';
import './ProfilePage.css';

const ProfilePage = () => {
        const { user } = useContext(UserContext);
        const pID = user ? user.pID : null;
        const guestID = user ? user.guestID : null;
        const hostID = user ? user.hostID : null;
        const employeeID = user ? user.employeeID : null;
        const [personInfo, setPersonInfo] = useState({
                pid: null,
                firstname: '',
                midname: '',
                lastname: '',
                housenum: '',
                street: '',
                province: '',
                country: '',
                email: '',
                phonenum: '',
                created: new Date()
        });
        const [oldUserInfo, setOldUserInfo] = useState(personInfo);
        const [reviews, setReviews] = useState([]);
        const [hostProperty, setHostProperty] = useState([]);
        const [branchProperty, setBranchProperty] = useState([]);
        const [edit, setEdit] = useState(true);
        const [loading, setLoading] = useState(false);
        const [loadAction, setLoadAction] = useState(false);
        const [hostRentalList, setHostRental] = useState([]);
        const [guestRentalList, setGuestRental] = useState([]);
        const [branchAccount, setBranchAccount] = useState([]);

        useEffect(() => {
                const abordController = new AbortController();
                const signal = abordController.signal;
                const fetchData = async () => {
                        setLoading(true);
                        try {
                                const getPersonInfo = await fetch(
                                        `http://localhost:8080/api/profile/${pID}`,
                                        { signal: signal }
                                );
                                if (!getPersonInfo.ok) {
                                        throw Error('User Information Not Found');
                                }
                                const user = await getPersonInfo.json();
                                setPersonInfo({
                                        ...user,
                                        created: new Date(user.created)
                                });
                                setOldUserInfo({
                                        ...user,
                                        created: new Date(user.created)
                                });

                                const getGuest = await fetch(
                                        `http://localhost:8080/api/profile/review/review-list/${guestID}`
                                );
                                if (getGuest.ok) {
                                        const fetchedRevs = await getGuest.json();
                                        setReviews(fetchedRevs);
                                }

                                if (hostID) {
                                        const getHostProp = await fetch(
                                                `http://localhost:8080/api/profile/${pID}/my-property`
                                        );
                                        if (getHostProp.ok) {
                                                const getProp = await getHostProp.json();
                                                setHostProperty(getProp);
                                        }

                                        const getHost = await fetch(
                                                `http://localhost:8080/api/booking/reservation/host/${hostID}`
                                        );
                                        if (getHost.ok) {
                                                const host = await getHost.json();
                                                setHostRental(host.rental_agreement_list);
                                        }
                                }

                                if (employeeID) {
                                        const employeeProp = await fetch(`http://localhost:8080/api/employee/${employeeID}/property-list`);
                                        if (employeeProp.ok) {
                                                const getEmployeeProp = await employeeProp.json();
                                                setBranchProperty(getEmployeeProp.property_list);
                                        }

                                        const employee = await fetch(`http://localhost:8080/api/employee/${employeeID}/guest-list`);
                                        if (employee.ok) {
                                                const getEmployeeInfo = await employee.json();
                                                setBranchAccount(getEmployeeInfo.guest_list);
                                        }
                                }

                                const guestBook = await fetch(`http://localhost:8080/api/booking/reservation/guest/${guestID}`);
                                if (guestBook.ok) {
                                        const guestBooking = await guestBook.json();
                                        setGuestRental(guestBooking.rental_agreement_list);
                                }
                                setLoading(false);
                        } catch (err) {
                                console.log(err);
                                setLoading(false);
                        }
                };
                fetchData();
                return function cleanup() {
                        abordController.abort();
                };
        }, [pID, hostID, guestID, employeeID]);

        const handleTab = (data) => {
                console.log(data);
        };

        const onEditClick = () => {
                setEdit(!edit);

                if (!edit) {
                        setPersonInfo(oldUserInfo);
                }
        };

        const onSubmit = async () => {
                try {
                        if (JSON.stringify(personInfo) === JSON.stringify(oldUserInfo)) {
                                throw Error('No Changes Made');
                        }
                        setLoadAction(true);
                        if (
                                personInfo.firstname !== oldUserInfo.firstname ||
                                personInfo.midname !== oldUserInfo.midname ||
                                personInfo.lastname !== oldUserInfo.lastname
                        ) {
                                const response = await fetch(
                                        'http://localhost:8080/api/profile/update/name',
                                        {
                                                method: 'put',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                        firstname: personInfo.firstname,
                                                        lastname: personInfo.lastname,
                                                        pID: pID
                                                })
                                        }
                                );
                                if (!response.ok) {
                                        throw Error('Unable to update');
                                }
                        }

                        if (personInfo.email !== oldUserInfo.email) {
                                await updateUserInfo('email', 'email', personInfo.email, pID);
                        }
                        if (personInfo.housenum !== oldUserInfo.housenum) {
                                await updateUserInfo('address', 'houseNum', personInfo.housenum, pID);
                        }
                        if (personInfo.street !== oldUserInfo.street) {
                                await updateUserInfo('address', 'street', personInfo.street, pID);
                        }
                        if (personInfo.province !== oldUserInfo.province) {
                                await updateUserInfo('address', 'province', personInfo.province, pID);
                        }
                        if (personInfo.country !== oldUserInfo.country) {
                                await updateUserInfo('address', 'country', personInfo.country, pID);
                        }
                        if (personInfo.phonenumber !== oldUserInfo.phonenumber) {
                                await updateUserInfo('phonenum', 'phoneNum', personInfo.phonenumber, pID);
                        }
                        setLoadAction(false);
                        setOldUserInfo(personInfo);
                        setEdit(true);
                } catch (err) {
                        console.log(err);
                        onEditClick();
                        setLoadAction(false);
                }
        };

        const onUserChange = (event) => {
                const { name, value } = event.target;
                setPersonInfo({ ...personInfo, [name]: value });
        };

        return (
                <LoadingScreen loading={loading}>
                        <LoadSpinner loading={loadAction} />
                        <div className='profileContainer'>
                                <div className='profileSide'>
                                        <ProfileSide
                                                user={personInfo}
                                                onChange={onUserChange}
                                                edit={edit}
                                                setEdit={onEditClick}
                                                onSubmit={onSubmit}
                                                employeeID={user.employeeID}
                                        />
                                </div>
                                <div className='profileContent'>
                                        <div className='profileHeader'>
                                                <div className='headerContent'>
                                                        <h2>{`Hello ${personInfo.firstname}!`}</h2>
                                                </div>
                                        </div>
                                        <div className='profileMain'>
                                                <TabControl setTab={handleTab}>
                                                        <div name='My Reviews'>
                                                                <div className='lineMargin'>
                                                                        <div className='lml'></div>
                                                                </div>
                                                                <ReviewList reviews={reviews} />
                                                        </div>
                                                        <div name='Bookings'>
                                                                <AgreementLibrary
                                                                        hostID={hostID}
                                                                        hostRentalList={hostRentalList}
                                                                        guestRentalList={guestRentalList}
                                                                        setLoading={setLoadAction}
                                                                />
                                                        </div>
                                                        <div
                                                                name='Host Properties'
                                                                style={{
                                                                        display: hostID
                                                                                ? ''
                                                                                : 'none'
                                                                }}>
                                                                <div className='lineMargin'>
                                                                        <div className='lml'></div>
                                                                </div>
                                                                <PropertyMap properties={hostProperty} />
                                                        </div>
                                                        <div
                                                                name='Branch Properties'
                                                                style={{
                                                                        display: employeeID
                                                                                ? ''
                                                                                : 'none'
                                                                }}>
                                                                <div className='lineMargin'>
                                                                        <div className='lml'></div>
                                                                </div>
                                                                <PropertyMap properties={branchProperty} />
                                                        </div>
                                                        <div
                                                                name='Branch Accounts'
                                                                style={{
                                                                        display: employeeID
                                                                                ? ''
                                                                                : 'none'
                                                                }}>
                                                                <div className='lineMargin'>
                                                                        <div className='lml'></div>
                                                                </div>
                                                                <AccountsList accounts={branchAccount} />
                                                        </div>
                                                </TabControl>
                                        </div>
                                </div>
                        </div>
                </LoadingScreen>
        );
};

const updateUserInfo = async (name, spec, value, pID) => {
        const response = await fetch(
                `http://localhost:8080/api/profile/update/${name}`,
                {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ [spec]: value, pID: pID })
                }
        );

        if (response.ok) {
                return;
        }
        throw Error('Unable to update');
};

export default ProfilePage;
