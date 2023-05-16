import { motion } from "framer-motion"
import Bg from "../tools/Bg"
import { Comic_Neue, Poppins } from 'next/font/google'
const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })

const AuthLoading = () => {
    return (
        <>
            <main style={comicNeue.style} className='myContainer min-h-screen justify-center items-center'>
                <div className='w-fit h-fit p-4 lg:p-10 bg-white flex justify-center items-center flex-col rounded-xl bg-opacity-50 backdrop-blur-md'>
                    <div className="relative h-16 w-16">
                        <motion.span animate={{rotate: 360}} transition={{repeat: Infinity, duration: 1, ease: 'linear'}} className="block w-16 h-16 border-[.6rem] border-slate-200 border-t-blue-500 rounded-full absolute box-border top-0 left-0"></motion.span>         
                    </div>
                    <h1 className='text-3xl mt-8'>
                        <span className='text-indigo-500 mr-2'>Ola amigo !</span>
                        <span className='text-gray-700'>Have a moment</span>
                    </h1>
                    <h4 className={`${poppins.className} mt-4 font-normal`}>
                        <span>Please wait, authentication </span>
                        <span className='text-indigo-500 bg-slate-100 p-1 rounded-md'>Loading ...</span>
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

export default AuthLoading