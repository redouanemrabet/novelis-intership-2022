import React, { useRef, useState, useEffect } from 'react'
import './Formulaire.css'
import logo from '../Log/images/logo-1.png'
import { db } from '../../Firebase'
import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../Firebase"
import { dbb } from '../../Firebase'
import { collection, getDocs } from "firebase/firestore";
import emailjs from 'emailjs-com'
import firebase from "firebase/compat/app";

function Formulaire() {
  const [jourSprint, setJourSprint] = useState("");
  const [tempsPresence, setTempsPresence] = useState();
  const [anomalieAnalyse, setAnomalieAnalyse] = useState(0);
  const [anomalieTraite, setAnomalieTraite] = useState(0);
  const [pointDeveloppe, setPointDeveloppe] = useState(0);
  const [raf, setRaf] = useState("");
  const [tempsReunion, setTempsRéunions] = useState(0);
  const [efficacite, setEfficacite] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [validation, setValidation] = useState("");
  const [validation1, setValidation1] = useState("");
  const [message, setMessage] = useState("");
  const sendRef = useRef();
  const formRef = useRef();
  const [radio, setRadio] = useState("");
  const [users, setUsers] = useState([]);
  const [sprint, setSprint] = useState([]);
  // const [email, setEmail] = useState("")
  // const [nom, setNom] = useState("")
  // const [iduser, setId] = useState(0)
  // const [prenom, setPrenom] = useState("")

  const usersCollectionRef = collection(dbb, "signIn")
  const sprintCollectionRef = collection(dbb, "sprint")
  const currentUser = firebase.auth().currentUser;//pour récuper l'utilisateur courant.
  // var templateParams = {
  //   name: nom,
  //   day: jourSprint,
  //   email: email,
  //   image: logo
  // };

  let newDate = new Date()
  let day = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  let date = day + "/" + month + "/" + year
  useEffect(() => {
    const getSprint = async () => {
      const data = await getDocs(sprintCollectionRef);//retourne all documents in our collections "inscription "
      setSprint(data.docs.map((doc) => ({
        ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document

      })))


    }
    getSprint();
  }, [])
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);//retourne all documents in our collections "inscription "
      setUsers(data.docs.map((doc) => ({
        ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document

      })))


    }

    // users.map((user) => {

    //   if (user.email === currentUser.email) {
    //     setEmail(user.email)
    //     console.log(email)
    //     setNom(user.nom);
    //     setPrenom(user.prenom);
    //     setId(user.id);
    //   }
    // })
    getUsers();
    // if (users != null) {
    //   const b = users.find((user) => user.email === currentUser.email);
    //   if (b != null) {
    //     setEmail(b.email)
    //     console.log(b)
    //     setNom(b.nom);
    //     setPrenom(b.prenom);
    //     setId(b.iduser);
    //   }
    // }
  }, [currentUser])

  const changeSprint = (e) => {
    setJourSprint(e.target.value);
  }
  const changePresence = (e) => {
    setTempsPresence(e.target.value);
  }
  const changeAnalyse = (e) => {
    setAnomalieAnalyse(e.target.value);
  }
  const changeTraite = (e) => {
    setAnomalieTraite(e.target.value);
  }
  const changePoint = (e) => {
    setPointDeveloppe(e.target.value);
  }
  const changeRaf = (e) => {
    setRaf(e.target.value);
  }
  const changeReunion = (e) => {
    setTempsRéunions(e.target.value);
  }

  const changeEfficacite = (e) => {


    if (e.target.value <= 5) {
      setMessage("certainement pas efficace")
      setEfficacite(e.target.value)
      setValidation1("");
    }
    else if (e.target.value > 5) {
      setMessage("incontestablement  efficace")
      setEfficacite(e.target.value)
      setValidation1("");

    }


  }
  const changeCommentaire = (e) => {
    setCommentaire(e.target.value);
  }




  const handleSubmit = (e) => {
    e.preventDefault();
    let idUser;
    let name;
    users.map((user) => {

      if (user.email == currentUser.email) {
        idUser = user.iduser;
        name = user.nom;

      }
    })
    var templateParams = {
      name: name,
      day: jourSprint,
      email: currentUser.email,

    };
    let varSprint;

    if (radio == "") {
      setValidation1("veuillez cocher l'une de ces cases")

    }
    else {
      sprint.map((spr) => {
        if (spr.open) {
          varSprint = spr;
        }
      })
      if (varSprint != null) {
        if (sendRef.current.checked) {

          emailjs.send("service_mail",//id service email
            "template_wof1oxx",//id template
            templateParams,
            "JRvw_laikDaTqGyKV"
          ).then(res => {
            console.log(res);
          }).catch(err => console.log(err));
        }
        db.collection('formulaire').add({
          date: date,
          archive: true,
          jourSprint: jourSprint,
          tempsPresence: Number(tempsPresence),
          anomalieAnalyse: Number(anomalieAnalyse),
          anomalieTraite: Number(anomalieTraite),
          pointDeveloppe: Number(pointDeveloppe),
          raf: Number(raf),
          tempsReunion: Number(tempsReunion),
          efficacite: Number(efficacite),
          commentaire: commentaire,
          idSprint: varSprint.idSprint,
          iduser: idUser
        })//we can show  a message if all things are good we use .then(()=>{})
          .then(() => {
            setValidation("les données sont bien envoyées");
            setMessage("")

            formRef.current.reset();
            setInterval(() => {
              setValidation("")
            }, 5000);
          })//cette fonction permet de vider le variable validation apres 5 secondes.
          .catch(error => {
            alert(error.message);

          })
      } else {
        setValidation("there's no sprint open");
        setInterval(() => {
          setValidation("");
        }, 5000);
      }
    }
  }
  const navigate = useNavigate()
  const logOut = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch {
      alert("for some reasons we can't deconnect,please check your internet and retry")
    }
  }
  const obligatoire = (e) => {
    setRadio(e.target.value);
  }

  return (
    <div>
      <div className="image1">
        <a href='https://novelis.io/'> <img src={logo} alt="this is novelis image" /></a>
      </div>
      <div className='container1'>
        <header >
          <h1>Recupitulatif d'activités-DEV</h1>
        </header>
        <div className="formulaire">
          <form
            onSubmit={handleSubmit}
            ref={formRef}>
            <p>
              required <span>*</span>
            </p>
            <h3 className="little-title">Journée du spring concerné par l'imputaion:</h3>
            <div className="champ">
              <p className="name-titre">1. Quel jour du sprint voulez-vous imputer? <span>*</span></p>
              <select name="select" className="select" id="select" onChange={changeSprint} required>
                <option value="" disabled selected hidden>Select your answer</option>
                <option>Jour 1</option>
                <option >Jour 2</option>
                <option>Jour 3</option>
                <option>Jour 4</option>
                <option >Jour 5</option>
                <option >Jour 6</option>
                <option >Jour 7</option>
                <option >Jour 8</option>
                <option >Jour 9</option>
                <option >Jour 10</option>

              </select>
            </div>
            <div className="champ">
              <p className="name-titre">2. Temps de présence <span>*</span></p>
              <select name="select" className="select" id="select" onChange={changePresence} required>
                <option value="" disabled selected hidden>Select your answer</option>
                <option >1 </option>
                <option >2 </option>
                <option >3 </option>
                <option >4 </option>
                <option >5 </option>
                <option >6 </option>
                <option >7 </option>
                <option >8 </option>
              </select>
            </div>
            <div className="champ">
              <p className="name-titre">3. Combien d'anomalies avez-vous analysé aujourd'hui? <span>*</span></p>
              <input type="number" placeholder="The value must be a number" className='input-form' onChange={changeAnalyse} required />
            </div>
            <div className="champ">
              <p className="name-titre">4. Combien d'anomalies avez-vous traité aujourd'hui? <span>*</span></p>
              <input type="number" placeholder="The value must be a number" className='input-form' onChange={changeTraite} required />
            </div>
            <div className="champ">
              <p className="name-titre">5. Quel est le nombre de points passés à "développé & tu " aujourd'hui? <span>*</span></p>
              <input type="number" placeholder="The value must be a number" className='input-form' onChange={changePoint} required />
            </div>
            <div className="champ">
              <p className="name-titre">6. Quel est le RAF sur les points entamés <span>*</span></p>
              <input type="number" placeholder="The value must be a number" className='input-form' onChange={changeRaf} required />
            </div>
            <div className="champ">
              <p className="name-titre">7.Combien de temps avez-vous passé sur des réunions ou support? <span>*</span></p>
              <select name="select" className="select" id="select" onChange={changeReunion} required>
                <option value="" disabled selected hidden>Select your answer</option>
                <option >1 </option>
                <option >2 </option>
                <option >3 </option>
                <option >4 </option>
                <option >5 </option>

              </select>
            </div>
            <div className="champ">
              <p className="name-titre">8. L'évaluation de l'efficacité de votre journée<span>*</span></p>
              <div className="tableau">
                <input type="radio" id="radio-a" className="radio-tab" value="0" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-a">0</label>
                <input type="radio" id="radio-b" className="radio-tab" value="1" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-b">1</label>
                <input type="radio" id="radio-c" className="radio-tab" value="2" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-c">2</label>
                <input type="radio" id="radio-d" className="radio-tab" value="3" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-d">3</label>
                <input type="radio" id="radio-e" className="radio-tab" value="4" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-e">4</label>
                <input type="radio" id="radio-f" className="radio-tab" value="5" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-f">5</label>
                <input type="radio" id="radio-g" className="radio-tab" value="6" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-g">6</label>
                <input type="radio" id="radio-h" className="radio-tab" value="7" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-h">7</label>
                <input type="radio" id="radio-i" className="radio-tab" value="8" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-i">8</label>
                <input type="radio" id="radio-j" className="radio-tab" value="9" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-j">9</label>
                <input type="radio" id="radio-k" className="radio-tab" value="10" onClick={changeEfficacite} name="radio-tab" onChange={obligatoire} />
                <label htmlFor="radio-k">10</label>
                <div className="efficace">
                  <p className="efficacite-left">{message}</p>

                  <p className="efficacite-left">{validation1}</p>
                </div>
              </div>

            </div>
            <div className="champ">
              <p className="name-titre">9. Un commentaire sur les éléments particuliers qu'il convient de noter <span>*</span></p>
              <textarea name="" id="" placeholder="Enter your answer" onChange={changeCommentaire} required></textarea>
            </div>
            <div className="check">

              <input type="checkbox" id="send" name="send" ref={sendRef} />
              <label htmlFor="send">Envoyez-moi un email de validation</label>


            </div>
            <div className="check">

              <p className='validation1'>{validation}</p>



            </div>
            <div className="sub">
              <div className="envoyer">
                <input type="Submit" value="Envoyer" />
              </div>
              <div className="logout">
                <input type="Submit" value="Se déconnecter" onClick={logOut} />
              </div>

            </div>
          </form>
        </div>
      </div>

    </div>
  )
}
export { Formulaire };
