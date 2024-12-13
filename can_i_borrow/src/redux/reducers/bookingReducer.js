import { ACCEPT_BOOKING, CLEAR_BOOKING, CREATE_BOOKING, DELETE_BOOKING, GET_BOOKINGS, GET_BOOKING_IN, REJECT_BOOKING } from "../actions"

const initialState = {
    allBookings: [],
    bookingsIn: []
}

const bookingReducer = (state = initialState, action) => {
    switch (action.type) {


        case GET_BOOKINGS: {
            return {
                ...state,
                allBookings: action.payload
            }
        }

        case DELETE_BOOKING: {
            return {
                ...state,
                allBookings: state.allBookings.filter(booking => booking.id !== action.payload),
            };
        }

        case GET_BOOKING_IN: {
            return {
                ...state,
                bookingsIn: action.payload
            }
        }

        case CREATE_BOOKING: {
            return {
                ...state,
                allBookings: [...state.allBookings, action.payload],
            };
        }

        case ACCEPT_BOOKING: {

            const updatedBookingsIn = state.bookingsIn.map(booking =>
                booking.id === action.payload.id
                    ? { ...booking, stato: "ACCETTATA" }
                    : booking
            );

            return {
                ...state,
                bookingsIn: updatedBookingsIn
            };
        }

        case REJECT_BOOKING: {

            const updatedBookingsIn = state.bookingsIn.map(booking =>
                booking.id === action.payload.id
                    ? { ...booking, stato: "RIFIUTATA" }
                    : booking
            );

            return {
                ...state,
                bookingsIn: updatedBookingsIn
            };
        }

        case CLEAR_BOOKING: {
            return {
                ...state,
                allBookings: null,
                bookingsIn: null
            }

        }

        default: {
            return state
        }

    }

}

export default bookingReducer;