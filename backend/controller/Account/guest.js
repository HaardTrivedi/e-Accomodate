// POST: /api/guest-register
const handleRegister = async (req, res, db_pool, Joi, CryptoJS) => {
	const schema = {
		email: Joi.string()
			.email()
			.min(3)
			.max(256)
			.required(),
		password: Joi.string()
			.min(6)
			.required()
			.max(24),
		firstName: Joi.string()
			.max(35)
			.required(),
		midName: Joi.string()
			.allow(null, '')
			.max(35),
		lastName: Joi.string()
			.max(35)
			.required(),
		houseNum: Joi.string()
			.allow(null, '')
			.max(5),
		street: Joi.string()
			.max(255)
			.required(),
		city: Joi.string()
			.max(50)
			.required(),
		province: Joi.string()
			.max(30)
			.required(),
		phoneNum: Joi.string()
			.max(45)
			.regex(/([0-9])\w+,{0,1}/)
			.required(),
		country: Joi.string()
			.max(30)
			.required()
	};
	const { error } = Joi.validate(req.body, schema);
	if (error) {
		res.status(400).json(error.details[0].message);
		return;
	}
	const {
		email,
		password,
		firstName,
		midName,
		lastName,
		houseNum,
		street,
		city,
		province,
		phoneNum,
		country
	} = req.body;

	try {
		const client = await db_pool.connect();
		try {
			await client.query('BEGIN');
			let phoneNumber = phoneNum.split(',');
			const userText = 'INSERT INTO eaccomodate.Person(firstName, midName, lastName, email, houseNum, street, city, province, phoneNumber, country) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING pID;';
			const res1 = await client.query(userText, [
				firstName,
				midName,
				lastName,
				email,
				houseNum,
				street,
				city,
				province,
				phoneNumber,
				country
			]);
			const pID = res1.rows[0]['pid'];
			
			const guestText = 'INSERT INTO eaccomodate.Guest(pID) VALUES($1) RETURNING guestID;';
			const res2 = await client.query(guestText, [pID]);
			const guestID = res2.rows[0]['guestid'];

			const loginText = 'INSERT INTO eaccomodate.Login(pID, email, pass) VALUES($1, $2, $3) RETURNING email;';
			const res3 = await client.query(loginText, [pID, email, password]);
			const mail = res3.rows[0]['email'];

			await client.query('COMMIT');
			res.status(200).jsonp({
				pID: pID,
				guestID: guestID
			});
		} catch (err) {
			console.error(
				'Error during the transaction, ROLLBACK.',
				err.stack
			);
			await client.query('ROLLBACK');
			res.status(400).json('Error during the registration');
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

module.exports = { handleRegister };
