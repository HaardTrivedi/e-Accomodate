import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import './ReviewItem.css';

const ReviewItem = ({ review }) => {
        const { rating, comment, firstname, lastname } = review;
        const name = firstname + ' ' + lastname;
        return (
                <div className='review'>
                        <h4>{name}</h4>
                        <div
                                style={{ fontSize: '15px' }}
                                className='reviewRating'>
                                <StarRatingComponent
                                        name='reviewRating'
                                        editing={false}
                                        starCount={5}
                                        starColor={'#00A699'}
                                        value={rating}
                                />
                                <div className='rating'>
                                        <p>{rating.toFixed(2)}</p>
                                </div>
                        </div>
                        <p className='comment'>{comment}</p>

                        <div className='lineMargin'>
                                <div className='lml'></div>
                        </div>
                </div>
        );
};

export default ReviewItem;
