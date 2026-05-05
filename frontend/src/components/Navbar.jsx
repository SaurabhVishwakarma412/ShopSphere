import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FaBoxOpen, FaShoppingBag, FaShoppingCart, FaStore, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-bold ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}`

function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950">
          <span className="grid size-10 place-items-center rounded-lg bg-teal-700 text-white">
            <FaShoppingBag />
          </span>
          ShopSphere
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink className={navClass} to="/">
            Shop
          </NavLink>
          {user?.role === 'seller' && (
            <>
              <NavLink className={navClass} to="/seller">
                Dashboard
              </NavLink>
              <NavLink className={navClass} to="/seller/products">
                Products
              </NavLink>
              <NavLink className={navClass} to="/seller/orders">
                Orders
              </NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="btn-secondary relative px-3" to="/cart" title="Cart">
            <FaShoppingCart />
            {count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-rose-600 px-2 text-xs text-white">{count}</span>}
          </Link>
          {user ? (
            <>
              <Link className="btn-secondary hidden sm:inline-flex" to={user.role === 'seller' ? '/seller' : '/profile'}>
                {user.role === 'seller' ? <FaStore /> : <FaUserCircle />}
                {user.name}
              </Link>
              <button className="btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
