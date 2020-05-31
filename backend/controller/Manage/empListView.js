// GET: /api/employee/:employeeid/property-list
const handleEmpPropertyList = async (req, res, db_pool) => {
    const { employeeid } = req.params;
    console.log();
    try {
        const client = await db_pool.connect();
        try {
            const getEmployeeCountry = 'SELECT country FROM eaccomodate.Person NATURAL JOIN eaccomodate.Employee WHERE pID = $1;';
            const res1 = await client.query(getEmployeeCountry, [employeeid]);
            const country = res1.rows[0]['country'];

            const getProperty = 'SELECT * FROM eaccomodate.Property WHERE country = $1;';
            const res2 = await client.query(getProperty, [country]);

            const getPrice = 'SELECT amount FROM eaccomodate.Price WHERE priceID = $1;';
            for (i in res2.rows) {
                const priceID = res2.rows[i]['priceid'];
                const res3 = await client.query(getPrice, [priceID])
                const amount = res3.rows[0]['amount'];
                res2.rows[i].amount = amount;
            }
            const getAvgRating = "SELECT AVG(rating) AS rating FROM eaccomodate.Review NATURAL JOIN eaccomodate.Property WHERE propertyID = $1 GROUP BY reviewID;";
            for (i in res2.rows) {
                const propertyID = res2.rows[i]['propertyid'];
                const res4 = await client.query(getAvgRating, [propertyID]);
                if (res4.rows.length != 0) {
                    const rating = res4.rows[0]['rating'];
                    res2.rows[i].rating = rating;
                }
            }
            const getReviewNum = "SELECT COUNT(rating) AS reviewNum FROM eaccomodate.Review WHERE propertyID = $1 GROUP BY reviewID;";
            for (i in res2.rows) {
                const propertyID = res2.rows[i]['propertyid'];
                const res5 = await client.query(getReviewNum, [propertyID])
                if (res5.rows.length != 0) {
                    const { reviewnum } = res5.rows[0];
                    res2.rows[i].reviewnum = reviewnum;
                }
            }
            res.status(200).jsonp({
                property_list: res2.rows
            })
        } catch (err) {
            console.error('Query Execution Error', err.stack);
            res.status(400).json('Unable to get the property list.');
        } finally {
            client.release()
        }
    } catch (err) {
        res.status(500).json('Service Unavailable');
        console.error(
            'Database Connection Error',
            err.stack
        );
    }
}

// GET: /api/employee/:employeeid/guest-list
const handleGuestList = async (req, res, db_pool) => {
    const { employeeid } = req.params;
    try {
        const client = await db_pool.connect();
        try {
            const getEmployeeCountry = 'SELECT country FROM eaccomodate.Employee NATURAL JOIN eaccomodate.Branch WHERE employeeID = $1';
            const res1 = await client.query(getEmployeeCountry, [employeeid]);
            const country = res1.rows[0]['country'];
            const getGuests = 'SELECT * FROM eaccomodate.Guest NATURAL JOIN eaccomodate.Person WHERE country = $1 ORDER BY guestID;';
            const res2 = await client.query(getGuests, [country]);
            res.status(200).jsonp({
                guest_list: res2.rows
            });
        } catch (err) {
            console.error('Query Execution Error', err.stack);
            res.status(400).json('Invalid Inputs.');
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(503).json('Service Unavailable');
        console.error(
            'Database Connection Error',
            err.stack
        );
    }
}

module.exports = { handleEmpPropertyList, handleGuestList }