import React, { useState, useEffect } from 'react';

interface NewArrivalsProps {
    topMovie: TrendingMovie[];
    cardClick: (movieId: string) => void;
}

interface TrendingMovie {
    id: string;
    imgUrl: string;
    title: string;
    rating: number;
    description: string;
    genre: string[];
    year: number;
    country: string;
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ topMovie, cardClick }) => {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [displayedMovies, setDisplayedMovies] = useState(topMovie.slice(0, 4));
    const [newMovieIndex, setNewMovieIndex] = useState<number | null>(null);

    useEffect(() => {
        setDisplayedMovies([
            ...topMovie.slice(carouselIndex, carouselIndex + 4),
            ...topMovie.slice(0, Math.max(0, 4 - (topMovie.length - carouselIndex))),
        ].slice(0, 4));
        setNewMovieIndex(null);
    }, [carouselIndex, topMovie]);

    function handleCarouselPrev() {
        if (!isTransitioning) {
            setDirection('prev');
            setIsTransitioning(true);
            setTimeout(() => {
                setCarouselIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : topMovie.length - 1));
                setIsTransitioning(false);
                setNewMovieIndex(null); // Reset new movie index
            }, 500); // Duration of the transition
        }
    }

    function handleCarouselNext() {
        if (!isTransitioning) {
            setDirection('next');
            setIsTransitioning(true);
            setTimeout(() => {
                setCarouselIndex((prevIndex) => (prevIndex < topMovie.length - 1 ? prevIndex + 1 : 0));
                setIsTransitioning(false);
                setNewMovieIndex(carouselIndex + 3 >= topMovie.length ? 0 : carouselIndex + 3); // Set index of newly added movie
            }, 500); // Duration of the transition
        }
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className='py-4 text-2xl sm:text-3xl'>New Arrivals</h2>
            <div className="flex items-center mb-4 w-full overflow-x-auto relative">
                {displayedMovies.length > 0 && (
                    <button onClick={handleCarouselPrev} className="p-2 border rounded bg-none absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full sm:-translate-x-0 sm:ml-4 transition-all duration-500 hover:bg-pink-950">
                        ←
                    </button>
                )}
                <div className="flex space-x-4 min-w-full">
                    {displayedMovies.map((movie, index) => (
                        <div
                            onClick={() => cardClick(movie.id)}
                            key={index}
                            className={`mt-4 shadow-lg shadow-pink-950 hover:shadow-pink-700 text-left h-2/3 sm:w-1/5 cursor-pointer flex-shrink-0 sm:p-4 rounded transition-all duration-500
                            ${isTransitioning && direction === 'next' && index === 0 ? 'fade-out-left' : ''}
                            ${isTransitioning && direction === 'next' && index > 0 ? 'move-left' : ''}
                            ${isTransitioning && direction === 'prev' && index === displayedMovies.length - 1 ? 'fade-out-right' : ''}
                            ${isTransitioning && direction === 'prev' && index < displayedMovies.length - 1 ? 'move-right' : ''}
                            ${newMovieIndex === index ? 'slide-in' : ''}`}
                        >
                            <img src={movie.imgUrl} alt={movie.title} className="w-full object-cover rounded mb-2" style={{ maxHeight: '150px' }} />
                            <div className="flex flex-col w-full text-center">
                                <h2 className="text-sm sm:text-lg font-bold">{movie.title}</h2>
                                <p className="text-xs sm:text-sm"><strong>Year and Location:</strong> {movie.country}, {movie.year}</p>
                                <p className="text-xs sm:text-sm"><strong>Rating:</strong> {movie.rating}</p>
                                <p className="text-xs sm:text-sm"><strong>Genre:</strong> {movie.genre.join(", ")}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {displayedMovies.length > 0 && (
                    <button onClick={handleCarouselNext} className="p-2 border rounded bg-none absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full sm:translate-x-0 sm:mr-4 hover:bg-pink-950 transition-all duration-500">
                        →
                    </button>
                )}
            </div>
            <style jsx>{`
                .fade-out-left {
                    animation: fadeOutLeft 0.5s forwards;
                }
                .fade-out-right {
                    animation: fadeOutRight 0.5s forwards;
                }
                .move-left {
                    animation: moveLeft 0.5s forwards;
                }
                .move-right {
                    animation: moveRight 0.5s forwards;
                }
                .slide-in {
                    animation: slideIn 0.5s forwards;
                }
                @keyframes fadeOutLeft {
                    0% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0; transform: translateX(-100%); }
                }
                @keyframes fadeOutRight {
                    0% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0; transform: translateX(100%); }
                }
                @keyframes moveLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes moveRight {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                @keyframes slideIn {
                    0% { opacity: 0; transform: translateX(${direction === 'next' ? '100%' : '-100%'}); }
                    100% { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default NewArrivals;
