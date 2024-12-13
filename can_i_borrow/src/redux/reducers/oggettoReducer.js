import { ADD_TO_FAV, CLEAR_FAV, CLEAR_OBJECT, CREATE_NEW_OBJECT, DELETE_OBJECT, GET_OBJECTS, REMOVE_FROM_FAV, UPDATE_OBJECT } from "../actions"

const initialState = {
    allObjects: [],
    favObjects: []
}

const oggettoReducer = (state = initialState, action) => {

    switch (action.type) {


        case GET_OBJECTS: {
            return {
                ...state,
                allObjects: action.payload
            }
        }

        case DELETE_OBJECT: {
            return {
                ...state,
                allObjects: state.allObjects.filter(obj => obj.id !== action.payload),
            };
        }


        case UPDATE_OBJECT: {
            return {
                ...state,
                allObjects: state.allObjects.map(obj =>
                    obj.id === action.payload.id ? { ...obj, ...action.payload } : obj
                )
            };
        }


        case CREATE_NEW_OBJECT: {
            return {
                ...state,
                allObjects: [...state.allObjects, action.payload],

            }
        }

        case ADD_TO_FAV:
            if (!state.favObjects) {
                return {
                    ...state,
                    favObjects: [action.payload], 
                };
            }

            if (!state.favObjects.some(obj => obj.id === action.payload.id)) {
                return {
                    ...state,
                    favObjects: [...state.favObjects, action.payload],
                };
            }

            return state;


        case REMOVE_FROM_FAV:

            return {
                ...state,
                favObjects: state.favObjects.filter(obj => obj.id !== action.payload),
            };


        case CLEAR_OBJECT: {
            return {
                ...state,
                allObjects: null
            }

        }

        case CLEAR_FAV: {
            return {
                ...state,
                favObjects: null
            }

        }



        default: {
            return state
        }

    }
}

export default oggettoReducer;