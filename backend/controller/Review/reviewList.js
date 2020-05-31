// GET: /api/property/reviews/:propertyid/:num
const handleReviewProperty = async (req, res, db_pool) => {
        const propertyID = req.params.propertyID;
        const num = req.params.num || 0;

        const { code, message, reviews } = await reviewList(
                'propertyID',
                propertyID,
                num,
                db_pool
        );

        if (reviews) {
                const ratingAverage =
                        reviews.reduce((prev, next) => prev + next.rating, 0) /
                        reviews.length;
                res.status(code).json({
                        rating: ratingAverage,
                        reviews: reviews
                });
        } else {
                res.status(code).json(message);
        }
};

// GET: /api/profile/reviews/:gid/:num?
const handleReviewProfile = async (req, res, db_pool) => {
        const guestID = req.params.guestid;
        const num = req.params.num || 0;

        const { code, message, reviews } = await reviewList('guestID', guestID, num, db_pool);

        if (reviews) {
                res.status(code).json(reviews);
        } else {
                res.status(code).json(message);
        }
};

const reviewList = async (column, id, num, db_pool) => {
        try {
                const client = await db_pool.connect();
                try {
                        const queryText = `SELECT Review.rating, Review.comment, Review.guestID, Person.firstName, Person.lastName FROM eaccomodate.Review AS Review, eaccomodate.Person AS Person, eaccomodate.Guest AS Guest WHERE Review.${column} = $1 AND Person.pID = Guest.pID AND Review.guestID = Guest.guestID`;
                        const { rows } = await client.query(queryText, [id]);

                        const length = rows.length;

                        if (length === 0) {
                                return {
                                        code: 400,
                                        message: 'No reviews found'
                                };
                        }

                        const sliceEnd = num > 0 ? num : length;
                        return { code: 200, reviews: rows.slice(0, sliceEnd) };
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        return {
                                code: 400,
                                message: 'Invalid Input'
                        };
                } finally {
                        client.release();
                }
        } catch (err) {
                console.error('Database Connection Error', err.stack);
                return {
                        code: 400,
                        message: 'Database Connection Error'
                };
        }
};

module.exports = { handleReviewProperty, handleReviewProfile };
