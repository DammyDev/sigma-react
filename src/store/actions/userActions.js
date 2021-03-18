export const createUser = (newUser) => {
    return (dispatch, getState,{getFirebase, getFirestore }) => {
        //make async calls
        const firebase = getFirebase();
        const firestore = getFirestore();
        
        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((resp) => {
            return firestore.collection('users').doc(resp.user.uid).set({
               firstname: newUser.firstname,
               lastname: newUser.lastname,
               role: newUser.role,
               project: newUser.project,
               updatedAt: new Date()
            }).then(()=> {
                dispatch({type: 'CREATE_USER_SUCCESS', newUser: newUser });            
            }).catch((err) => {
                dispatch({type: 'CREATE_USER_ERROR', err })
            })
        }).catch((err) =>{
            dispatch({type: 'CREATE_USER_ERROR', err })
        })

    }
};