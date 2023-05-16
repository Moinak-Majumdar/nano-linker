import Bg from "../tools/Bg"
import { Comic_Neue, Poppins } from 'next/font/google'
import styles from '@/styles/AuthError.module.css'
const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })

const AuthError = () => {
    return (
        <>
        
            <main style={comicNeue.style} className='myContainer min-h-screen justify-center items-center'>
                <div className={`${styles.glitch} w-fit h-fit p-4 lg:p-10 bg-white flex justify-center items-center flex-col rounded-xl bg-opacity-50 backdrop-blur-lg`}>
                    <h1 className='text-3xl'>
                        <span className='text-indigo-500 mr-2'>Lo siento amigo !</span>
                        <span className='text-gray-700'>Bad things happen</span>
                    </h1>
                    <h4 className={`${poppins.className} mt-4 font-normal`}>
                        <span>Authentication error, Please</span>
                        <span className='text-indigo-500 bg-slate-100 px-2 py-1 mx-1 rounded-md'>Refresh</span>
                        <span>the page.</span>
                    </h4> 
                </div>
            </main>
            <div className="absolute w-full h-full top-0 left-0  -z-10">
                <div className='hidden lg:flex absolute w-full h-full inset-0 bg-gradient-to-b z-10 from-[#fcfcfc]'></div>
                <Bg alt="landing pattern" src='/assets/svg/bg-svg2.svg' />
                <div className='absolute w-full h-full inset-0 bg-gradient-to-t z-10 from-[#fcfcfc]'></div>
            </div>
        </>
    )
}

export default AuthError