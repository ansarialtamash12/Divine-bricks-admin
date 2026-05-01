
'use client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const NavbarLogin = () => {
  return (
    <nav className="flex items-center justify-between w-full h-20 px-4 bg-white shadow-lg md:px-10">
      <div className="flex items-center justify-center w-full md:justify-start">
        <Link href="../../">
          <Image
            src="/Zaddy_Logo2.png"
            alt="Zaddy Logo"
            width={220}
            height={70}
            className="object-contain"
          />
        </Link>
      </div>
    </nav>
  )
}

export default NavbarLogin
