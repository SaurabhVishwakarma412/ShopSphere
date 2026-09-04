import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  FaBars,
  FaHeart,
  FaShoppingBag,
  FaShoppingCart,
  FaStore,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

const navClass = ({ isActive }) =>
  `relative px-3.5 py-1.5 text-sm font-semibold transition-all rounded-full ${
    isActive
      ? 'bg-teal-50 text-teal-700 shadow-xs'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
  }`

function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
      <div className="page-shell flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
            <FaShoppingBag className="text-xl" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1 font-display">
              Shop<span className="text-teal-600">Sphere</span>
            </span>
            <span className="block text-[10px] tracking-widest font-semibold uppercase text-slate-600">
              Curated Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex bg-slate-100/60 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
          <NavLink className={navClass} to="/">
            Explore Store
          </NavLink>
          {user?.role === 'customer' && (
            <NavLink className={navClass} to="/wishlist">
              Wishlist
            </NavLink>
          )}
          {user?.role === 'seller' && (
            <>
              <span className="h-4 w-px bg-slate-300 mx-1" />
              <NavLink className={navClass} to="/seller">
                Dashboard
              </NavLink>
              <NavLink className={navClass} to="/seller/products">
                Inventory
              </NavLink>
              <NavLink className={navClass} to="/seller/orders">
                Orders
              </NavLink>
            </>
          )}
        </nav>

        {/* Actions / Right side */}
        <div className="flex items-center gap-2.5">
          {/* Wishlist Icon for customers / guests */}
          {user?.role !== 'seller' && (
            <Link
              to="/wishlist"
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Saved Items"
            >
              <FaHeart className="text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            className="relative p-2.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
            to="/cart"
            title="Cart"
          >
            <FaShoppingCart className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 text-[11px] font-bold text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Auth state */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                className="hidden sm:inline-flex items-center gap-2 py-1.5 px-3 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-100 text-sm font-semibold text-slate-800 transition"
                to={user.role === 'seller' ? '/seller' : '/profile'}
              >
                {user.role === 'seller' ? (
                  <span className="flex items-center gap-1.5 text-teal-700">
                    <FaStore /> Seller
                  </span>
                ) : (
                  <FaUserCircle className="text-teal-600 text-base" />
                )}
                <span className="max-w-[100px] truncate">{user.name}</span>
              </Link>
              <button
                className="btn-secondary text-xs px-3 py-2 text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="btn-secondary text-sm hidden sm:inline-flex" to="/login">
                Sign In
              </Link>
              <Link className="btn-primary text-sm" to="/register">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-xl hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 shadow-xl transition-all">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className="py-2 text-slate-700 font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Explore Store
            </Link>
            {user?.role === 'customer' && (
              <Link
                to="/wishlist"
                className="py-2 text-slate-700 font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                My Wishlist ({wishlistCount})
              </Link>
            )}
            {user?.role === 'seller' && (
              <>
                <div className="text-xs uppercase font-bold text-slate-600 pt-2">Seller Hub</div>
                <Link
                  to="/seller"
                  className="py-1.5 text-slate-700 font-semibold pl-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/seller/products"
                  className="py-1.5 text-slate-700 font-semibold pl-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Products Inventory
                </Link>
                <Link
                  to="/seller/orders"
                  className="py-1.5 text-slate-700 font-semibold pl-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Orders Management
                </Link>
              </>
            )}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to={user.role === 'seller' ? '/seller' : '/profile'}
                    className="py-2 text-teal-700 font-bold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Signed in as {user.name} ({user.role})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary w-full text-rose-600 justify-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    className="btn-secondary flex-1 justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary flex-1 justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
