import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center p-8">
        <div className="text-8xl mb-4">♻️</div>
        <h1 className="text-6xl font-bold text-green-700 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-2">Oops! Page not found</p>
        <p className="text-gray-400 mb-8">This page seems to have been recycled!</p>
        <Link
          to="/"
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;