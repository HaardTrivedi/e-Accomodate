import React from 'react';
import { renderStarRating } from '../ReviewWrite/ReviewWrite';
import StarRatingComponent from 'react-star-rating-component';

const ReviewHeader = ({
        rating,
        communication,
        cleanliness,
        value,
        length
}) => {
        return (
                <div className='reviewHeader'>
                        <h2>Reviews</h2>
                        {ReviewStats(rating, length)}
                        <div className='averages'>
                                {communication
                                        ? renderStarRating(
                                                  communication,
                                                  'communication',
                                                  false,
                                                  null
                                          )
                                        : null}
                                {cleanliness
                                        ? renderStarRating(
                                                  cleanliness,
                                                  'cleanliness',
                                                  false,
                                                  null
                                          )
                                        : null}
                                {value
                                        ? renderStarRating(
                                                  value,
                                                  'value',
                                                  false,
                                                  null
                                          )
                                        : null}
                        </div>

                        <div className='lineMargin'>
                                <div className='lml'></div>
                        </div>
                </div>
        );
};

const ReviewStats = (rating, length) => {
        return (
                <div className='reviewRating'>
                        <div className='reviewRating'>
                                <StarRatingComponent
                                        name='displayStar'
                                        editing={false}
                                        starCount={1}
                                        starColor={'#00A699'}
                                        value={1}
                                />
                                <h3 className='big-rating'>
                                        {rating.toFixed(2)}
                                </h3>
                        </div>
                        <div className='rhi'>{`(${length} reviews)`}</div>
                </div>
        );
};

export default ReviewHeader;
export { ReviewStats };
