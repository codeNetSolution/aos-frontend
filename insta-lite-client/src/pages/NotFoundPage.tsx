
const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-light">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold text-dark mb-4">404</h1>
                <p className="text-lg text-gray-600 mb-6">La page que vous cherchez n'existe pas ou a été supprimée.</p>
                <a
                    href="/"
                    className="px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300"
                >
                    Retour à l'accueil
                </a>
            </div>
        </div>
    );
};

export default NotFoundPage;
