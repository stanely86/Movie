import React, { useState, useEffect, useRef } from 'react';

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
    const [displayedMovies, setDisplayedMovies] = useState(topMovie.slice(0, 4));
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState<number | null>(null);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDisplayedMovies([
            ...topMovie.slice(carouselIndex, carouselIndex + 4),
            ...topMovie.slice(0, Math.max(0, 4 - (topMovie.length - carouselIndex))),
        ].slice(0, 4));
    }, [carouselIndex, topMovie]);

    function handleCarouselPrev() {
        setCarouselIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : topMovie.length - 1));
    }

    function handleCarouselNext() {
        setCarouselIndex((prevIndex) => (prevIndex < topMovie.length - 1 ? prevIndex + 1 : 0));
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!isDragging) return;
        const x = e.clientX;
        const walk = (x - startX!) * 2; // Adjust the sensitivity of scrolling
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = scrollLeft - walk;
        }
    }

    function handleMouseUp() {
        setIsDragging(false);
    }

    function handleMouseLeave() {
        setIsDragging(false);
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className="py-4 text-2xl sm:text-3xl hover-text-shadow">New Arrivals</h2>
            <div
                className="flex items-center mb-4 w-full relative overflow-x-auto cursor-pointer"
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {displayedMovies.length > 0 && (
                    <button
                        onClick={handleCarouselPrev}
                        className="p-2 border rounded bg-none absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full sm:-translate-x-0 sm:ml-4"
                    >
                        ←
                    </button>
                )}
                <div className="flex py-4 space-x-4 sm:w-6/12">
                    {displayedMovies.map((movie, index) => (
                        <div
                            onClick={() => cardClick(movie.id)}
                            key={index}
                            className="mt-4 shadow-lg shadow-pink-950 transition duration-300 ease-in-out hover:shadow-pink-700 text-left h-2/3 cursor-pointer flex-shrink-0 rounded"
                            style={{ minWidth: 'calc(50% - 1rem)', maxWidth: 'calc(50% - 1rem)', marginRight: '1rem' }}
                        >
                            <img src={movie.imgUrl} alt={movie.title} className="w-full object-contain rounded mb-2 sm:max-h-60 md:max-h-80 lg:max-h-96" />
                            <div className="py-4 flex flex-col w-full text-center">
                                <h2 className="text-sm sm:text-lg font-bold">{movie.title}</h2>
                                <p className="text-xs sm:text-sm"><strong>Year and Location:</strong> {movie.country}, {movie.year}</p>
                                <p className="text-xs sm:text-sm"><strong>Rating:</strong> {movie.rating}</p>
                                <p className="text-xs sm:text-sm"><strong>Genre:</strong> {movie.genre.join(", ")}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {displayedMovies.length > 0 && (
                    <button
                        onClick={handleCarouselNext}
                        className="p-2 border rounded bg-none absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full sm:translate-x-0 sm:mr-4"
                    >
                        →
                    </button>
                )}
            </div>
        </div>
    );
};

export default NewArrivals;
