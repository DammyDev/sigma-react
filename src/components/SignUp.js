import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Link } from "@reach/router";
import firebase, {auth, generateUserDocument, firestore} from '../FirebaseConfig';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [error, setError] = useState(null);

  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    try{
        console.log('email', email, "password", password, 'firstname', firstname)
      const {user} = await auth.createUserWithEmailAndPassword(email, password);
      generateUserDocument(user, {displayName: `${firstname} ${lastname}`, role: dropdownRole, project: dropdownProject});
    }
    catch(error){
        console.log ("..error", error)
      setError('Error Signing up with email and password');
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setDropdownRole("");
    setDropdownProject("");
  };


  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "firstname") {
        setFirstName(value);
    } else if (name === "lastname") {
        setLastName(value);
    }    
  };

  const [dropdownRole, setDropdownRole] = useState(null);
  const [dropdownProject, setDropdownProject] = useState(null);
  const [dropdownProjects, setDropdownProjects] = useState([]);
  const [dropdownRoles, setDropdownRoles] = useState([]);

  useEffect(() => {  
    console.log('...firestore', firestore.collection('project'));
    console.log('...auth', auth.currentUser)

    firestore.collection("projects").get().then((querySnapshot) => {
        
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            setDropdownProjects(e => [...e, doc.data()])
        });
        
    });

    firestore.collection("roles").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            setDropdownRoles(e => [...e, doc.data()])
        });
    });

  }, []);

  return (
    <>
    <div className="p-col-12">
      <div className="card">
          <h4>Create New User</h4>
          <p>Use this page to create new users</p>
          <form>
              <div className="p-fluid p-formgrid p-grid">
                  <div className="p-field p-col-12 p-md-6">
                      <label htmlFor="firstname">Firstname</label>
                      <InputText 
                          id="firstname" 
                          name="firstname" 
                          type="text" 
                          value={firstname} 
                          placeholder="e.g Damilola" 
                          onChange={event => onChangeHandler(event)} 
                      />
                  </div>

                  <div className="p-field p-col-12 p-md-6">
                      <label htmlFor="lastname">Lastname</label>
                      <InputText 
                          id="lastname" 
                          name="lastname" 
                          type="text" 
                          value={lastname} 
                          placeholder="e.g Eludire" 
                          onChange={event => onChangeHandler(event)} 
                      />
                  </div>
                  <div className="p-field p-col-12 p-md-6">
                      <label htmlFor="email">Email</label>

                      <InputText 
                          id="email" 
                          name="userEmail"
                          type="email" 
                          value={email} 
                          placeholder="e.g. damilola@erap.com" 
                          onChange={event => onChangeHandler(event)} 
                      />

                  </div>
                  <div className="p-field p-col-12 p-md-6">
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
      
                  <div className="p-field p-col-12 p-md-6">
                      <label htmlFor="project">Project</label>
                      <Dropdown id="project" value={dropdownProject} onChange={(e) => setDropdownProject(e.value)} options={dropdownProjects} optionLabel="name" placeholder="Select One"></Dropdown>
                  </div>

                  <div className="p-field p-col-12 p-md-6">
                      <label htmlFor="role">Role</label>
                      <Dropdown id="role" value={dropdownRole} onChange={(e) => setDropdownRole(e.value)} options={dropdownRoles} optionLabel="name" placeholder="Select One"></Dropdown>
                  </div>
                  <div className="p-field p-col-12 p-md-12">       
                      <Button 
                          label="Submit"  
                          onClick={event => {
                              createUserWithEmailAndPasswordHandler(event, email, password);
                          }}>
                      </Button>
                  </div>
                  
              </div>
          </form>
        
      </div>
  </div>
</>
 );
};
export default SignUp;  