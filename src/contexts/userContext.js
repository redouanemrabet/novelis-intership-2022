import { createContext } from 'react'
import {
    signInWithEmailAndPassword,
  
} from 'firebase/auth'
import { auth } from "../Firebase"
export const UserContext = createContext()
export function UserContextProvider(props) {
    const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)
    
        return (
            <UserContext.Provider value={{signIn}}>
                { props.children}
            </UserContext.Provider>
        )
    }

    
