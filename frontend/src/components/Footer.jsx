import { Link } from 'react-router-dom'
import {
  FaHeart,
  FaLock,
  FaRegEnvelope,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
} from 'react-icons/fa'

function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white pt-14 pb-10 text-slate-600">
      <div className="page-shell space-y-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-md">
                <FaShoppingBag className="text-lg" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                Shop<span className="text-teal-600">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              A modern multi-vendor marketplace connecting verified creators and independent brands with discerning shoppers across the globe.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 pt-1">
              <span className="flex items-center gap-1.5"><FaShieldAlt className="text-teal-600" /> Buyer Protection</span>
              <span className="h-3 w-px bg-slate-200" />
              <span className="flex items-center gap-1.5"><FaLock className="text-teal-600" /> SSL Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-sm">
            <h4 className="font-display font-bold text-slate-900 uppercase text-xs tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-teal-600 transition">Browse Products</Link></li>
              <li><Link to="/wishlist" className="hover:text-teal-600 transition">Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-teal-600 transition">Shopping Bag</Link></li>
              <li><Link to="/profile" className="hover:text-teal-600 transition">My Account</Link></li>
            </ul>
          </div>

          {/* Seller Central */}
          <div className="space-y-3 text-sm">
            <h4 className="font-display font-bold text-slate-900 uppercase text-xs tracking-wider">
              Sellers Hub
            </h4>
            <ul className="space-y-2">
              <li><Link to="/seller" className="hover:text-teal-600 transition">Merchant Dashboard</Link></li>
              <li><Link to="/seller/products" className="hover:text-teal-600 transition">Add New Product</Link></li>
              <li><Link to="/seller/orders" className="hover:text-teal-600 transition">Order Fulfillment</Link></li>
              <li><Link to="/register" className="hover:text-teal-600 transition">Register as Seller</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3 text-sm">
            <h4 className="font-display font-bold text-slate-900 uppercase text-xs tracking-wider">
              Assistance
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li className="flex items-center gap-2"><FaTruck className="text-teal-600 text-xs" /> Free Shipping &gt; ₹999</li>
              <li className="flex items-center gap-2">🔄 7-Day Hassle-Free Returns</li>
              <li className="flex items-center gap-2"><FaRegEnvelope className="text-teal-600 text-xs" /> support@shopsphere.dev</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-600">
            <span>Built with care for creators & shoppers</span>
            <FaHeart className="text-rose-500 text-[10px]" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
