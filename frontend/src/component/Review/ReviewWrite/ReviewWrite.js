import React, { useState } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import './ReviewWrite.css';

const ReviewWrite = ({ propertyID, guestID, setLoading }) => {
        const [communication, setCommunication] = useState(5);
        const [cleanliness, setCleanliness] = useState(5);
        const [value, setValue] = useState(5);
        const [comment, setComment] = useState('');

        const onChange = (e) => {
                setComment(e.target.value);
        };

        const onSubmitReview = async () => {
                if (comment.length > 0) {
                        if (setLoading) {
                                setLoading(true);
                        }
                        try {
                                const response = await fetch(
                                        'http://localhost:8080/api/review/add-review',
                                        {
                                                method: 'post',
                                                headers: {
                                                        'Content-Type':
                                                                'application/json'
                                                },
                                                body: JSON.stringify({
                                                        communication: communication,
                                                        cleanliness: cleanliness,
                                                        value: value,
                                                        comment: comment,
                                                        propertyID: propertyID,
                                                        guestID: guestID
                                                })
                                        }
                                );

                                if (response.ok) {
                                        if (setLoading) {
                                                setLoading(false);
                                        }
                                        return;
                                }

                                throw Error('Unable to add review');
                        } catch (err) {
                                console.log(err);
                                if (setLoading) {
                                        setLoading(false);
                                }
                        }
                }
        };

        const onStarClick = (nextValue, prevValue, name) => {
                if (name === 'communication') {
                        setCommunication(nextValue);
                } else if (name === 'cleanliness') {
                        setCleanliness(nextValue);
                } else if (name === 'value') {
                        setValue(nextValue);
                }
        };

        return (
                <div>
                        <h2>Write Review</h2>
                        <div className='set-rating-contianer'>
                                <div className='ratingContainer'>
                                        {renderStarRating(
                                                communication,
                                                'communication',
                                                true,
                                                onStarClick
                                        )}

                                        {renderStarRating(
                                                cleanliness,
                                                'cleanliness',
                                                true,
                                                onStarClick
                                        )}
                                        {renderStarRating(
                                                value,
                                                'value',
                                                true,
                                                onStarClick
                                        )}
                                </div>

                                <div className='commentContainer'>
                                        <textarea
                                                className='writeComment'
                                                name='comment'
                                                value={comment}
                                                placeholder='Comment'
                                                maxLength={140}
                                                onChange={onChange}
                                        />
                                </div>
                        </div>
                        <div className='reviewSubmitContainer'>
                                <button
                                        className='submitButton'
                                        onClick={onSubmitReview}
                                        type='submit'>
                                        Post
                                </button>
                        </div>
                </div>
        );
};

const renderStarRating = (rating, name, edit, onStarClick) => {
        const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return (
                <div className='ratingComponent'>
                        <div className='review-header'>
                                <p>{nameCapitalized}</p>
                        </div>
                        <div className='reviewRating'>
                                <StarRatingComponent
                                        name={name}
                                        starCount={5}
                                        edit={edit}
                                        starColor={'#00A699'}
                                        value={rating}
                                        onStarClick={onStarClick}
                                />
                                <div className='rating'>
                                        <p>{rating.toFixed(2)}</p>
                                </div>
                        </div>
                </div>
        );
};

export default ReviewWrite;
export { renderStarRating };
