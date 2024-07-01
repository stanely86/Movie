import React, { useState, useEffect, useRef } from 'react';

interface TrendingMovieProps {
    topMovie: TrendingMovie[];
    cardClick: (id: string) => void;
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

export default function TrendingMovie({ topMovie, cardClick }: TrendingMovieProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const currentMovie = topMovie[currentIndex];
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };
        
        // Set initial value
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handlePrev() {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : topMovie.length - 1));
            setIsAnimating(false);
        }, 300);
    }

    function handleNext() {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex < topMovie.length - 1 ? prevIndex + 1 : 0));
            setIsAnimating(false);
        }, 300);
    }

    function handleSelectMovie(index: number) {
        if (index !== currentIndex) {
            setIsAnimating(true);
            const startIndex = currentIndex;
            const direction = index > currentIndex ? 1 : -1;
            const interval = setInterval(() => {
                setCurrentIndex(prevIndex => {
                    const nextIndex = prevIndex + direction;
                    if ((direction === 1 && nextIndex > index) || (direction === -1 && nextIndex < index)) {
                        setIsAnimating(false);
                        clearInterval(interval);
                        return index;
                    }
                    return nextIndex;
                });
            }, 100);
        }
    }
    
    

    function handleTouchStart(event: React.TouchEvent) {
        touchStartX.current = event.touches[0].clientX;
    }

    function handleTouchMove(event: React.TouchEvent) {
        touchEndX.current = event.touches[0].clientX;
    }

    function handleTouchEnd() {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const distance = touchStartX.current - touchEndX.current;
            if (distance > 50) {
                handleNext();
            } else if (distance < -50) {
                handlePrev();
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    }

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full transition-all duration-500"
            style={currentMovie && {
                backgroundImage: `url(${currentMovie.imgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
                position: 'relative',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 2,
                    opacity: 1,
                    position: 'relative',
                }}
                className="backdrop-blur-ssm p-4 flex flex-col justify-center items-center bg-none"
            >
                {currentMovie && (
                    <div
                        className={`w-full sm:w-2/3 md:w-1/2 pb-4 transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start">
                            <img
                                src={currentMovie.imgUrl}
                                alt={currentMovie.title}
                                className="rounded-lg w-full sm:w-1/3 sm:mr-4 object-cover mb-4 sm:mb-0"
                            />
                            <div className="w-full sm:w-2/3 gap-4 flex flex-col text-left">
                                <h2 className="text-lg sm:text-xl font-bold">{currentMovie.title}</h2>
                                <p><strong>Rating:</strong> {currentMovie.rating}</p>
                                <p><strong>Description:</strong> {currentMovie.description}</p>
                                <p><strong>Genre:</strong> {currentMovie.genre.join(", ")}</p>
                                <button
                                    className="rounded-lg content-center p-4 text-center duration-500 bg-pink-950 hover:bg-pink-700"
                                    onClick={() => cardClick(currentMovie.id)}
                                    aria-label={`More details about ${currentMovie.title}`}
                                >
                                    More Detail
                                </button>
                            </div>
                            {!isMobile && (
                                <div className="flex flex-col space-y-4 ml-4">
                                    {topMovie.map((movie, index) => (
                                        <button
                                            key={movie.id}
                                            onClick={() => handleSelectMovie(index)}
                                            className={`p-2 border rounded ${index === currentIndex ? 'bg-pink-700 text-white' : 'bg-none'} transition-all duration-500 hover:bg-pink-950`}
                                            aria-label={`Select movie ${movie.title}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {isMobile && (
                    <div className="w-full flex justify-center mt-4 flex-wrap">
                        {topMovie.map((movie, index) => (
                            <button
                                key={movie.id}
                                onClick={() => handleSelectMovie(index)}
                                className={`p-2 mx-1 mb-2 border rounded ${index === currentIndex ? 'bg-pink-700 text-white' : 'bg-none'} transition-all duration-500 hover:bg-pink-950`}
                                aria-label={`Select movie ${movie.title}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
