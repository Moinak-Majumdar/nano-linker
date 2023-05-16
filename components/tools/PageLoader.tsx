import { motion, Variants } from 'framer-motion'
import { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ weight: ["400"], subsets: ['latin'] })

const outer: Variants = {
    initial: {
        transition: { staggerChildren: 0.5 }
    },
    animate: {
        transition: { staggerChildren: 0.5 }
    }
}
const inner: Variants = {
    initial: {
        x: -20, opacity: 0, scale: 0.5
    },
    animate: {
        x: 0, opacity: 1, scale: 1, transition: {
            repeat: Infinity, repeatType: 'loop'
        }
    }
}

interface props { children: ReactNode }
const PageLoader = ({ children }: props) => {
    const router = useRouter()
    const [Loading, setLoading] = useState<boolean | undefined>()

    useEffect(() => {
        const start = (url: string) => (url !== router.asPath) && setLoading(true)
        const end = (url: string) => setLoading(false)
        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', end);
        router.events.on('routeChangeError', end)

        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', end);
            router.events.off('routeChangeError', end)
        }
    })

    if (Loading) {
        return (
            <section className='min-w-[100vw] min-h-screen flex justify-center items-center flex-col bg-gradient-to-br from-sky-200 to-slate-200'>
                <motion.div initial={{rotate: 0, scale: .9, opacity: .8}} animate={{rotate: 360, scale:1.1, opacity: 1}} transition={{repeat: Infinity, type: 'spring', duration: .5}} className='w-14 h-14 bg-blue-600 rounded-full' style={{ clipPath: 'polygon(0 0,50% 50%,0 100%, 100% 100%, 50% 50%, 100% 0)'}}></motion.div>
                <motion.div variants={outer} initial='initial' animate='animate' className='flex justify-center gap-6 mt-8'>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                    <motion.div variants={inner} className='w-4 h-14 bg-sky-500'></motion.div>
                </motion.div>
                <h1 style={poppins.style} className='text-3xl mt-8 text-blue-500'>Loading ...</h1>
            </section>
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}

export default PageLoader