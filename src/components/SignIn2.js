import React, {useState} from "react";
import { Link } from "@reach/router";
import { Redirect } from 'react-router-dom'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import firebase, {auth, firestore} from '../FirebaseConfig';


export const SignIn2 = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then((resp) => {      
            console.log('...response', resp)
        }).catch(error => {
          setError("Error signing in with password and email!");
          console.error("Error signing in with password and email", error);
        });       
    };

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;

        if(name === 'userEmail') {
            setEmail(value);
        }
        else if(name === 'userPassword'){
        setPassword(value);
        }
    };

    const logProject = (event) => {
        event.preventDefault();

const res = []
        firestore.collection("projects").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                res.push(doc.data())
            });
            console.log('...firestore', res.length);
        });
        
        //console.log('...firebase', firebase)

    };

  if (auth.currentUser != null){
      //console.log("...auth.uid", auth.uid)
      return <Redirect to='/dashboard' />
  } else{
      console.log('..testing')
  }

  return (
    <div className="mt-8">
      <h4 className="text-3xl mb-2 text-center font-bold">Sign In</h4>
      <hr />
      <div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        {error !== null && <div className = "py-4 bg-red-600 w-full text-red text-center mb-3">{error}</div>}
        <form className="">
            <div className="p-fluid p-col-3 p-md-3">

                <div className="p-field">
                    <label htmlFor="email">Email</label>
                    <InputText 
                        id="userEmail" 
                        name="userEmail"
                        type="email" 
                        value={email} 
                        placeholder="e.g. damilola@erap.com" 
                        onChange={event => onChangeHandler(event)} 
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="pwd">Password</label>
                    <InputText          
                        type="password"
                        className="mt-1 mb-3 p-1 w-full"
                        name="userPassword"
                        value={password}
                        placeholder="Your Password"
                        id="userPassword"
                        onChange={event => onChangeHandler(event)}         
                    />
                </div>

                <div className="p-field">       
                    <Button 
                        label="Sign In"  
                        onClick={event => {
                            signInWithEmailAndPasswordHandler(event, email, password)
                        }}>
                    </Button>
                </div>

            </div>
        </form>

      </div>
    </div>
  );
};
