import { FaCopy } from 'react-icons/fa'
import { BsArrowUpRight } from 'react-icons/bs'
import { RiDeleteBack2Fill } from 'react-icons/ri'
import { Poppins, Comic_Neue } from 'next/font/google'
import Bg from '../tools/Bg'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Head from 'next/head'

const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })
const classList = {
    dltBtn: 'bg-pink-500 px-2 py-2 lg:py-1 rounded-full lg:rounded-md text-white text-xl capitalize flex items-center gap-2 z-10 opacity-10',
    cpyBtn: 'bg-blue-500 px-2 py-2 lg:py-1 rounded-full lg:rounded-md text-white text-xl capitalize flex items-center gap-2 z-10 opacity-10',
    visitBtn: 'w-fit flex text-blue-500 gap-2 items-center uppercase border-2 border-blue-400 rounded-full lg:rounded-md px-2 py-2 lg:py-1 lg:text-xl z-10 hover:scale-110 transition duration-300 opacity-10'
}

const LinkSkeleton = () => {
    return (
        <>
            <Head>
                <title>Pease Sign In</title>
            </Head>
            <section className='min-w-[100vw] overflow-hidden relative'>
                <main className='myContainer min-h-screen flex items-center'>
                    <h2 style={poppins.style} className='my-8 text-sky-500 text-2xl'>Seems you are not sign in, Please do sign in bto access your saved Nano links.</h2>
                    <Link href='/auth/SignIn' style={poppins.style} className='text-xl hover:text-blue-500 hover:underline'>Sign In?</Link>
                    <div className="min-w-full text-sm mt-8 px-3">
                        <div className='w-full'>
                            <div style={poppins.style} className='grid grid-cols-4 lg:grid-cols-5 lg:text-xl text-white bg-sky-600 opacity-10'>
                                <p className="hidden lg:flex w-full justify-center px-6 py-4">#</p>
                                <p className="flex w-full justify-start lg:justify-center px-4 lg:px-6 py-4">Links</p>
                                <p className="flex w-full justify-start lg:justify-center px-6 py-4">
                                    <span className='hidden lg:block'>Copy Nano Link</span>
                                    <span className='block lg:hidden'>Copy</span>
                                </p>
                                <p className="flex w-full justify-start lg:justify-center px-6 py-4">
                                    <span className='hidden lg:block'>Visit Url</span>
                                    <span className='block lg:hidden'>Visit</span>
                                </p>
                                <p className="flex w-full justify-start lg:justify-center px-2 lg:px-6 py-4">
                                    <span className='hidden lg:block'>Remove Link</span>
                                    <span className='lg:hidden block'>Remove</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {[1, 2, 3, 4, 5].map((curr, i) => {
                         return (
                            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }} key={i} style={comicNeue.style} className={`${curr % 2 == 0 ? 'bg-sky-100' : "bg-slate-100"} grid grid-cols-4 lg:grid-cols-5 border-b border-sky-200 ease-in-out animate-pulse`}>
                                <div style={poppins.style} className="hidden lg:flex w-full justify-center items-center px-6 py-4 font-bold text-sky-600 opacity-10">#</div>
                                <div className="flex w-full justify-start lg:justify-center items-center px-2 lg:px-6 py-4 text-slate-700 opacity-10">
                                    https://xyz.com
                                </div>
                                <div className="flex w-full justify-start lg:justify-center px-6 py-4">
                                    <div className={classList.cpyBtn} >
                                        <FaCopy />
                                        <span className='hidden lg:block'>copy nano link</span>
                                    </div>
                                </div>
                                <div className="flex w-full justify-start lg:justify-center px-6 py-4">
                                    <div className={classList.visitBtn}>
                                        <span className='hidden lg:block'>visit</span>
                                        <BsArrowUpRight />
                                    </div>
                                </div>
                                <div className="flex w-full justify-start lg:justify-center px-6 py-4">
                                    <div className={classList.dltBtn} style={poppins.style} >
                                        <span className='hidden lg:block'>delete</span>
                                        <RiDeleteBack2Fill />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </main>
            </section>
            <div className="fixed w-full h-full top-0 right-0  -z-10">
                <div className='absolute w-full h-full inset-0 bg-gradient-to-r z-10 from-[#fcfcfc]'></div>
                <Bg alt="landing pattern" src='/assets/svg/bg-svg2.svg' />
                <div className='absolute w-full h-full inset-0 bg-gradient-to-b z-10 from-[#fcfcfc]'></div>
            </div>
        </>
    )
}

export default LinkSkeleton