import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyItem.css';
import StarRatingComponent from 'react-star-rating-component';

const PropertyItem = ({ property }) => {
        let { propertyid, country, amount, housenum, street, rating, reviewnum } = property;
        let propertyID = propertyid
        let houseNum = housenum;
        let reviewNum = reviewnum;
        if (rating === null) {
                rating = 0;
        }
        if (reviewNum === null || reviewNum === undefined) {
                reviewNum = 0;
        }
        if (housenum !== null && housenum !== undefined && houseNum !== '') {
                houseNum = houseNum + ' - ';
        }
        return (
                <div className='property'>
                        <Link to={`/property/${propertyID}`}>
                                <div>
                                        <h3> {houseNum} {street} </h3>
                                        <h4> {country} </h4>
                                        <p> {`$${amount}/night`}</p>

                                        <div
                                                className='reviewRating'
                                                style={{ fontFamily: 'Arial', fontSize: '15px' }}>
                                                <StarRatingComponent
                                                        name='rating'
                                                        editing={false}
                                                        starCount={5}
                                                        starColor={'darkgreen'}
                                                        value={rating}
                                                        emptyStarColor={'white'}
                                                />
                                                <div className='rating no-margin'>
                                                        <p>{`(${reviewNum})`}</p>
                                                </div>
                                        </div>
                                </div>
                        </Link>
                </div>
        );
};

export default PropertyItem;
