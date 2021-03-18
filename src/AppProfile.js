import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Route } from 'react-router-dom';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import {auth} from './FirebaseConfig'

export const AppProfile = () => {

    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null);
    //const [authStatus, setAuthStatus] = useState(null);

    const onClick = (event) => {
        setExpanded(prevState => !prevState);
        event.preventDefault();
       // console.log('...current user', auth.currentUser.email)
    }

    const signOutHandler = (event) => {
        event.preventDefault();
        auth.signOut()
        .then((resp) => {  
            //setAuthStatus(false);  
            console.log('...response', resp)
        }).catch(error => {
          setError("Error signing out.");
          console.error("Error signing out", error);
        });       
    }
    let authStatus;
    if (auth.currentUser != null) {
        //setAuthStatus(true);  
        authStatus = true
    }else {
       // setAuthStatus(false);  
       authStatus = false
    }

    return (
        <div className="layout-profile">
            <div>
                <img src="assets/layout/images/profile.png" alt="Profile" />
            </div>
            <button className="p-link layout-profile-link" onClick={onClick}>
                <span className="username">
                    {authStatus ? auth.currentUser.email : "Please sign in." }                           
                </span>
               { authStatus && <i className="pi pi-fw pi-cog" />}
            </button>
            
            { authStatus &&                 
                <CSSTransition classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={expanded} unmountOnExit>
                    <ul className={classNames({ 'layout-profile-expanded': expanded })}>
                        <li><button type="button" className="p-link"><i className="pi pi-fw pi-user" /><span>Account</span></button></li>
                        <li><button type="button" className="p-link"><i className="pi pi-fw pi-inbox" /><span>Notifications</span><span className="menuitem-badge">2</span></button></li>
                        <li><button type="button" className="p-link" onClick = {signOutHandler}><i className="pi pi-fw pi-power-off" /><span>Logout</span></button></li>
                    </ul>
                </CSSTransition>
            }
        </div>
    );

}
