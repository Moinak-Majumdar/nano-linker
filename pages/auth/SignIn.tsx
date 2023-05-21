import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import Head from 'next/head'
import { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'
import { Comic_Neue, Poppins } from 'next/font/google'
import Bg from '@/components/tools/Bg'
import { useFunction } from '@/context/FunctionContext'
import { auth } from '@/firebase/firebase'
import AuthLoading from '@/components/auth/AuthLoading'
import AuthError from '@/components/auth/AuthError'
import { useAuth } from '@/context/AuthContext';


const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })
const btnClass = 'font-medium flex items-center gap-4 lg:text-xl rounded-md px-8 py-4 transition duration-500 ease-in-out'

const SignIn = () => {

    const router = useRouter();
    const { createUser } = useFunction()
    const [user, loading, error] = useAuthState(auth);
    const {signIn} = useAuth()

    useEffect(() => {
        if(user) {
            const {uid} = user
            if(uid) {
                createUser(uid)
                router.push('/')
            }
        }
    }, [user])
    

    if(loading) {
        return <AuthLoading />
    }

    if(error) {
        return <AuthError />
    }
   
    return (
        <>
            <Head>
                <title>Sign in - Nano Linker</title>
            </Head>
            <main style={comicNeue.style} className='myContainer min-h-screen justify-center items-center'>
                <div className='w-fit h-fit p-4 lg:p-10 bg-white flex justify-center items-center flex-col rounded-xl bg-opacity-40 backdrop-blur-lg'>
                    <h1 className='text-3xl'>
                        <span className='text-indigo-500 mr-2'>Ola amigo !</span>
                        <span className='text-gray-700'>Have a moment</span>
                    </h1>
                    <h4 className={`${poppins.className} mt-4 font-normal`}>
                        <span>Choose your preferable vendor to sign in </span>
                        <span className='text-indigo-500 bg-slate-100 p-1 rounded-md'>Nano Linker</span>
                    </h4>
                    <button onClick={() => signIn('google')} className={` bg-slate-100 mt-8 hover:bg-slate-200 focus:bg-slate-200 ${btnClass}`} style={poppins.style}>
                        <FcGoogle className='text-2xl lg:text-3xl' />
                        Sign in with Google
                    </button>
                    <button onClick={() => signIn('github')} className={`${btnClass} mt-4 bg-slate-900 hover:bg-slate-800 focus:bg-slate-800 text-gray-200 `} style={poppins.style}>
                        <BsGithub className='text-2xl lg:text-3xl' />
                        Sign In with GitHub
                    </button>
                </div>
            </main>
            <div className="absolute w-full h-full top-0 left-0  -z-10">
                <div className='hidden lg:flex absolute w-full h-full inset-0 bg-gradient-to-l z-10 from-[#fcfcfc]'></div>
                <Bg alt="landing pattern" src='/assets/svg/bg-svg2.svg' />
                <div className='absolute w-full h-full inset-0 bg-gradient-to-t z-10 from-[#fcfcfc]'></div>
            </div>
        </>
    )
}





export default SignIn