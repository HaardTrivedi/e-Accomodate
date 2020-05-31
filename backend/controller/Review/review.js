// POST: /api/property/add-review
const handleAddReview = async (req, res, db_pool, Joi) => {
        const schema = {
                communication: Joi.number()
                        .integer()
                        .min(1)
                        .max(5)
                        .required(),
                cleanliness: Joi.number()
                        .integer()
                        .min(1)
                        .max(5)
                        .required(),
                value: Joi.number()
                        .integer()
                        .min(1)
                        .max(5)
                        .required(),
                comment: Joi.string()
                        .max(140)
                        .required(),
                propertyID: Joi.number()
                        .integer()
                        .required(),
                guestID: Joi.number()
                        .integer()
                        .required()
        };
        const { error } = Joi.validate(req.body, schema);
        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }
        const {
                communication,
                cleanliness,
                value,
                comment,
                propertyID,
                guestID
        } = req.body;
        const rating = (communication + cleanliness + value) / 3;

        try {
                const client = await db_pool.connect();
                try {
                        const queryText =
                                "INSERT INTO eaccomodate.Review (propertyID, guestID, rating, ratingCommunication, ratingCleanliness, ratingValue, comment) VALUES ($1, $2, $3, $4, $5, $6, $7)";
                        await client.query(queryText, [
                                propertyID,
                                guestID,
                                rating,
                                communication,
                                cleanliness,
                                value,
                                comment
                        ]);

                        res.status(200).json("Review Added Successfully");
                } catch (err) {
                        console.error("Query Execution Error", err.stack);
                        res.status(400).json("Invalid Inputs.");
                } finally {
                        client.release();
                }
        } catch (err) {
                res.status(503).json("Service Unavailable");
                console.error(
                        "Database Connection Error",
                        err.stack
                );
        }
};

module.exports = {  handleAddReview};
