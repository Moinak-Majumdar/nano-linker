import { useAuthState } from 'react-firebase-hooks/auth'
import Link from 'next/link'
import Image from 'next/image'
import { FaUserCircle } from 'react-icons/fa'
import { Roboto, Comic_Neue } from 'next/font/google'
import { auth } from '../../firebase/firebase'

const classList = {
    container: 'absolute top-0 right-0 min-w-full px-4 md:px-10 lg:px-16 xl:px-36 2xl:px-44 flex justify-end',
    btn: 'bg-sky-100 hover:bg-sky-200 focus:bg-sky-200 pr-1 sm:pr-2 pl-1 py-1 z-40 flex items-center mt-2',
    link1: 'z-40 flex items-center mt-2 px-2 lg:px-4 py-1 border-2 border-sky-600 hover:border-sky-300 focus:border-sky-300 hover:bg-sky-500 focus:bg-sky-600 lg:text-lg rounded-md text-sky-600 hover:text-slate-100 focus:text-slate-100 transition duration-700 ease-in-out',
    link2: 'z-40 flex items-center mt-2 px-2 lg:px-4 py-1 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 rounded-md text-slate-200 lg:text-lg transition duration-700 ease-in-out'
}
const roboto = Roboto({ subsets: ['latin'], weight: "400", display: 'swap' })
const comicNeue = Comic_Neue({ subsets: ['latin'], weight: '700', display: 'swap' })

const Navbar = () => {

    const [user, loading, error] = useAuthState(auth);

    

    if (user) {
        return (
            <section style={comicNeue.style} className={`${classList.container} gap-2`}>
                <div className={`${classList.btn} rounded-full`}>
                    {user?.photoURL && <Image src={user?.photoURL} alt='user-profile-img' height={30} width={30} className='rounded-full mr-0 sm:mr-2' />}
                    {user?.email && <span className='text-sm text-sky-600 hidden sm:flex' title={user.email}>{user.displayName}</span>}
                </div>
                <Link href='/links' className={`${classList.link1}`}>Nano Links</Link>
                <Link href='/auth/SignOut' className={`${classList.link2}`}>Logout</Link>
            </section>
        )
    } else {
        return (
            <section style={roboto.style} className={`${classList.container}`}>
                <Link href='/auth/SignIn' className={`${classList.btn} capitalize rounded-full border border-sky-300`}>
                    <FaUserCircle className='text-2xl mr-2 text-sky-500' />
                    <span className='text-sky-700'>Sign in</span>
                </Link>
            </section>
        )
    }
}

export default Navbar