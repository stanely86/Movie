
import React, { useState } from 'react';

interface NewArrivalsProps {
    topMovie: TrendingMovie[];
}

interface TrendingMovie {
    imgUrl: string;
    title: string;
    rating: number;
    description: string;
    genre: string[];
    year: number;
    country: string;
}

export default function NewArrivals({ topMovie }: NewArrivalsProps) {
    const [carouselIndex, setCarouselIndex] = useState(0);

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
            <h2>New Arrivals</h2>
            <div className="flex items-center mb-4">
                <button onClick={handleCarouselPrev} className="p-2 border rounded bg-gray-300 mr-4">←</button>
                <div className="flex space-x-4">
                    {displayedMovies.map((movie, index) => (
                        <div key={index} className="flex items-start border p-4 rounded transition-all duration-300">
                            <img src={movie.imgUrl} width={100} height={100} alt={movie.title} className="mr-4" />
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold">{movie.title}</h2>
                                <p><strong>Year and Location:</strong> {movie.country}, {movie.year}</p>
                                <p><strong>Rating:</strong> {movie.rating}</p>
                                <p><strong>Genre:</strong> {movie.genre.join(", ")}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleCarouselNext} className="p-2 border rounded bg-gray-300 ml-4">→</button>
            </div>
        </div>
    );
}
