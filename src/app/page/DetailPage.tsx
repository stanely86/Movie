"use client";
import React, { useEffect, useState } from 'react';

interface DetailPageProps {
    movieId: string;
}

interface MovieDetail {
    title: string;
    imgUrl: string;
    rating: number;
    ratingCount: number;
    releaseDate: string;
    description: string;
}

export default function DetailPage({ movieId }: DetailPageProps) {
    const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        async function fetchMovieDetails() {
            const url = `https://imdb8.p.rapidapi.com/title/v2/get-overview?tconst=${movieId}&country=US&language=en-US`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '272c20de72msh7600bfac64d9ec4p10d181jsne0a2759f8116',
                    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                
                // Check if response is OK (status code 200)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log(result);

                // Ensure the response structure is as expected
                if (result && result.data && result.data.title) {
                    const movieData = {
                        title: result.data.title.titleText.text,
                        imgUrl: result.data.title.primaryImage.url,
                        rating: result.data.title.ratingsSummary.aggregateRating,
                        ratingCount: result.data.title.ratingsSummary.voteCount,
                        releaseDate: `${result.data.title.releaseDate.month}/${result.data.title.releaseDate.day}/${result.data.title.releaseDate.year}`,
                        description: result.data.title.plot.plotText.plainText,
                    };
                    setMovieDetail(movieData);
                } else {
                    throw new Error('Unexpected API response structure');
                }
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setError('Failed to fetch movie details. Please try again later.');
            }
        }

        fetchMovieDetails();
    }, [movieId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!movieDetail) {
        return <p>Loading...</p>;
    }

    return (
            <div className="w-2/3 p-4 flex justify-center">
                <img src={movieDetail.imgUrl} className='w-1/4' alt={movieDetail.title} />
                <div className='w-3/4 text-left'>
                    <h1 className='text-3xl'>{movieDetail.title}</h1>
                    <p><strong>Rating:</strong> {movieDetail.rating}</p>
                    <p><strong>Rating Count:</strong> {movieDetail.ratingCount}</p>
                    <p><strong>Release Date:</strong> {movieDetail.releaseDate}</p>
                    <p><strong>Description:</strong> {movieDetail.description}</p>
                </div>
            </div>
    );
}
