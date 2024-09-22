import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-2xl font-bold">My App</Link>
      <nav>
        <Button variant="ghost" asChild>
          <Link href="/about">About</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/contact">Contact</Link>
        </Button>
      </nav>
    </header>
  )
}

export default Header