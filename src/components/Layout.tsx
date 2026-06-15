import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { InstallPrompt } from './InstallPrompt'
import { SloganBar } from './SloganBar'
import { SLOGAN_LINE } from '../data/brand'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#4B3B8E]">
      <Navbar />
      <SloganBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t-2 border-[#F5A623]/25 bg-[#3D2F75] py-10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="font-script text-3xl text-[#F5A623]">Ephemera</p>
          <p className="mt-1 font-serif text-xs uppercase tracking-[0.2em] text-[#F4F0E8]/60">
          Beauty that returns to earth · {SLOGAN_LINE}
          </p>
          <p className="mt-4 text-xs text-[#F4F0E8]/40">
            Enactus Sleep · Home compostable bioplastic press-ons
          </p>
        </div>
      </footer>
      <InstallPrompt />
    </div>
  )
}
