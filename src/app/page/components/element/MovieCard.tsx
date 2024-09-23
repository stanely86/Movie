import React from 'react';

interface MovieCardProps {
  movie: {
    id: string;
    imgUrl: string;
    title: string;
    rating: number;
    description: string; // Assuming you might want a description later
    genre: string[];
    year: number;
    country: string;
  };
  onClick?: (movieId: string) => void; // Optional click handler
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div
      onClick={onClick ? () => onClick(movie.id) : undefined}
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
  );
};

export default MovieCard;