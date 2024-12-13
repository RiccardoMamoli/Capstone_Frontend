export const CREATE_NEW_OBJECT = "CREATE_NEW_OBJECT"
export const DELETE_OBJECT = "DELETE_OBJECT"
export const ADD_TO_FAV = "ADD_TO_FAV"
export const REMOVE_FROM_FAV = "REMOVE_FROM_FAV"
export const GET_OBJECTS = "GET_OBJECTS"
export const GET_UTENTI = "GET_UTENTI"
export const SET_TOKEN = "SET_TOKEN"
export const CLEAR_TOKEN = "CLEAR_TOKEN"
export const GET_MY_PROFILE = "GET_MY_PROFILE"
export const CLEAR_MY_PROFILE = "CLEAR_MY_PROFILE"
export const GET_BOOKINGS = "GET_BOOKINGS"
export const CREATE_BOOKING = "CREATE_BOOKING"
export const CLEAR_BOOKING = "CLEAR_BOOKING"
export const GET_BOOKING_IN = "GET_BOOKING_IN"
export const UPDATE_OBJECT = "UPDATE_OBJECT"
export const CLEAR_OBJECT = "CLEAR_OBJECT"
export const DELETE_BOOKING = "DELETE_BOOKING"
export const ACCEPT_BOOKING = "ACCEPT_BOOKING"
export const REJECT_BOOKING = "REJECT_BOOKING"
export const CLEAR_FAV = "CLEAR_FAV"


// OGGETTI //

export const getOggetti = () => {
    return async (dispatch) => {
        const url = 'http://localhost:3001/oggetti';
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: GET_OBJECTS,
                    payload: data.content,
                });
            } else {
                console.error('Errore nella fetch per ottenere gli oggetti');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
};

export const createNewObject = (newObject, token) => {
    return async (dispatch) => {
        const url = 'http://localhost:3001/oggetti';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newObject),
            });

            if (response.ok) {
                const createdObject = await response.json();
                dispatch({
                    type: CREATE_NEW_OBJECT,
                    payload: createdObject,
                });
            } else {
                console.error('Errore nella fetch per creare una nuova prenotazione');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
};

export const deleteObject = (objId, token) => {
    return async (dispatch) => {
        const url = `http://localhost:3001/oggetti/${objId}`; 
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                dispatch({
                    type: DELETE_OBJECT, 
                    payload: objId, 
                });
            } else {
                console.error('Errore nella fetch per eliminare l\'oggetto');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
};

export const modifyObject = (updatedObject, token, id) => {
    return (dispatch) => {
        fetch(`http://localhost:3001/oggetti/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedObject),
        })
        .then(response => response.json())
        .then(data => {
            dispatch({
                type: UPDATE_OBJECT,
                payload: data.content,
            });
        })
        .catch(error => {
            dispatch({
                type: 'MODIFY_OBJECT_FAILURE',
                error: error.message,
            });
        });
    };
};

export const addToFav = (object) => {
    return {
        type: ADD_TO_FAV,
        payload: object,
    };
};

export const removeFromFav = (objectId) => {

    return {
        type: REMOVE_FROM_FAV,
        payload: objectId,
    }
}

export const clearObject= () => ({
    type: CLEAR_OBJECT,
});

export const clearFav= () => ({
    type: CLEAR_FAV,
});

// UTENTI //

export const getUtenti = () => {
    return async (dispatch) => {
        const url = 'http://localhost:3001/utenti';
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: GET_UTENTI,
                    payload: data.content,
                });
            } else {
                console.error('Errore nella fetch per ottenere gli utenti');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };

}

export const getPersonalProfile = () => {
    return async (dispatch, getState) => {
        const url = 'http://localhost:3001/utenti/me';
        const token = getState().token.token

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: GET_MY_PROFILE,
                    payload: data,
                });
            } else {
                console.error('Errore nella fetch per ottenere il tuo profilo');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
};

export const clearMyProfile = () => ({
    type: CLEAR_MY_PROFILE,
});


// TOKEN //

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token,
});

export const clearToken = () => ({
    type: CLEAR_TOKEN,
});

// BOOKINGS //

export const getBookings = (token) => {
    return async (dispatch) => {
        const url = 'http://localhost:3001/prenotazioni';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: GET_BOOKINGS,
                    payload: data.content,
                });
            } else {
                console.error('Errore nella fetch per ottenere le prenotazioni');
            }
        } catch (error) {
            console.error('Errore durante la fetch')
        }
    }
}

export const getBookingsIn = (token) => {
    return async (dispatch) => {
        const url = 'http://localhost:3001/prenotazioni/prenotazioni-oggetti';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: GET_BOOKING_IN,
                    payload: data.content,
                });
            } else {
                console.error('Errore nella fetch per ottenere le prenotazioni');
            }
        } catch (error) {
            console.error('Errore durante la fetch')
        }
    }
}

export const createBooking = (newBooking, token) => {
    return async (dispatch) => {
        const url = 'http://localhost:3001/prenotazioni';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newBooking),
            });

            if (response.ok) {
                const createdBooking = await response.json();
                dispatch({
                    type: CREATE_BOOKING,
                    payload: createdBooking,
                });
            } else {
                console.error('Errore nella fetch per creare una nuova prenotazione');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
};

export const deleteBooking = (bookId, token) => {
    return async (dispatch) => {
        const url = `http://localhost:3001/prenotazioni/${bookId}`; 
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                dispatch({
                    type: DELETE_BOOKING, 
                    payload: bookId, 
                });
            } else {
                console.error('Errore nella fetch per eliminare la prenotazione!');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
};

export const clearBooking = () => ({
    type: CLEAR_BOOKING
})

export const acceptBooking = (id, token) => {
    return async (dispatch) => {
        const url = `http://localhost:3001/prenotazioni/${id}/stato`;
        const updatedStatus = "ACCETTATA"; 
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedStatus), 
            });

            if (response.ok) {
                const updatedBooking = await response.json(); 
                dispatch({
                    type: ACCEPT_BOOKING,
                    payload: updatedBooking, 
                });
            } else {
                console.error('Errore nella fetch per aggiornare la prenotazione');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
};

export const rejectBooking = (id, token) => {
    return async (dispatch) => {
        const url = `http://localhost:3001/prenotazioni/${id}/stato`;
        const updatedStatus = "RIFIUTATA"; 
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedStatus), 
            });

            if (response.ok) {
                const updatedBooking = await response.json(); 
                dispatch({
                    type: REJECT_BOOKING,
                    payload: updatedBooking, 
                });
            } else {
                console.error('Errore nella fetch per aggiornare la prenotazione');
            }
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    };
    
};







