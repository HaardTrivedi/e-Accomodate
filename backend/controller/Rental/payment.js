// POST: /api/booking/reservation/guest/:guestid/payment
const handlePayment = async (req, res, db_pool, Joi) => {
    const schema = {
        propertyID: Joi.number()
            .integer()
            .required(),
        bookingID: Joi.number()
            .integer()
            .required(),
        paymentType: Joi.string()
            .valid([
                'credit_card',
                'direct_debit',
                'cash',
                'check'
            ])
            .required(),
        cardNum: Joi.string()
            .min(16)
            .max(16)
            .regex(/^\d*$/)
    };
    const { error } = Joi.validate(req.body, schema);
    if (error) {
        res.status(400).json(error.details[0].message);
        return;
    }
    const { propertyID, bookingID, paymentType, cardNum } = req.body;

    try {
        const client = await db_pool.connect();
        try {
            const rentalAgreementQueryText = 'SELECT paymentStatus FROM eaccomodate.Payment NATURAL JOIN eaccomodate.Booking WHERE bookingID = $1 AND propertyID=$2;';
            const { rows } = await client.query(rentalAgreementQueryText, [bookingID, propertyID]);
            const paymentStatus = rows[0]['paymentstatus'];
            if (paymentStatus != 'approved') {
                res.status(400).json('The rental agreement is not approved by the host yet.');
                await client.release();
                return;
            } else {
                const getPayment = 'SELECT paymentID FROM eaccomodate.Payment NATURAL JOIN eaccomodate.Booking WHERE bookingID = $1 AND propertyID=$2;';
                const { rows } = await client.query(getPayment, [bookingID, propertyID]);
                const paymentID = rows[0]['paymentid'];
                const PaymentQueryText = 'UPDATE eaccomodate.Payment SET paymentType = $1, paymentStatus = $2 WHERE paymentID = $3;';
                await client.query(PaymentQueryText, [paymentType, 'completed', paymentID])
                res.status(200).json('Payment is completed')
            }
        } catch (err) {
            console.error('Error during the payment.', err.stack);
            res.status(400).json('Unable to pay the rental agreement.');
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

module.exports = { handlePayment }