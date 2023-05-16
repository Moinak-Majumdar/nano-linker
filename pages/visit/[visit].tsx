import { useRouter } from "next/router";
import axios from 'axios';
import { useEffect } from 'react'
import Link from "next/link";
import Head from "next/head";
import { GetServerSidePropsContext } from 'next'
import Bg from "@/components/tools/Bg";
import { Poppins, Comic_Neue } from 'next/font/google'

const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })

interface props { link: string }
function Visit({ link }: props) {

    const router = useRouter();
    console.log(link)

    useEffect(() => {
        if (link !== 'expired') {
            router.push(link)
        }
    }, [])

    if (link === 'expired') {
        return (
            <>
            <Head>
                <title>Pease Sign In</title>
            </Head>
            <section className='min-w-[100vw] overflow-hidden relative'>
                <main className='myContainer min-h-screen flex items-center justify-center'>
                    <h2 style={poppins.style} className='my-8 text-sky-500 text-2xl'>The link you want to fetch is broken or expired. Please Sign In to save your generated links.</h2>
                    <h3>
                        <span style={poppins.style} className="font-bold mr-2 text-blue-500">Note :</span>
                        <span style={comicNeue.style}>Temporary generated links are expired after 12 hours.</span>
                    </h3>
                    <Link href='/auth/SignIn' style={poppins.style} className='text-xl hover:text-blue-500 hover:underline mt-4'>Sign In?</Link>
                    <Link href='/' style={poppins.style} className='text-xl hover:text-blue-500 hover:underline mt-4'>New link?</Link>
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

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { visit } = context.query;
    let link

    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_CONNECTION_API}/redirect`, { slug: visit }, { headers: { 'Content-Type': 'application/json' } })
        const data = res.data
        link = data['url']
        console.log(link)
        if (link !== 'expired') {
            return {
                redirect: { permanent: false, destination: link }
            }
        }
    } catch(err) {
        console.log(err)
    }

    return { props: { "link": link } };
}

export default Visit