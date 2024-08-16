import React, { useState, useEffect, useRef } from 'react';
import SwtichButton from './element/SwitchButton';
import MovieCard from './element/MovieCard';

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
        <div className="p-4 flex flex-col items-center w-full">
            <h2 className="py-4 text-2xl sm:text-3xl hover-text-shadow">New Arrivals</h2>
            <div
                className="flex items-center mb-4 w-11/12 relative overflow-x-auto cursor-pointer"
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {displayedMovies.length > 0 && (
                     <SwtichButton
                     action={handleCarouselPrev}
                     icon = "←"
                     />
                )} 
                <div className="flex py-4 space-x-4 sm:w-6/12 overflow-x: auto
">
                    {displayedMovies.map((movie, index) => (
                        <MovieCard
                            movie={movie}
                            index={index}
                            onClick={cardClick}
                        />
                    ))}
                </div>
                {displayedMovies.length > 0 && (
                    <SwtichButton
                    action={handleCarouselNext}
                    icon = "→" 
                    />
                )}
            </div>
        </div>
    );
};

export default NewArrivals;
