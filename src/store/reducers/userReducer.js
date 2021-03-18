const initialState = {
    users:[
        // {id: '1', title: 'Lagos-Ibadan Road', owner:'FG'},
        // {id: '2', title: 'Kaboji Farm', owner:'NISG'},
        // {id: '3', title: 'Fourth Mainland bridge', owner:'LASG'},
        // {id: '4', title: 'Eko Railway', owner:'LASG'}
    ]
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_USER_SUCCESS':
            console.log('created user', action.newUser);
            return {
                ...state,
                authError: null 
            };
        case 'CREATE_USER_ERROR':
            console.log('create user error', action.err);
            return {
                ...state,
                authError: action.err.message 
            };
        default:
            return state;
    }
}

export default userReducer 