import React, { useState, useEffect } from 'react'
import './Admin.css'
import Icon from '../Log/images/icon-rechrcher.png'
import gauche from '../Log/images/gauche4.png'
import logo from '../Log/images/logo-1.png'
import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { auth } from "../../Firebase"
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import firebase from "firebase/compat/app";
import { dbb } from '../../Firebase'
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../Firebase'
import { useRef } from 'react'


function AdminSup() {
    const documentsCollectionRef = collection(dbb, "supFormulaire")
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate()
    const inputSprint = useRef("");
    const [affiche, setAffiche] = useState(false);
    const [message, setMessage] = useState("")
    const [input, setInput] = useState("");
    const [AllSprint, setAllSprint] = useState([]);
    const sprintCollectionRef = collection(dbb, "sprint")


    useEffect(() => {
        const getDocuments = async () => {
            const data = await getDocs(documentsCollectionRef);//retourne all documents in our collections "inscription "
            setDocuments(data.docs.map((doc) => ({
                ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document
            })))

        }
        getDocuments();
    }, [])
    useEffect(() => {
        const getSprint = async () => {
            const data = await getDocs(sprintCollectionRef);//retourne all documents in our collections "inscription "
            setAllSprint(data.docs.map((doc) => ({
                ...doc.data(), id: doc.id//... for getting all data email username and password and we can add the id of document

            })))


        }
        getSprint();
    }, [])


    function Sprint(props) {
        let sprint1 = false
        if (documents != null) {
            return (
                <tbody>

                    {documents != null && documents.map((document) => {
                        if (document.nomSprint == props.nom) {

                            sprint1 = true;
                            setMessage("");
                            return (
                                <tr key={document}>
                                    <td>{document.nom}</td>
                                    <td>{document.nbrAnomalieAnalyse}</td>
                                    <td>{document.nbrAnomalieTraite}</td>
                                    <td>{document.nbrPoint} pt</td>
                                    <td>{document.nbrReunion} heure</td>
                                    <td>{document.dateDebut}</td>
                                    <td>{document.dateFin}</td>
                                    <td>{document.nomSprint}</td>
                                    <td>{document.termine}</td>
                                </tr>
                            )
                        }

                    })}
                    {documents == null && <tr >
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    }
                    {sprint1 == false && <tr >
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    }


                </tbody>
            )


        }


    }

    const logOut = async () => {
        try {
            await signOut(auth)
            navigate("/")

        } catch {
            alert("for some reasons we can't deconnect,please check your internet and retry")
        }
    }
    const show = () => {
        let sprint;
        if (inputSprint.current.value != null && inputSprint.current.value != "select the name of sprint") {
            setAffiche(true)
            setInput(inputSprint.current.value)
            documents.map((document) => {
                if (document.nomSprint == inputSprint.current.value) {
                    sprint = true
                }
            })

            if (!sprint) {
                setMessage("this sprint doesn't exists !!");
            }

        }

    }
    function SelectComponent() {
        const sprintBeforeSort = [];

        AllSprint.map((sprint) => {
            sprintBeforeSort.push(sprint.nomSprint);
        })
        const sprintAfterSort = sprintBeforeSort.sort();

        return (
            sprintAfterSort.map((sprintAfter) => {
                return (
                    <option >{sprintAfter}</option>
                )
            })
        )
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

                    <div className='titre-admin1'>
                        <header>
                            <div className='rechercheAndImage'>

                                {/* <input type="text" ref={inputSprint} className='rechercher' placeholder='entrer le id de sprint' id='rechercher' /> */}
                                <select size="1" autocomplete="off" ref={inputSprint} className='rechercher' placeholder='entrer le id de sprint' id='rechercher' onChange={show}>

                                    <option disabled selected hidden>select the name of sprint</option>
                                    <SelectComponent />

                                </select>
                                
                            </div>

                            <div className='message3'>
                                <h4>{message}</h4>
                            </div>
                        </header>
                    </div>





                    <div className="table-admin">
                        <table id="tablee">
                            <thead>
                                <tr>
                                    <th>Nom et Prénom</th>
                                    <th>Nombre anomalie analysé par jour</th>
                                    <th>Nombre anomalie traité par jour</th>
                                    <th>Nombre de point réalisé (pt)</th>
                                    <th>Nombre moyen des réunions par jour</th>
                                    <th>Date Debut</th>
                                    <th>Date Fin</th>
                                    <th>Sprint</th>
                                    <th>Imputation terminé</th>
                                </tr>
                            </thead>
                            {affiche && <Sprint nom={input} />}
                        </table>
                    </div>
                    <div className="bouton">
                        <div className="transformer">

                            <ReactHTMLTableToExcel
                                className="excel"
                                table="tablee"
                                filename="excel file"
                                buttonText="Export to excel"

                            />

                        </div>
                        <div className="logout">
                            <input type="Submit" value="Log out" onClick={logOut} />

                        </div>
                    </div>
                </div>
            
            </div>
        </>
    )
}
export { AdminSup }