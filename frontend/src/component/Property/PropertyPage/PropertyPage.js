import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import UserContext from '../../../UserContext';
import ReviewHeader from '../../Review/ReviewList/ReviewHeader';
import ReviewList from '../../Review/ReviewList/ReviewList';
import ReviewWrite from '../../Review/ReviewWrite/ReviewWrite';
import Booking from '../../Booking/Booking';
import AvailableDates from './AvailableDates';
import LoadingScreen from '../../LoadingScreen/LoadingScreen';
import LoadSpinner from '../../LoadingScreen/LoadSpinner';
import './PropertyPage.css';

const PropertyPage = (props) => {
        const { propertyid } = useParams();
        const { user } = useContext(UserContext);
        const guestID = user ? user.guestID : null;
        const [property, setProperty] = useState({
                location: '',
                bedrooms: 0,
                bathrooms: 0,
                hostName: ''
        });

        const [price, setPrice] = useState({
                price: 0,
                accomodates: 0
        });

        const [unavailDate, setUnavailableDates] = useState([]);

        const [review, setReview] = useState({
                reviews: []
        });

        const [averages, setAverages] = useState({
                rating: 0,
                communication: 0,
                cleanliness: 0,
                value: 0
        });

        const [loading, setLoading] = useState(true);
        const [loadingAction, setLoadingAction] = useState(false);

        useEffect(() => {
                const abordController = new AbortController();
                const signal = abordController.signal;
                const fetchData = async () => {
                        try {
                                const propID = props.match.params.propertyid;
                                const response = await fetch(
                                        `http://localhost:8080/api/property/${propID}`,
                                        { signal: signal }
                                );
                                if (response.ok) {
                                        const {
                                                address,
                                                bedrooms,
                                                bathrooms,
                                                accomodates,
                                                amount,
                                                reviews,
                                                avgs,
                                                unavailDate,
                                                hostName
                                        } = await response.json();

                                        setProperty({
                                                location: address,
                                                bedrooms: bedrooms,
                                                bathrooms: bathrooms,
                                                hostName: hostName
                                        });
                                        setPrice({
                                                price: amount,
                                                accomodates: accomodates
                                        });
                                        if (unavailDate) {
                                                setUnavailableDates(unavailDate);
                                        }
                                        setReview({ reviews: reviews });
                                        if (avgs) {
                                                setAverages({
                                                        rating: avgs.rating,
                                                        communication: avgs.communication,
                                                        cleanliness: avgs.cleanliness,
                                                        value: avgs.value
                                                });
                                        }
                                        setLoading(false);
                                        return;
                                }
                                throw Error('Unable to get property');
                        } catch (err) {
                                console.log(err);
                        }
                };

                fetchData();
                return function cleanup() {
                        abordController.abort();
                };
        }, [props.match.params.propertyid]);

        return (
                <LoadingScreen loading={loading}>
                        <LoadSpinner loading={loadingAction} />
                        <div className='propertyPage'>
                                <div className='propertyContent'>
                                        <div className='propertyHeader'>
                                                <div className='name-location'>
                                                        <p className='location'>{property.location}</p>
                                                </div>
                                        </div>
                                        <div className='propertyHeader'>
                                                <div className='name-location'>
                                                        <p className='name'>Host: {property.hostName}</p>
                                                </div>
                                        </div>
                                        <div className='roomContainer'>
                                                <p>{`${price.accomodates} Guest Accomodation `}</p>
                                                <span className='dot'></span><span>|</span><span className='dot'></span>
                                                <p>{` ${property.bedrooms} Bedrooms `}</p>
                                                <span className='dot'></span><span>|</span><span className='dot'></span>
                                                <p>{` ${property.bathrooms} Bathrooms`}</p>
                                        </div>

                                        <div className='rcl'>
                                                <div className='lineMargin'>
                                                        <div className='lml'></div>
                                                </div>
                                        </div>
                                        <div>
                                                <AvailableDates unavailDate={unavailDate} />
                                        </div>
                                        <div className='lineMargin'>
                                                <div className='lml'></div>
                                        </div>
                                        <div>
                                                <ReviewHeader
                                                        rating={averages.rating}
                                                        communication={parseFloat(averages.communication)}
                                                        cleanliness={parseFloat(averages.cleanliness)}
                                                        value={parseFloat(averages.value)}
                                                        length={review.reviews.length}
                                                />
                                                <ReviewList reviews={review.reviews} />
                                        </div>
                                        <div>
                                                <ReviewWrite propertyID={propertyid} guestID={guestID} setLoading={setLoadingAction} />
                                        </div>
                                </div>

                                <div className='bookingDiv'>
                                        <div>
                                                <div
                                                        style={{
                                                                marginTop:
                                                                        '32px',
                                                                marginBottom:
                                                                        '24px'
                                                        }}>
                                                        <div className='innerBooking'>
                                                                <Booking
                                                                        amount={price.price}
                                                                        propertyID={propertyid}
                                                                        guestID={guestID}
                                                                        rating={averages.rating}
                                                                        length={review.reviews.length}
                                                                        numRev={review.reviews.length}
                                                                        unavailDate={unavailDate}
                                                                        setLoading={setLoadingAction}
                                                                />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </LoadingScreen>
        );
};

export default PropertyPage;
