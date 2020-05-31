SET search_path = eaccomodate;

/* SQL code to populate the database with data */
INSERT INTO eaccomodate.Person(firstName, midNAME, lastName, houseNum, street, city, province, country, email, phoneNumber) VALUES 
('Kathy', 'R', 'Urias', '10', '3646  Bridgeport Rd', 'Ancaster', 'Ontario', 'Canada', 'kathyr@hotmail.com' , ARRAY['905-304-9474']),
('Isaac', 'L', 'Nelson', '15', '4375  Bank St', 'Ottawa', 'Ontario', 'Canada', 'nelsonisaac@gmail.com', ARRAY['613-316-4324']),
('Paul', 'A', 'Whited', '210', '2798  rue Garneau', 'Quebec', 'Quebec', 'Canada', 'whitedp@yahoo.com', ARRAY['418-930-5740']),
('Kathryn', 'L', 'Adams', '200', '1611  th St', 'Grande Prairie', 'Alberta', 'Canada', 'adamsl@gmail.com', ARRAY['780-831-4000']),
('Albert', 'M', 'Diaz', '67', '2477  Islington Ave', 'Toronto', 'Ontario', 'Canada', 'albertad@gmail.com', ARRAY['416-201-4496']),
('James', 'D', 'Walker', '18', '1401  Yonge Street', 'Toronto', 'Ontario', 'Canada', 'walkeraj@hotmail.com', ARRAY['416-926-4732']),
('Philip', 'E', 'Bonner', '340', '4465  avenue Royale', 'Quebec', 'Quebec', 'Canada', 'bonner@hotmail.com', ARRAY['418-264-2550']),
('Rachael', 'G', 'Strawbridge', '53', '3876  Galts Ave', 'Red Deer', 'Alberta', 'Canada', 'Strawbridge@live.com', ARRAY['403-341-5611']),
('Jason', 'L', 'Aponte', '43', '3700  Goyeau Ave', 'Windsor', 'Ontario', 'Canada', 'apontel@live.com', ARRAY['519-818-3858']),
('Glenn', 'M', 'Hallett', '323', '2633  Jasper Ave', 'Edmonton', 'Alberta', 'Canada', 'halletmm@live.com', ARRAY['403-341-4522']),
('Robert', 'B', 'Valdez', '121', '2352  Papineau Avenue', 'Montreal', 'Quebec', 'Canada', 'valdezrobert@live.com', ARRAY['514-924-2300']),
('James', 'K', 'Conner', '111', '1885  th Street', 'Calgary', 'Alberta', 'Canada', 'connerjames@live.com', ARRAY['403-521-1715']),
('David', 'M', 'McDonald', '112', '4809  Saskatchewan Dr', 'Quebec', 'Quebec', 'Canada', 'h2asd2@live.com', ARRAY['418-687-1239']);

INSERT INTO eaccomodate.Guest(pID) VALUES 
(1), 
(2), 
(3), 
(4), 
(5), 
(6),
(13);

INSERT INTO eaccomodate.Host(pID) VALUES 
(4), 
(5), 
(6),
(13);

INSERT INTO eaccomodate.Branch(country) VALUES 
('Canada'),
('United States');

INSERT INTO eaccomodate.Price(amount, guestsAllowed) VALUES 
(99.99, 1),
(149.98, 2),
(206.01, 3),
(251.12, 4),
(309.49, 6),
(449.97, 8),
(499.99, 10);

INSERT INTO eaccomodate.Property(branchID, priceID, hostID, houseNum, street, city, province, country, propType, roomType, bedrooms, bathrooms, accomodates, rules, amenities, availDate) VALUES 
(1, 1, 1, '210', '1364  Main St', 'Bjorkdale', 'Saskatchewan', 'Canada', 'apartment', 'shared', 1, 1, 2, 'No smoking, no parties', 'Wifi, toilet paper, towels, printer, scanner, washing machine, iron', DATE '2020-03-30'),
(2, 2, 2, '220', '2019  MacLaren Street', 'Ottawa', 'Ontario', 'Canada', 'apartment', 'shared', 2, 1, 4, 'No smoking', 'Wifi, toilet paper, towels, printer, scanner, washing machine, iron', DATE '2020-04-10'),
(1, 3, 3, '15', '1073  Fallon Drive', 'Teeswater', 'Ontario', 'Canada', 'house', 'entire_property', 3, 2, 6, 'Smoking friendly', 'Wifi, toilet paper, towels, printer, scanner, washing machine, iron', DATE '2020-04-12'),
(1, 4, 4, '1', '496  Yonge Street', 'Toronto', 'Ontario', 'Canada', 'house', 'entire_property', 5, 4, 8, 'Party friendly', 'Wifi, toilet paper, towels, printer, scanner, washing machine, iron', DATE '2020-04-09'),
(2, 5, 1, '5', '1264  Bridgeport Rd', 'Milton', 'Ontario', 'Canada', 'cabin', 'private', 1, 2, 4, 'None', 'Cell service, toilet paper, towels, printer, scanner, washing machine, iron', DATE '2020-05-01'),
(2, 6, 2, '120', '1760 th Street', 'Wetaskiwin', 'Alberta', 'Canada', 'bed_breakfast', 'private', 1, 2, 4, 'None', 'Cell service, toilet paper, towels, printer, scanner, washing machine, iron', DATE '2020-05-05'),
(1, 7, 3, '115', '797 th Street', 'Calgary', 'Alberta', 'Canada', 'cottage', 'private', 1, 2, 4, 'None', 'Cell service, toilet paper, towels, printer, scanner, washing machine, iron', DATE '2020-06-10');

