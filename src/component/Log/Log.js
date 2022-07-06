import React, { useRef, useState, useEffect, useContext } from 'react';
//import ReactDOM from "react-dom/client";//render pour brancher
import './Log.css'
import { UserContext } from '../../contexts/userContext'
import { useNavigate } from "react-router-dom"
import logo from './images/logo-1.png'
import { dbb } from '../../Firebase'
import { collection, getDocs } from "firebase/firestore";
import { Formulaire } from '../formulaire/Formulaire';
import { Admin } from '../page-admin/Admin';


export default function Log() {
  const navigate = useNavigate()

  const { signIn } = useContext(UserContext)
  const inputs = useRef([])
  const formRef = useRef();
  const [validation, setValidation] = useState("")
  const [users, setUsers] = useState([]);
  
  const usersCollectionRef = collection(dbb, "signIn")
  const addInputs = el => {//cette methode sera éxecuté à chaque fois on ajoute une input
    if (el && !inputs.current.includes(el)) {//si l'element existe et il n'est pas dèja dans notre tableau
      inputs.current.push(el);//on va ajoute ce element dans le tableau inputs
    }
  }
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);//retourne all documents in our collections "inscription "
      setUsers(data.docs.map((doc) => ({
        ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document
      })))

    }
    getUsers();


  }, [])

  const handleForm = async (e) => {
    e.preventDefault()
    let role;
    users.map((user) => {

      if (user.email == inputs.current[0].value) {
        
        role = user.role;
       

      }
    })


    try {

      const cred = await signIn(
        inputs.current[0].value,
        inputs.current[1].value)
   
      switch (role) {
        case true:
          setValidation("")
          navigate("/Admin")
          break
        case false:
          setValidation("")
          navigate("/Formulaire")
          break
        default:
          console.log('Invalid Input')

      }
    }
    //




    catch (error) {
      setValidation("ooh, email et/ou mot de passe incorrect");
    
      console.log(signIn);
      console.log(error)
    }


  }
  const supprimerMessage=()=>{
    setValidation("");
  }
  return (
    <div >
      <div className="image">
       <a href='https://novelis.io/'> <img src={logo} alt="this is novelis image" /></a>
      </div>
      <div className="container">
      <div className="signup-content">
        <h1>Connexion</h1>
        <form onSubmit={handleForm} ref={formRef}  >


          <label htmlFor="email"></label>
          <input ref={addInputs} type="email" id="email" placeholder="email" required onChange={supprimerMessage}/>
          <label htmlFor="password"></label>
          <input ref={addInputs} type="password" id="password" placeholder='password' required onChange={supprimerMessage}/>
          <p className="validation">{validation}</p>
          <input type="submit" value="LOGIN" className="form-submit" />
         

        </form>
        </div>
      </div>
    </div>
  );
}
