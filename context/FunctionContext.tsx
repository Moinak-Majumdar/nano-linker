import axios from "axios";
import { useContext, createContext, ReactNode } from "react";

async function createLink (url: string, isAuthenticated:string):Promise<string> {
    let ans:string = 'temp'
    await axios.post(`${process.env.NEXT_PUBLIC_CONNECTION_API}/genLink`, {url, isAuthenticated}, {headers: { 'Content-Type': 'application/json'}}).then((res) => {
        ans = res.data.slug
    }).catch((err) => {
        console.log(err)
        ans = 'error'
    })
    return ans;    
}

async function createUser (email: string) {
    await axios.post(`${process.env.NEXT_PUBLIC_CONNECTION_API}/createUser`, {email}, {headers: { 'Content-Type': 'application/json'}}).then(res => {
        const {success} = res.data;
        console.log(success)
    }).catch(err => {
        console.log(err)
    })
}

async function saveLinks(email:string, links: {url: string, slug: string}) {
    await axios.post(`${process.env.NEXT_PUBLIC_CONNECTION_API}/saveLinks`, {email, links}, {headers: { 'Content-Type': 'application/json'}}).then(res => {
        const {info} = res.data;
        console.log(info)
    }).catch(err => {
        console.log(err)
    })
}

async function getUserLinks(email: string) {
    let ans
    await axios.post(`${process.env.NEXT_PUBLIC_CONNECTION_API}/getUserLinks`, {email}, {headers: { 'Content-Type': 'application/json'}}).then(res => {
        ans = res.data;
    }).catch(err => {
        console.log(err)
        return false
    })
    return ans
} 

async function deleteUserLink(uid: string, email: string, doc: { url: string, slug:string, _id: string}) {
    let result
    await axios.post(`${process.env.NEXT_PUBLIC_CONNECTION_API}/deleteLink`, {uid, obj: doc}, {headers: { 'Content-Type': 'application/json'}}).then(async () => {
        result = await getUserLinks(email)
    }).catch((err) => {
        console.log(err)
        return false
    })
    return result
}


const defaultCtx = {createLink, createUser, saveLinks, getUserLinks, deleteUserLink}
const FunctionContext = createContext(defaultCtx);
export function useFunction() {
    return useContext(FunctionContext);
}

export function FunctionProvider ({children}: {children: ReactNode}) {
    const value = {createLink, createUser, saveLinks, getUserLinks, deleteUserLink}
    return (
        <FunctionContext.Provider value={value}>
            {children}
        </FunctionContext.Provider>
    )
}