INSERT INTO eaccomodate.Booking(hostID, guestID, propertyID, branchID, dateSign, dateFrom, dateTo) VALUES 
(1, 1, 1, 1, DATE '2020-01-01', DATE '2020-01-02', DATE '2020-01-04'),
(1, 2, 1, 1, DATE '2020-01-05', DATE '2020-01-10', DATE '2020-01-20'),
(2, 3, 2, 2, DATE '2020-02-02', DATE '2020-02-02', DATE '2020-02-05'),
(2, 4, 3, 2, DATE '2020-03-03', DATE '2020-03-04', DATE '2020-03-15'),
(2, 5, 4, 2, DATE '2020-04-04', DATE '2020-04-10', DATE '2020-04-20'),
(3, 6, 5, 1, DATE '2020-05-05', DATE '2020-05-10', DATE '2020-05-15'),
(1, 1, 1, 2, DATE '2020-06-06', DATE '2020-06-07', DATE '2020-06-26'),
(2, 3, 2, 2, DATE '2020-07-01', DATE '2020-07-10', DATE '2020-07-27'),
(3, 5, 5, 1, DATE '2020-08-10', DATE '2020-08-20', DATE '2020-09-01'),
(3, 6, 5, 1, DATE '2020-10-10', DATE '2020-10-11', DATE '2020-10-25');

INSERT INTO eaccomodate.Payment(bookingID, amount, paymentType, paymentStatus, paymentDate) VALUES 
(1, 240.42, 'cash', 'completed', DATE '2020-01-01'),
(2, 240.42, 'check', 'approved', DATE '2020-01-05'),
(3, 240.42, 'credit_card', 'pending', DATE '2020-02-02'),
(4, 333.12, 'direct_debit', 'approved', DATE '2020-03-03'),
(5, 333.12, 'direct_debit', 'pending', DATE '2020-04-04'),
(6, 180.97, 'credit_card', 'completed', DATE '2020-05-05'),
(7, 240.42, 'check', 'approved', DATE '2020-06-06'),
(8, 240.42, 'cash', 'approved', DATE '2020-07-01'),
(9, 180.97, 'credit_card', 'completed', DATE '2020-08-10'),
(10, 180.97, 'direct_debit', 'completed', DATE '2020-10-10');

INSERT INTO eaccomodate.Employee(employeeID, branchID, position, salary, employeeType) VALUES 
(7, 1, 'email_support', 39706, 'employee'),
(8, 2, 'email_support', 58081, 'employee'),
(9, 1, 'phone_support', 97807.11, 'employee'),
(10, 1, 'manager', 122398.98, 'manager'),
(11, 2, 'manager', 122000, 'manager'),
(12, 2, 'manager', 132000.56, 'employee');

INSERT INTO eaccomodate.Manager(managerID) VALUES 
(10), 
(11), 
(12);

INSERT INTO eaccomodate.Review(guestID, propertyID, rating, ratingCommunication, ratingCleanliness, ratingValue, comment) VALUES 
(1, 1, 5.0, 5, 5, 5, 'Excellent place to stay!'),
(2, 1, 4.4, 4, 5, 5, 'We couldnt locate the key during check in! We had to call the landlord.'),
(3, 2, 4.2, 5, 3, 5, 'The place was a bit dirty. We called the landlord and they sent in a cleaning crew right away.'),
(4, 3, 1.0, 1, 1, 1, 'We found bugs in the master bedroom! I wouldnt recommend staying here at all.'),
(5, 5, 5.0, 5, 5, 5, 'Great!');

INSERT INTO eaccomodate.Login(pID, email, pass) VALUES 
(1, 'kathyr@hotmail.com', 'password'), 
(2, 'nelsonisaac@gmail.com', 'password'), 
(3, 'whitedp@yahoo.com', 'password'), 
(4, 'adamsl@gmail.com', 'password'), 
(5, 'albertad@gmail.com', 'password'), 
(6, 'walkeraj@hotmail.com', 'password'),
(7, 'bonner@hotmail.com', 'password'),
(8, 'Strawbridge@live.com', 'password'),
(9, 'apontel@live.com', 'password'),
(10, 'halletmm@live.com', 'password'),
(11, 'valdezrobert@live.com', 'password'),
(12, 'connerjames@live.com', 'password'),
(13, 'h2asd2@live.com', 'password');
