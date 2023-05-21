import { useRouter } from "next/router";
import Head from "next/head";
import Bg from "../components/tools/Bg";


export default function Custom404() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <section className="max-h-screen relative overflow-hidden">
        <div className={`myContainer min-h-screen text-gray-800 justify-center lg:justify-start items-center'}`}>
          <div className="mt-0 lg:mt-44 max-w-md md:ml-20">
            <h1 className="text-6xl font-ubuntu font-bold text-gray-800">404 Page not found !</h1>
            <h2 className="text-2xl mt-2 text-gray-700">Sorry! the page you are looking for is temporarily unavailable or might be removed.</h2>
            <button type='button' className='my-8 py-2 bg-blue-500 px-4 rounded-md text-white lg:text-xl capitalize flex items-center' onClick={() => router.back()}>Go Back</button>
          </div>
        </div>
        <div className="fixed w-full h-full top-0 right-0 -z-40">
          <div className='absolute w-full h-full inset-0 bg-gradient-to-r z-10 from-[#fcfcfc]'></div>
          <Bg alt="landing pattern" src='/assets/svg/bg-svg2.svg' />
          <div className='absolute w-full h-full inset-0 bg-gradient-to-b z-10 from-[#fcfcfc]'></div>
        </div>
      </section>
    </>
  )
}