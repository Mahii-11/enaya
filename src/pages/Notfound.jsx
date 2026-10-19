import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
      <p className="text-6xl font-bold text-[#C8795A]">404</p>
      <h1 className="text-xl font-bold text-gray-900">Page not found</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        The page you are looking for doesn't exist or hasn't been added yet.
      </p>
      <Link
        to="/"
        className="mt-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
