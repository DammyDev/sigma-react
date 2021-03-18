const initialState = {
    authError : null
}

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'LOGIN_ERROR':
            console.log('Login Error')
            return {
                ...state,
               authError: action.err.message
            }
        case 'LOGIN_SUCCESS':
            console.log('User Login Success')
            return {
                ...state,
                authError: null
            }
        case 'LOGOUT_SUCCESS':
            console.log('User Logout Success')
            return state;
        default:
            return state; 
    }
}

export default authReducer