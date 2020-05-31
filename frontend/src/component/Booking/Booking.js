import React, { Component } from 'react';
import 'react-dates/initialize';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import { ReviewStats } from '../Review/ReviewList/ReviewHeader';
import 'react-dates/lib/css/_datepicker.css';
import './Booking.css';

class Booking extends Component {
        constructor() {
                super();
                this.state = {
                        startDate: null,
                        endDate: null,
                        numDays: 0,
                        total: 0,
                        succ: false,
                        error: false
                };
        }

        isBlocked = (day) => {
                return this.props.unavailDate.some((unavailableDay) =>
                        moment(unavailableDay).isSame(day, 'day')
                );
        };
        
        checkForBlockedDates = (start, end, dates) => {
                const dateFormat = 'YYYY-MM-DD';
                const diff = moment(end).diff(start, 'days') + 1;
                for (let i = 0; i < diff; i++) {
                        const checkDate = moment(start)
                                .add(i, 'd')
                                .format(dateFormat);
                        if (dates.find((day) => day === checkDate)) {
                                return true;
                        }
                }
                return false;
        };

        setDateAndDays = (startDate, endDate) => {
                let numDays = 0;
                if (startDate != null && endDate != null) {
                        if (this.checkForBlockedDates(startDate.toDate(), endDate.toDate(), this.props.unavailDate)) { return; }
                        numDays = moment(endDate.toDate()).diff(startDate.toDate(), 'days') + 1;
                }

                this.setState({ startDate, endDate, numDays, total: numDays * this.props.amount });
        };

        onSubmitReserve = async () => {
                const { guestID, propertyID, setLoading } = this.props;
                const { startDate, endDate } = this.state;
                try {
                        if (startDate === null || endDate === null) {
                                throw Error(
                                        'One or both of the dates are null'
                                );
                        }
                        if (setLoading) {
                                setLoading(true);
                        }
                        const response = await fetch(
                                'http://localhost:8080/api/booking/reserve',
                                {
                                        method: 'post',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                                guestID: guestID,
                                                propertyID: propertyID,
                                                dateFrom: startDate.toDate(),
                                                dateTo: endDate.toDate()
                                        })
                                }
                        );

                        if (response.ok) {
                                this.setState({ succ: true });
                                if (setLoading) {
                                        setLoading(false);
                                }
                                return;
                        }
                        throw Error('Booking was not reserved.');
                } catch (err) {
                        console.log(err);
                        this.setState({ error: true });
                        if (setLoading) {
                                setLoading(false);
                        }
                }
        };

        render() {
                const { rating, amount, length } = this.props;
                const { total, succ, error } = this.state;
                const ErrorMessage = error ? (
                        <div className='error-message'>
                                Booking Not Completed
                        </div>
                ) : null;
                const SuccMessage = succ ? (
                        <div className='succ-message'>
                                Reservation Completed
                        </div>
                ) : null;
                return (
                        <div className='bookingContainer'>
                                <div className='bookingHeader'>
                                        <div className='amount'>
                                                <h3>{`CAD $${amount}`}</h3>
                                                <span className='amount-night'>/night </span>
                                        </div>
                                        {ReviewStats(rating, length)}
                                        <div className='lineMargin'>
                                                <div className='lml'></div>
                                        </div>
                                </div>
                                <div className='bookingDate'>
                                        <h4 className='lbl'>Select Stay Dates</h4>
                                        <DateRangePicker
                                                startDate={this.state.startDate}
                                                startDateId='start_date_id_0'
                                                endDate={this.state.endDate} 
                                                endDateId='end_date_id_0'
                                                onDatesChange={({ startDate, endDate, dates }) => this.setDateAndDays(startDate, endDate, dates)}
                                                focusedInput={this.state.focusedInput}
                                                onFocusChange={(focusedInput) => this.setState({ focusedInput })}
                                                numberOfMonths={1}
                                                isDayBlocked={this.isBlocked}
                                                minimumNights={0}
                                                showClearDates={true}
                                        />
                                        <div className='lineMargin'> <div className='lml'></div> </div>
                                </div>

                                <div className='bookingPrice'>
                                        <span>{`$${amount} x ${this.state.numDays} nights`}</span>
                                        <span className='amount-total'>
                                                {total
                                                        ? `$${total.toFixed(2)}`
                                                        : null}
                                        </span>
                                </div>

                                <div className='lineMargin'>
                                        <div className='lml'></div>
                                </div>

                                <div>
                                        <button
                                                type='submit'
                                                className='submitButton'
                                                onClick={this.onSubmitReserve}>
                                                Book
                                        </button>
                                </div>
                                {ErrorMessage}
                                {SuccMessage}
                        </div>
                );
        }
}

export default Booking;
