import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../features/cart/CartContext'

const links: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/try-on', label: 'Try On' },
  { to: '/sizing', label: 'Sizing' },
  { to: '/nfc', label: 'NFC' },
]

export function Navbar() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#F5A623]/25 bg-[#4B3B8E]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="group leading-none">
          <span className="font-serif text-[10px] font-bold uppercase tracking-[0.35em] text-[#F5A623]/80">
            Project
          </span>
          <span className="font-script block text-3xl text-[#F5A623] text-shadow-zine transition-transform group-hover:scale-105 md:text-4xl">
            Ephemera
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-4 py-2 font-serif text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'bg-[#F5A623] text-[#1a1a1a]'
                    : 'text-[#F4F0E8]/80 hover:text-[#F5A623]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/cart"
          className="relative ransom-strip !px-4 !py-2 text-xs"
        >
          Cart
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#4B3B8E] text-[10px] text-[#F5A623] ring-2 ring-[#F5A623]">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-[#F5A623]/15 px-4 py-2 md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `shrink-0 px-3 py-1 font-serif text-[10px] font-bold uppercase tracking-widest ${
                isActive ? 'bg-[#F5A623] text-[#1a1a1a]' : 'text-[#F4F0E8]/70'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
