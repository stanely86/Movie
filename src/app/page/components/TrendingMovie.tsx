import React, { useState } from 'react';

interface TrendingMovieProps {
    topMovie: TrendingMovie[];
    cardClick: (id: string) => void;
}

interface TrendingMovie {
    id:string,
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

    const currentMovie = topMovie[currentIndex];

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

    return (
        <div 
            style={currentMovie && {
            backgroundImage: `url(${currentMovie.imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',    
            zIndex: 1,
            position: 'relative',
        }}>
            <div 
                style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 2,
                opacity: 1,
                position: 'relative',
                }}
                className="backdrop-blur-sm p-4 flex justify-center items-center flex-col bg-none">
                <h2 className='py-4 text-3xl'>Trending Movie</h2>
                {currentMovie && (
                    <div className={`flex items-start border-b pb-4 transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                        <img src={currentMovie.imgUrl} width={200} height={200} alt={currentMovie.title} className="mr-4" />
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">{currentMovie.title}</h2>
                            <p><strong>Rating:</strong> {currentMovie.rating}</p>
                            <p><strong>Description:</strong> {currentMovie.description}</p>
                            <p><strong>Genre:</strong> {currentMovie.genre.join(", ")}</p>
                            <button className='content-center p-4 text-center w-1/4 duration-500 bg-slate-900 hover:bg-slate-700' onClick={()=>cardClick(currentMovie.id)}>More Detail</button>
                        </div>
                        <div className="flex flex-col ml-4">
                            <button onClick={handlePrev} className="p-2 border rounded bg-gray-300 mb-2">↑</button>
                            <button onClick={handleNext} className="p-2 border rounded bg-gray-300">↓</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
