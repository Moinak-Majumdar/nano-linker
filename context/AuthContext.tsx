import { GoogleAuthProvider, signInWithRedirect, signOut, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, useContext, ReactNode } from "react";
import { auth } from "@/firebase/firebase";

function signIn(vendor: string) {

    if (vendor === 'google') {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider).then(() => {
            if(typeof window !== 'undefined') {
                const newWindow = window.open('/', '', 'noopener,noreferrer')
                newWindow ? newWindow.opener = null : ''
            }
        }).catch(err => {
            console.log(err)
        })
    }
    if (vendor === 'github') {
        const provider = new GithubAuthProvider();
        signInWithRedirect(auth, provider).then(() => {
            if(typeof window !== 'undefined') {
                const newWindow = window.open('/', '', 'noopener,noreferrer')
                newWindow ? newWindow.opener = null : ''
            }
        }).catch(err => {
            console.log(err)
        })
    }
}


const initial = { signIn, signOut }
const AuthContext = createContext(initial)

export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider({ children }: { children: ReactNode }) {
    
    
    return (
        <AuthContext.Provider value={initial}>
            {children}
        </AuthContext.Provider>
    )
}