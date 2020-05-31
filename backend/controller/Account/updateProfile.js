// PUT: /api/profile/update/email
const handleUpdateEmail = async (req, res, db_pool, Joi) => {
        const schema = {
                email: Joi.string()
                        .email()
                        .min(3)
                        .max(256)
                        .required(),
                pID: Joi.number()
                        .min(0)
                        .required()
        };

        const { error } = Joi.validate(req.body, schema);

        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }

        const { email, pID } = req.body;

        try {
                const client = await db_pool.connect();
                try {
                        await client.query('BEGIN');
                        const userText = 'UPDATE eaccomodate.Person SET email = $1 WHERE pID = $2;';
                        await client.query(userText, [email, pID]);

                        const loginText = 'UPDATE eaccomodate.login SET email = $1 WHERE email = $1;';
                        //await client.query(loginText, [email]);
                        await client.query('COMMIT');
                        res.status(200).json('Successful registration');
                } catch (err) {
                        console.error(
                                'Error during the transaction, ROLLBACK.',
                                err.stack
                        );
                        await client.query('ROLLBACK');
                        res.status(400).json('Error during the update.');
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
};

// PUT: /api/profile/profile/name
const handleUpdateName = async (req, res, db_pool, Joi) => {
        const schema = {
                firstName: Joi.string()
                        .max(35)
                        .required(),
                midName: Joi.string().max(35),
                lastName: Joi.string()
                        .max(35)
                        .required(),
                pID: Joi.number().required()
        };

        const { error } = Joi.validate(req.body, schema);

        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }

        const { firstName, midName, lastName, pID } = req.body;

        try {
                const client = await db_pool.connect();
                try {
                        const queryText =
                                'UPDATE eaccomodate.Person SET firstName = $1, midName = $2, lastName = $3 WHERE pID = $4';
                        await client.query(queryText, [firstName, midName, lastName, pID]);
                        res.status(200).json('Updated passwrod');
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        res.status(400).json('Invalid Inputs.');
                } finally {
                        client.release();
                }
        } catch (err) {
                res.status(503).json('Service Unavailable');
                console.error('Database Connection Error', err.stack);
        }
};

// PUT: /api/profile/update/address
const handleUpdateAddress = async (req, res, db_pool, Joi) => {
        const schema = {
                houseNum: Joi.integer()
                        .max(5),
                street: Joi.string()
                        .max(255),
                province: Joi.string()
                        .max(255),
                country: Joi.string()
                        .max(255),
                pID: Joi.number()
                        .integer()
                        .required()
        };

        const { error } = Joi.validate(req.body, schema);

        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }

        const { houseNum, street, province, country, pID } = req.body;
        if (houseNum !== null) {
                const { code, message } = await updatePersonInfo('houseNum', houseNum, pID, db_pool);
                res.status(code).json(message);
        } else if (street !== null) {
                const { code, message } = await updatePersonInfo('street', street, pID, db_pool);
                res.status(code).json(message);
        } else if (province !== null) {
                const { code, message } = await updatePersonInfo('province', province, pID, db_pool);
                res.status(code).json(message);
        } else if (country !== null) {
                const { code, message } = await updatePersonInfo('country', country, pID, db_pool);
                res.status(code).json(message);
        }


};

// PUT: /api/profile/update/phonenum
const handleUpdatePhone = async (req, res, db_pool, Joi) => {
        const schema = {
                phoneNum: Joi.string()
                        .max(256),
                pID: Joi.number()
                        .integer()
                        .required()
        };
        const { error } = Joi.validate(req.body, schema);

        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }

        const { phoneNum, pID } = req.body;

        const { code, message } = await updatePersonInfo('phoneNumber', phoneNum.split(','), pID, db_pool);
        res.status(code).json(message);
};

const updatePersonInfo = async (column, value, pID, db_pool) => {
        try {
                const client = await db_pool.connect();
                try {
                        const queryText = `UPDATE eaccomodate.Person SET ${column} = $1 WHERE pID = $2;`;
                        res1 = await client.query(queryText, [value, pID]);
                        return { code: 200, comment: `Update on ${value} successful.` };
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        return { code: 400, comment: 'Error during update.' };
                } finally {
                        client.release();
                }
        } catch (err) {
                console.error('Database Connection Error', err.stack);
                return { code: 400, commment: 'Error during the conenction to the databse.' };
        }
};

module.exports = { handleUpdateEmail, handleUpdateName, handleUpdateAddress, handleUpdatePhone };
