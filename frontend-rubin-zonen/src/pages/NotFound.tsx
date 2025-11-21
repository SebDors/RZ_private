import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">404</h1>
      <p className="text-2xl mt-4 text-gray-600 dark:text-gray-400">Page Not Found</p>
      <p className="mt-2 text-gray-500 dark:text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <Link to="/dashboard">
        <Button className="mt-4">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
