// GET:  /api/property/property-list/:category/:num
const handlePropertyList = async (req, res, db_pool, Joi) => {
        const request = {
                category: req.params.category,
                num: req.params.num || 0
        };
        const schema = {
                category: Joi.string()
                        .max(15)
                        .valid(['house', 'apartment', 'cabin', 'bed_breakfast', 'cottage'])
                        .required(),
                num: Joi.number()
                        .integer()
                        .min(0)
        };
        const { error } = Joi.validate(request, schema);
        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }

        const { category, num } = request;
        try {
                const client = await db_pool.connect();
                try {
                        const getProperties =
                                'SELECT Property.propertyID, Property.country, Property.houseNum, Property.street, Price.amount, Review.rating, Review.reviewNum FROM(eaccomodate.Property AS Property NATURAL JOIN eaccomodate.Price AS Price) NATURAL LEFT OUTER JOIN (SELECT propertyID, AVG(rating) AS rating, COUNT(eaccomodate.Review.rating) AS reviewNum FROM eaccomodate.Review GROUP BY propertyID) AS Review WHERE propType = $1';
                        const { rows } = await client.query(getProperties, [category]);
                        const length = rows.length;
                        if (length === 0) {
                                res.status(400).json([]);
                                return;
                        }
                        const sliceEnd = num > 0 ? num : length + 1;
                        res.status(200).json(rows.slice(Math.max(length - sliceEnd, 0)).reverse());
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        res.status(400).json([]);
                } finally {
                        client.release();
                }
        } catch (err) {
                res.status(500).json([]);
                console.error(
                        'Database Connection Error',
                        err.stack
                );
        }
};

module.exports = { handlePropertyList };
