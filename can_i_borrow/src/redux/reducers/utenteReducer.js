import { CLEAR_MY_PROFILE, GET_MY_PROFILE, GET_UTENTI } from "../actions"


const initialState = {
    allUsers: [],
    personalProfile: []
}

const utenteReducer = (state = initialState, action) => {

    switch(action.type) {


        case GET_UTENTI: {
            return {
                ...state,
                allUsers: action.payload
            }
        }

        case GET_MY_PROFILE: {
            return {
                ...state,
                personalProfile: action.payload
            }
        }

        case CLEAR_MY_PROFILE: {
            return {
                ...state,
                personalProfile: null
            }
        }

        default: {
            return state
        }

    }
}

export default utenteReducer;