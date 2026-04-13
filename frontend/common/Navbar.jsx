import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className='flex justify-between items-center p-4 bg-green-600 '>
      <div>
<p className='font-bold p-2 text-white text-2xl'>FitMyHealth</p>
      </div>
 
        <nav >
            <ul className="flex gap-6 text-white text-xl">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/records">Records</Link></li>
                <li><Link href="/feedback">Feedback</Link></li>
            </ul>
        </nav>
      <div className="flex gap-3">
        <button className='px-4 py-2 border-2  text-white hover:bg-green-500 rounded-2xl'>Sign Up</button>
        <button className='px-4 py-2 border-2  text-white hover:bg-green-500 rounded-2xl'>Login</button>
      </div>
    </div>
  )
}

export default Navbar
