import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page-shell rounded-lg bg-white p-10 text-center shadow-sm">
      <h1 className="text-4xl font-black">Page not found</h1>
      <Link className="btn-primary mt-5" to="/">Go shopping</Link>
    </div>
  )
}

export default NotFound
