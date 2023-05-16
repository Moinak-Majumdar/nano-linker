import { AnimatePresence, Variants, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import Link from 'next/link';
import { toast } from 'react-toastify';
import React from 'react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import copy from 'copy-to-clipboard'
import { FaCopy } from 'react-icons/fa'
import { BsArrowUpRight } from 'react-icons/bs'
import { RiDeleteBack2Fill } from 'react-icons/ri'
import { Poppins, Comic_Neue } from 'next/font/google'
import { auth } from '@/firebase/firebase'
import { useFunction } from '@/context/FunctionContext'
import AuthError from '@/components/auth/AuthError'
import AuthLoading from '@/components/auth/AuthLoading'
import Bg from '@/components/tools/Bg'
import AnimatedHeading from '@/components/tools/AnimatedHeading'
import LinkSkeleton from '@/components/other/LinkSkeleton';
import EmptySkeleton from '@/components/other/EmptySkeleton';


const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })
const classList = {
    dltBtn: 'bg-pink-500 px-2 py-2 lg:py-1 rounded-full lg:rounded-md text-white text-xl capitalize flex items-center gap-2 z-10',
    cpyBtn: 'bg-blue-500 px-2 py-2 lg:py-1 rounded-full lg:rounded-md text-white text-xl capitalize flex items-center gap-2 z-10',
    visitBtn: 'w-fit flex text-blue-500 gap-2 items-center uppercase border-2 border-blue-400 rounded-full lg:rounded-md px-2 py-2 lg:py-1 lg:text-xl z-10 hover:scale-110 transition duration-300'
}

const Links = () => {

    type T_UseLinks = { url: string, slug: string, _id: string }
    const [UserLinks, setUserLinks] = useState<T_UseLinks[]>([])
    type T_User = { _id: string, email: string, sessionCount: number }
    const [User, setUser] = useState<T_User>()
    const [Origin, setOrigin] = useState<string>('')
    const router = useRouter()
    const [authUser, authLoading, authError] = useAuthState(auth)
    const { getUserLinks, deleteUserLink } = useFunction();

    useEffect(() => {
        const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
        setOrigin(origin)
        async function get() {
            const email = authUser?.email
            if (email) {
                const d = await getUserLinks(email)
                if (typeof d !== 'undefined') {
                    const { _id, email, sessionCount, links } = d['data']
                    setUser({ _id, email, sessionCount })
                    setUserLinks(links)
                }
            }
        }
        get()
    }, [authUser])

    function copyLink(slug: string) {
        toast(`Link copied at clipboard. 📋`)
        const link = `${Origin}/visit/${slug}`
        copy(link)
    }

    async function deleteLink(doc: {url: string, slug: string,  _id: string}, index: Number) {
        const ack = confirm(`Do you want to delete Nano Link no: ${index}`)
        if(ack) {
            if(User !== undefined) {
                const d = await deleteUserLink(User['_id'], User.email, doc)
                if (typeof d !== 'undefined') {
                    const { _id, email, sessionCount, links } = d['data']
                    setUser({ _id, email, sessionCount })
                    setUserLinks(links)
                    toast("Nano Link is removed.")
                }
            }
        }
    }

    if (authError) {
        return <AuthError />
    }

    if (authLoading) {
        return <AuthLoading />
    }

    if (!authUser) {
        // not login skeleton
        return <LinkSkeleton />
    } else {
       if(UserLinks.length > 0) {
        return (
            <>
                <Head>
                    <title>Your Nano Links</title>
                </Head>
                <section className='min-w-[100vw] overflow-hidden relative'>
                    <main className='myContainer min-h-screen flex items-center'>
                        <AnimatedHeading classList={`${comicNeue.className} my-2 text-blue-500 text-3xl mx-auto`} title='Your Nano Links' />
                        <h1></h1>
                        <div className="min-w-full text-sm mt-4">
                            <div className='w-full'>
                                <div style={poppins.style} className='grid grid-cols-4 lg:grid-cols-5 lg:text-xl text-white bg-sky-600'>
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
                            <div className='w-full'>
                                {UserLinks.map((curr, i) => {
                                    return (
                                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }} key={i} style={comicNeue.style} className="grid grid-cols-4 lg:grid-cols-5 border-b border-sky-200 ease-in-out hover:bg-sky-100 ">
                                            <p style={poppins.style} className="hidden lg:flex w-full justify-center items-center px-6 py-4 font-bold text-sky-600">{i + 1}</p>
                                            <p className="flex w-full justify-start lg:justify-center items-center px-2 lg:px-6 py-4 text-slate-700">
                                                <span className='hidden lg:block'>{`${Origin}/visit/${curr.slug}`}</span>
                                                <span style={poppins.style} className='mr-2 text-sky-600 font-bold block lg:hidden'>{i + 1}.</span>
                                                <span className='block lg:hidden'>{curr['slug']}</span>
                                            </p>
                                            <div className="flex w-full justify-start lg:justify-center px-6 py-4">
                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }} transition={{ duration: .3 }} type='button' onClick={() => copyLink(curr.slug)} className={classList.cpyBtn} >
                                                    <FaCopy />
                                                    <span className='hidden lg:block'>copy nano link</span>
                                                </motion.button>
                                            </div>
                                            <div className="flex w-full justify-start lg:justify-center px-6 py-4">
                                                <Link href={curr.url} target='_blank' type='button' className={classList.visitBtn}>
                                                    <span className='hidden lg:block'>visit</span>
                                                    <BsArrowUpRight />
                                                </Link>
                                            </div>
                                            <div className="flex w-full justify-start lg:justify-center px-6 py-4">
                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }} transition={{ duration: .3 }} type='button' className={classList.dltBtn} style={poppins.style} onClick={() => deleteLink({url: curr.url, slug: curr.slug, _id: curr['_id']}, i+1)} >
                                                    <span className='hidden lg:block'>delete</span>
                                                    <RiDeleteBack2Fill />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </main>
                </section>
                <div className="fixed w-full md:w-3/4 h-full top-0 right-0  -z-10">
                    <div className='absolute w-full h-full inset-0 bg-gradient-to-r z-10 from-[#fcfcfc]'></div>
                    <Bg alt="landing pattern" src='/assets/svg/bg-svg2.svg' />
                    <div className='absolute w-full h-full inset-0 bg-gradient-to-b z-10 from-[#fcfcfc]'></div>
                </div>
            </>
        )
       } else {
            return <EmptySkeleton />
       }
    }

}

export default Links