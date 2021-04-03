import React from 'react';
import SignIn from '../components/SignIn2'
import SignUp from '../components/SignUp'

export const EmptyPage = () => {

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card">

                    <SignUp />
                    
                </div>
            </div>
        </div>
    );
}
