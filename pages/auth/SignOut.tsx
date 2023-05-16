import { Comic_Neue, Roboto } from 'next/font/google'
import { FaWalking } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Bg from '@/components/tools/Bg'
import { useAuth } from '@/context/AuthContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import AuthLoading from '@/components/auth/AuthLoading'
import AuthError from '@/components/auth/AuthError'
import { auth } from '@/firebase/firebase'
import { useEffect } from 'react'

const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700' })
const roboto = Roboto({ subsets: ['latin'], weight: "400" })

const SignOut = () => {
    const router = useRouter()

    const { signOut } = useAuth();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [])

    function logout () {
        signOut(auth).then(() => {
            router.push('/')
        }).catch (err => {
            console.log(err)
        })
    }

    if (loading) {
        return <AuthLoading />
    }

    if (error) {
        return <AuthError />
    }

    return (
        <>
            <Head>
                <title>Sign Out - Nano Linker</title>
            </Head>
            <main className='myContainer min-h-screen justify-center items-center flex-col'>
                <div className='w-fit h-fit p-4 lg:p-10 bg-white flex justify-center items-center flex-col rounded-xl bg-opacity-40 backdrop-blur-lg'>
                    <h1 className={`${comicNeue.className} text-3xl font-bold`}>
                        <span className='text-indigo-500 mr-2'>Adios amigo !</span>
                        <span className='text-gray-700'>Leaving too soon?</span>
                    </h1>
                    <h4 className={`${roboto.className} mt-4`}>
                        Click <span className='text-indigo-400 bg-slate-100 p-1 rounded-md'>SIGN OUT</span> button to sign out from <span className='text-indigo-500 bg-slate-100 p-1 rounded-md'>Nano Linker</span>
                    </h4>
                    <button onClick={logout} style={roboto.style} className='mt-8 text-2xl bg-slate-200 group px-4 py-2 rounded-xl flex gap-2 items-center'>
                        <span className='text-slate-700'>SIGN OUT</span>
                        <FaWalking className='text-gray-500 group-hover:text-blue-600' />
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


export default SignOut