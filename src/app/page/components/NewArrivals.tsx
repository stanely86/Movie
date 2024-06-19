import React, { useState, useEffect, forwardRef } from 'react';

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

const NewArrivals = forwardRef(function NewArrivals({ topMovie, cardClick }: NewArrivalsProps, ref) {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Simulate a loading time of 1 second
        return () => clearTimeout(timer);
    }, []);

    function handleCarouselPrev() {
        setCarouselIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : topMovie.length - 1));
    }

    function handleCarouselNext() {
        setCarouselIndex((prevIndex) => (prevIndex < topMovie.length - 1 ? prevIndex + 1 : 0));
    }

    const displayedMovies = [
        ...topMovie.slice(carouselIndex, carouselIndex + 4),
        ...topMovie.slice(0, Math.max(0, 4 - (topMovie.length - carouselIndex))),
    ].slice(0, 4);

    return (
        <div className="p-4 flex justify-center items-center flex-col">
            <h2 className="py-4 text-3xl">New Arrivals</h2>
            {isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="flex items-center mb-4">
                    <button onClick={handleCarouselPrev} className="p-2 border rounded bg-none mr-4 transition-all duration-500 hover:bg-pink-950">←</button>
                    <div className="flex space-x-4">
                        {displayedMovies.map((movie, index) => (
                            <div
                                onClick={() => cardClick(movie.id)}
                                key={index}
                                className="text-left w-full sm:w-1/2 md:w-1/4 cursor-pointer flex flex-col items-start border p-4 rounded transition-all duration-300 hover:bg-pink-950"
                            >
                                <img src={movie.imgUrl} alt={movie.title} className="mb-4 w-full object-cover" />
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-bold">{movie.title}</h2>
                                    <p><strong>Year and Location:</strong> {movie.country}, {movie.year}</p>
                                    <p><strong>Rating:</strong> {movie.rating}</p>
                                    <p><strong>Genre:</strong> {movie.genre.join(", ")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleCarouselNext} className="p-2 border rounded bg-none ml-4 transition-all duration-500 hover:bg-pink-950">→</button>
                </div>
            )}
        </div>
    );
});

export default NewArrivals;
