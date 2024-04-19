import { Link } from "react-router-dom";

const NotFoundScreen = () => {
    return (
        <div className="extension-container flex flex-col items-center justify-center gap-4">
            <h2 className="text-primary-400 text-2xl font-bold">
                Page not found!
            </h2>
            <Link to="/" className="gradient-button">
                Get back
            </Link>
        </div>
    );
};

export default NotFoundScreen;
