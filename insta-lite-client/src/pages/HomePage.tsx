import React from 'react';

const HomePage = () => (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-light text-center min-h-screen bg-gray-100 pt-16">
        {/* Section de bienvenue */}
        <header className="flex flex-col items-center justify-center w-full py-12 bg-white shadow-md">
            <h1 className="text-5xl font-extrabold text-dark mb-4">Bienvenue sur Insta-lite</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
                Insta-lite est une plateforme moderne pour partager vos œuvres, découvrir de nouvelles inspirations et connecter avec d'autres artistes.
            </p>
            <a
                href="/portfolio/public"
                className="mt-6 px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300"
            >
                Commencez ici
            </a>
        </header>

        {/* Section Description générale */}
        <section className="flex flex-col items-center justify-center w-full py-16 bg-gray-50">
            <h2 className="text-3xl font-bold text-dark mb-6">Pourquoi Insta-lite ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
                        <span className="text-2xl font-bold">🎨</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Montrez votre talent</h3>
                    <p className="text-gray-600">
                        Partagez vos créations avec une communauté passionnée d'art et de design.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
                        <span className="text-2xl font-bold">🌍</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Connectez-vous</h3>
                    <p className="text-gray-600">
                        Rencontrez des artistes du monde entier et collaborez sur des projets passionnants.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
                        <span className="text-2xl font-bold">📈</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Faites grandir votre audience</h3>
                    <p className="text-gray-600">
                        Utilisez nos outils avancés pour atteindre un public plus large et développer votre carrière.
                    </p>
                </div>
            </div>
        </section>

        {/* Section Appel à l'action */}
        <section className="flex flex-col items-center justify-center w-full py-16 bg-white">
            <h2 className="text-3xl font-bold text-dark mb-4">Rejoignez-nous dès aujourd'hui !</h2>
            <p className="text-lg text-gray-600 max-w-2xl mb-6">
                Que vous soyez un artiste amateur ou professionnel, Insta-lite est l'endroit parfait pour exprimer votre créativité et vous connecter avec une communauté de passionnés.
            </p>
            <a
                href="/signup"
                className="px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300"
            >
                Créer un compte
            </a>
        </section>
    </div>
);

export default HomePage;
