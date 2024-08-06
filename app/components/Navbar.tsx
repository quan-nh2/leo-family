import { Link } from "@remix-run/react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Leo&apos;s Family
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Post
          </Link>
        </div>
      </div>
    </nav>
  );
}
