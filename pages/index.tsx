import { motion } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import Image from 'next/image'
import { FormEvent, useState, useRef } from 'react'
import copy from 'copy-to-clipboard';
import { FaCopy } from 'react-icons/fa'
import { AiOutlineEnter } from 'react-icons/ai'
import { BsArrowUpRight } from 'react-icons/bs'
import { Roboto, Poppins } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Bg from '@/components/tools/Bg'
import AnimatedHeading from '@/components/tools/AnimatedHeading';
import { useFunction } from '@/context/FunctionContext';
import { auth } from '@/firebase/firebase'
import Head from 'next/head';


const Right = {
  closed: { x: 0, y: 0, opacity: .7, rotate: '-45deg' },
  open: { x: 100, y: 100, opacity: 1, rotate: '-45deg' }
}
const Right2 = {
  closed: { x: 50, y: 250, opacity: 0, rotate: '-30deg' },
  open: { x: -350, y: 400, opacity: 1, rotate: '-40deg' }
}

const classList = {
  btn: 'noSelection outline-none bg-slate-100 p-2 w-fit rounded-full absolute right-6 md:right-12 lg:right-1 top-20 mt-2 lg:mt-0 lg:top-1',
  ip: 'h-14 w-full border-2 border-teal-300 focus:border-teal-400 focus:ring-2 focus:ring-cyan-300 text-gray-700 outline-none rounded-full pl-6 pr-16',
  btnIcon: 'text-2xl lg:text-3xl text-cyan-400 animate-pulse',
  cpyBtn: 'bg-blue-500 px-2 py-1 rounded-md text-white lg:text-xl capitalize flex items-center gap-2 disabled:cursor-not-allowed disabled:text-gray-300 disabled:bg-blue-300',
  visitBtn: 'flex text-blue-500 gap-2 items-center uppercase border-2 border-blue-400 disabled:border-blue-200 rounded-md px-2 py-1 lg:text-xl disabled:text-blue-200 disabled:cursor-not-allowed'
}


const roboto = Roboto({ display: 'swap', weight: ['400', "500", '700'], subsets: ['latin'] })
const poppins = Poppins({ display: 'swap', weight: ['400'], subsets: ['latin'] })

export default function Home() {

  const [input, setInput] = useState<string>('')
  const [ReadOnlyControl, setReadOnlyControl] = useState<boolean>(false)
  const [CopySubmitControl, setCopySubmitControl] = useState<boolean>(false)
  const submitRef = useRef<HTMLButtonElement | null>(null)

  const [user] = useAuthState(auth)
  const { createLink, saveLinks } = useFunction();

  function clipboard() {
    toast.success('Nano link is copied at your clipboard. 📋', { theme: 'colored' })
    copy(input.toString());
    setReadOnlyControl(false)
    setCopySubmitControl(false)
    setInput('')
  }

  function visit() {
    if (typeof window !== undefined) {
      const newWindow = window.open(input, '_blank', 'noopener,noreferrer')
      setReadOnlyControl(false)
      setCopySubmitControl(false)
      setInput('')
      if (newWindow) newWindow.opener = null;
    }
  }

  async function handelSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const url = new URL(input)
      toast('Generating Nano link. 🚴')
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
      const status = user ? 'authenticated' : 'unauthenticated'
      const res = await createLink(url.href, status)
      if (res !== 'error') {
        user?.email ? await saveLinks(user.email, { url: url.href, slug: res }) : ''
        setReadOnlyControl(true)
        setCopySubmitControl(true)
        toast.success('Nano link is generated. 😃')
        setInput(`${origin}/visit/${res}`)
      } else {
        setReadOnlyControl(false)
        setCopySubmitControl(false)
        toast.error('Failed to generate Nano link. 😢', { theme: 'colored' })
      }
    } catch (error) {
      toast.error('Please enter a valid url.', {theme: 'colored'})
      console.log(error)
    }
  }

  return (
    <section className='max-w-[100vw] overflow-hidden relative'>
      <Navbar />
      <Head>
        <title>Nano Linker</title>
      </Head>
      <main className='myContainer min-h-screen justify-center lg:justify-between lg:flex-row items-center'>
        <div className='flex justify-center items-center flex-col'>
          <Image src='/assets/gif/bg1.gif' alt='bg' height={250} width={250} quality={75} priority={true} />
          <AnimatedHeading classList={`mt-2 lg:mt-8 text-center text-blue-500 text-3xl lg:text-4xl font-bold ${roboto.className}`} title='Nano Linker' />
        </div>
        <div style={roboto.style} className='flex flex-col items-center w-full relative'>
          <form onSubmit={handelSubmit} className='flex flex-col items-center w-full'>
            <div className='w-[90%] lg:w-[70%] flex flex-col mt-20 lg:mt-0 ml-0 lg:ml-auto'>
              <input value={input} onChange={(e) => setInput(e.target.value)} readOnly={ReadOnlyControl} placeholder='Enter / paste your url here. 🔗 ' type='text' className={classList.ip} required />
              <button ref={submitRef} type='submit' hidden />
            </div>
          </form>
          {CopySubmitControl ? <button onClick={clipboard} type='button' className={classList.btn} title='Copy Nano link' aria-label='Copy Link'>
            <FaCopy className={classList.btnIcon} />
          </button> : <button type='button' onClick={() => submitRef.current?.click()} className={classList.btn} aria-label='Submit'>
            <AiOutlineEnter className={classList.btnIcon} />
          </button>}
          <div className='ml-auto flex gap-2 mt-4 pr-6 lg:pr-4'>
            <button onClick={visit} type='button' className={classList.visitBtn} style={roboto.style} disabled={CopySubmitControl ? false : true}>
              <span>visit</span>
              <BsArrowUpRight />
            </button>
            <button onClick={clipboard} type='button' className={classList.cpyBtn} disabled={CopySubmitControl ? false : true}>
              <FaCopy />
              copy link
            </button>
          </div>
        </div>
        <div className='absolute bottom-0 right-0 flex w-full justify-center items-center'>
          <p style={poppins.style} className='text-sm text-sky-400 mb-2'>{user ? 'Visit nano links to check your saved links.' : 'Generated url are stored in a temporary storage, consider sign in to save.'}</p>
        </div>
      </main>
      {/* background */}
      <div className="absolute w-full md:w-3/4 h-full top-0 left-0  -z-10">
        <div className='absolute w-full h-full inset-0 bg-gradient-to-l z-10 from-[#fcfcfc]'></div>
        <Bg alt="landing pattern" src='/assets/svg/bg-svg2.svg' />
        <div className='absolute w-full h-full inset-0 bg-gradient-to-t z-10 from-[#fcfcfc]'></div>
      </div>
      <div className='overflow-hidden w-full -z-10' >
        <motion.div variants={Right} initial='closed' whileInView='open' transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse' }} className={`absolute bottom-[20%] -right-32 w-80 lg:w-[40%] h-12 lg:h-20 rounded-full bg-gradient-to-b to-sky-200 from-cyan-300 blur-[70px] -rotate-45`}></motion.div>
        {/* <motion.div  initial='closed' whileInView='open' transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }} className={`absolute top-[45%] lg:top-[30%] right-0 lg:right-32 w-80 h-16 rounded-xl bg-gradient-to-b from-teal-400 to-blue-500 blur-[70px]`}></motion.div> */}
      </div>
    </section>
  )
}
