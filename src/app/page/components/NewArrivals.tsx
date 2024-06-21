"use client";
import React, { useState, forwardRef } from 'react';

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
            <h2 className='py-4 text-2xl sm:text-3xl'>New Arrivals</h2>
            <div className="flex items-center mb-4 w-full">
                <button onClick={handleCarouselPrev} className="p-2 border rounded bg-none mr-2 sm:mr-4 transition-all duration-500 hover:bg-pink-950">←</button>
                <div className="flex overflow-x-auto space-x-4 w-full justify-center">
                    {displayedMovies.map((movie, index) => (
                        <div 
                            onClick={() => cardClick(movie.id)} 
                            key={index} 
                            className="text-left w-48 sm:w-1/4 cursor-pointer flex flex-col items-center border p-2 sm:p-4 rounded transition-all duration-300 hover:bg-pink-950"
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
                <button onClick={handleCarouselNext} className="p-2 border rounded bg-none ml-2 sm:ml-4 hover:bg-pink-950 transition-all duration-500">→</button>
            </div>
        </div>
    );
});

export default NewArrivals;
