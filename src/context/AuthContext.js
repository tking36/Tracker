import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./createDataContext";
import tracker from "../api/tracker";





const authReducer = (state, action) => {
    switch (action.type) {
      case 'add_error':
        return { ...state, errorMessage: action.payload };
      case 'signin':
        return { errorMessage: '', token: action.payload };
      case 'signout':
        return { ...state, token: null };
      case 'clear_error_message':
        return { ...state, errorMessage: '' };
      default:
        return state;
    }
  };

  const tryLocalSignin = (dispatch) => async () => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
        dispatch({type: 'signin', payload: token})
    }
}

const clearErrorMessage = (dispatch) => () => {
    dispatch({type: 'clear_error_message'})
}

const signup = (dispatch) => async ({ email, password }) => {
    try {
        const response = await tracker.post('/signup', {email, password})
        await AsyncStorage.setItem('token', response.data.token)
        dispatch({type: 'signin', payload: response.data.token})
        
    } catch(err) {
        dispatch({type: 'add_error', payload: 'Something went wrong with sign up'})
    }
    };


const signin = (dispatch) => async ({ email, password }) => {
        try{
            const response = await tracker.post('/signin', {email, password})
            await AsyncStorage.setItem('token', response.data.token)
            dispatch ({type: 'signin', payload: response.data.token})
        } catch(err) {
            dispatch({
                type: 'add_error',
                payload: 'Something went wrong with sign in'
            })
        }
    };


    const signout = (dispatch) => async () => {
        await AsyncStorage.removeItem('token')
        dispatch({type: 'signout'})
    };

export const {Provider, Context} = createDataContext(
    authReducer,
    {signin, signout, signup, clearErrorMessage, tryLocalSignin},
    {token: null, errorMessage: ''}
);