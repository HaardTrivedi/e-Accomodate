// POST: /api/host-register
const handleRegister = async (req, res, db_pool, Joi) => {
	const { pID, property, rooms, accomodates } = req.body;
	const propertySchema = {
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
		propType: Joi.string()
			.max(25)
			.valid(['House', 'Apartment', 'Cabin', 'Cottage', 'Bed and Breakfast'])
			.required(),
		country: Joi.string()
			.max(30)
			.required(),
		roomType: Joi.string()
			.max(25)
			.valid(['private', 'shared', 'entire_property'])
			.required(),
		amenities: Joi.string()
			.max(100),
		rules: Joi.string()
			.max(100)
			.allow(null, ''),
		availDate: Joi.string()
			.max(10)
	};
	const res1 = Joi.validate(property, propertySchema);
	const pricingSchema = {
		accomodates: Joi.number()
			.integer()
			.required()
	};
	const res2 = Joi.validate(accomodates, pricingSchema);
	if (res1.error && res2.error) {
		res.status(400).json(res1.error.details[0].message + '\n'
			+ res2.error.details[0].message);
		return;
	} else if (res1.error) {
		res.status(400).json(res1.error.details[0].message);
		return;
	} else if (res2.error) {
		res.status(400).json(res2.error.details[0].message);
		return;
	}
	const { houseNum, street, city, province, propType, country, amenities, rules, roomType, availDate } = property;
	const numGuest = accomodates['accomodates'];

	let branchID = 0;
	if (country == 'Canada') {
		branchID = 1;
	} else {
		branchID = 2;
	}

	let priceID = 0;
	if (numGuest === 1) {
		priceID = 1;
	} else if (numGuest === 2) {
		priceID = 2;
	} else if (numGuest === 3) {
		priceID = 3;
	} else if (numGuest === 4) {
		priceID = 4;
	} else if (numGuest === 6) {
		priceID = 5;
	} else if (numGuest === 8) {
		priceID = 6;
	} else {
		priceID = 7;
	}

	let propertyType = '';
	if (propType == 'House') {
		propertyType = 'house';
	} else if (propType == 'Apartment') {
		propertyType = 'apartment';
	} else if (propType == 'Cabin') {
		propertyType = 'cabin';
	} else if (propType == 'Cottage') {
		propertyType = 'cottage';
	} else if (propType == 'Bed and Breakfast') {
		propertyType = 'bed_breakfast';
	}

	try {
		const client = await db_pool.connect();
		try {
			await client.query('BEGIN');
			const hostText = 'INSERT INTO eaccomodate.Host(pID) VALUES($1) RETURNING hostID;';
			const host = await client.query(hostText, [pID]);
			const hostID = host.rows[0]['hostid'];
			
			const addPropertyText =
				'INSERT INTO eaccomodate.Property(houseNum, street, city, province, country, propType, roomType, accomodates, amenities, bedrooms, bathrooms, rules, availDate, branchID, priceID, hostID) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING propertyID;';
			const prop = await client.query(addPropertyText, [houseNum, street, city, province, country, propertyType, roomType, numGuest, amenities, rooms[0], rooms[1], rules, availDate, branchID, priceID, hostID]);
			const propertyID = prop.rows[0]['propertyid'];
			await client.query('COMMIT');

			res.status(200).jsonp({
				hostID: hostID
			});
		} catch (err) {
			console.error('Cannot Add Property', err.stack);
			await client.query('ROLLBACK');
			res.status(400).json('Error during the registration as a host');
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
