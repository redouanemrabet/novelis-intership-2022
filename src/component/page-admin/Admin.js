import React, { useState, useEffect } from 'react'
import './Admin.css'
import logo from '../Log/images/logo-1.png'
import icon from '../Log/images/icon.png'
import { signOut } from "firebase/auth"
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../../Firebase"
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import firebase from "firebase/compat/app";
import { dbb } from '../../Firebase'
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../Firebase'
import { link } from 'react-router-dom'
import emailjs from 'emailjs-com'

function Admin() {
  const navigate = useNavigate()
  const documentsCollectionRef = collection(dbb, "formulaire")
  const usersCollectionRef = collection(dbb, "signIn")
  const [documents, setDocuments] = useState([]);
  const [docs, setDocs] = useState([]);
  const [users, setUsers] = useState([]);
  const [docTemp, setDocTemp] = useState([]);
  const [allSprint, setAllSprint] = useState([]);
  const [message, setMessage] = useState("")
  const [displayed, setDisplayed] = useState(false);
  const sprintCollectionRef = collection(dbb, "sprint")
  let imputationCall = [];

  useEffect(() => {
    const getDocuments = async () => {
      const data = await getDocs(documentsCollectionRef);//retourne all documents in our collections "inscription "
      setDocuments(data.docs.map((doc) => ({
        ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document
      })))

    }

    getDocuments();

    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);//retourne all documents in our collections "inscription "
      setUsers(data.docs.map((doc) => ({
        ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document
      })))

    }
    getUsers();




  }, []);
  useEffect(() => {
    const getSprint = async () => {
      const data = await getDocs(sprintCollectionRef);//retourne all documents in our collections "inscription "
      setAllSprint(data.docs.map((doc) => ({
        ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document

      })))


    }
    getSprint();
  }, [])

  let newDate = new Date()
  let day = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  let date = day + "/" + month + "/" + year


  const logOut = async () => {
    try {
      await signOut(auth)
      navigate("/")

    } catch {
      alert("for some reasons we can't deconnect,please check your internet and retry")
    }
  }
  const addFirebase = () => {
    setDocTemp(imputationCall);
    const t1 = docTemp;
    let i = 0;
    t1.map((t) => {
      if (t.j == 10) {
        i = i + 1;
      }
    })
    if (i >= 4) {
      documents.map((document) => {
        if (document.archive == true) {
          const dataDoc = doc(db, "formulaire", document.id)
          const archiveDoc = { archive: false }
          updateDoc(dataDoc, archiveDoc);
        }


      })
      let nomSprint;
      let dateDebut;
      let dateFin;
      allSprint.map((sprint) => {
        if (sprint.idSprint == t1[1].sprint) {
          nomSprint = sprint.nomSprint;
          dateDebut = sprint.dateDebut;
          dateFin = sprint.dateFin;
        }
      })
      t1.map((t) => {


        db.collection('supFormulaire').add({

          date: date,
          nom: t.nom,
          nbrAnomalieAnalyse: t.nbrAnomalieAnalyse,
          nbrAnomalieTraite: t.nbrAnomalieTraite,
          nbrPoint: t.nbrPoint,
          nbrReunion: t.nbrReunion,
          termine: t.termine,
          nbrJours: t.j,
          nomSprint: nomSprint,
          dateDebut: dateDebut,
          dateFin: dateFin

        }).then(() => {
          console.log("bien enregistré");
          setMessage("bien archivé.")
          setInterval(() => { setMessage(false) }, 5000)

        })//cette fonction permet de vider le variable validation apres 5 secondes.
          .catch(error => {
            alert(error.message);

          })
      })
    }
    else {
      setMessage("ils restent des collaborateurs qui n'ont pas imputé tous les jours");
      setInterval(() => {
        setMessage("");
      }, 2500);
    }

  }

  const rappeler = (e) => {
    console.log(e.target.value);
    console.log(e.target.name);
    const templateParams = {
      email: e.target.value,
      to_name: e.target.name
    }
    emailjs.send("service_mail",
      "template_lslwrw9",
      templateParams,
      "JRvw_laikDaTqGyKV"
    ).then(res => {
      console.log(res);
      alert("le mail est bien envoyé");
    }).catch(err => console.log(err));
  }



  return (
    <>
      <div className="admin">
        <div className="image3">
          <div className="image3">
            <a href='https://novelis.io/'> <img src={logo} alt="this is novelis image" /></a>
          </div>
        </div>
        <div className="admin-all">

          <div className='titre-admin'>
            <header>
              <h1>Imputation des collaborateurs</h1>
            </header>
          </div>
          <div className="scroller">
            <div className="table-admin">
              <table id="tablee">
                <thead>
                  <tr>
                    <th>Nom et Prénom</th>
                    <th>Nombre anomalie analysé par jour</th>
                    <th>Nombre anomalie traité par jour</th>
                    <th>Nombre de point réalisé (pt)</th>
                    <th>Nombre moyen des réunions par jour</th>
                    <th>Sprint</th>
                    <th>Jours imputés</th>
                    <th>Imputation terminé</th>
                    <th>Reconfirmer</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users.map((user) => {
                      let table = [];
                      let toto;
                      let id;
                      allSprint.map((sprint) => {
                        if (sprint.open == true) {
                          id = sprint.idSprint;
                        }
                      })

                      if (user.role == false) {

                        documents.map((document) => {

                          if (user.iduser == document.iduser && document.archive == true && document.idSprint == id) {
                            table.push(document);
                          }

                        })




                        let joursRemplis = "Jours :";
                        let nbrAnomalieAnalyse = 0;
                        let nbrAnomalieTraite = 0;
                        let nbrPoint = 0;
                        let nbrReunion = 0;
                        let termine;
                        let j = 0;//le nombre de jour imputés
                        let sprint = 0;



                        if (table.length != 0) {

                          table.map((elm) => {
                            joursRemplis = joursRemplis + elm.jourSprint.substring(4) + " ,";
                            sprint = elm.idSprint;
                            nbrAnomalieAnalyse = nbrAnomalieAnalyse + elm.anomalieAnalyse;
                            nbrAnomalieTraite = nbrAnomalieTraite + elm.anomalieTraite;
                            nbrReunion = nbrReunion + elm.tempsReunion
                            nbrPoint = nbrPoint + elm.pointDeveloppe;
                            j = j + 1;

                          })
                          if (j == 10) {
                            termine = "oui";
                          }
                          else {
                            termine = 'non'
                          }
                          toto = {
                            nom: user.nom + " " + user.prenom,
                            sprint: sprint,
                            joursRemplis: joursRemplis.substring(0, joursRemplis.length - 1),
                            nbrAnomalieAnalyse: (nbrAnomalieAnalyse / j).toFixed(2),
                            nbrAnomalieTraite: (nbrAnomalieTraite / j).toFixed(2),
                            nbrPoint: (nbrPoint / j).toFixed(2),
                            nbrReunion: (nbrReunion / j).toFixed(2),
                            termine: termine,
                            j: j
                          }
                          imputationCall.push(toto);
                          docTemp.push(toto);
                        }
                        else {

                          toto = {
                            nom: user.nom + " " + user.prenom,
                            joursRemplis: "aucun jour",
                            nbrAnomalieAnalyse: 0,
                            nbrAnomalieTraite: 0,
                            sprint: sprint,
                            nbrPoint: 0,
                            nbrReunion: 0,
                            termine: "nom",
                            j: 0,
                          
                          }
                        }
                       




                        return (
                          <tr >
                            <td>{toto.nom}</td>
                            <td>{toto.nbrAnomalieAnalyse}</td>
                            <td>{toto.nbrAnomalieTraite}</td>
                            <td>{toto.nbrPoint} pt</td>
                            <td>{toto.nbrReunion} heure</td>
                            <td>{toto.sprint}</td>
                            <td>{toto.joursRemplis}</td>
                            <td>{toto.termine}</td>
                            <td > <button value={user.email} name={toto.nom} onClick={rappeler}>
                              Rappeler </button>  </td>
                          </tr>
                        )


                      }
                    })

                  }
                </tbody>

              </table>
            </div>
            {/* {displayed && (
          <div className='z-index-message'>
            Text that will appear when you hover over the button.
          </div>
        )} */}
          </div>
          <div className="bouton">
            <div className="transformer">

              <ReactHTMLTableToExcel
                className="excel"
                table="tablee"
                filename="excel file"
                buttonText="Exporter vers excel"

              />

            </div>
            <div className="logout">
              <input type="Submit" value="Se déconnecter" onClick={logOut} />
              <input type="Submit" value="Archiver" onClick={addFirebase} />

            </div>
            {/* <div className="archiver">
              <input type="Submit" value="Archiver"  />
             
            </div> */}
            <h4 className="message-archiver">{message}</h4>
          </div>

          <div className="consulter">
            <h3>Pour consulter les autres imputations : <Link className='link' to="/Admin/AdminSup"><img src={icon} alt="this is novelis image" /></Link></h3>
          </div>
        </div>
        <footer>
          <div class="footer-novelis">© 2022 Novelis innovation. All rights reserved.</div>
        </footer>
      </div>
    </>
  )
}
export { Admin };
