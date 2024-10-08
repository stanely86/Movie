"use client";
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ClipLoader } from 'react-spinners';

const TrendingMovie = lazy(() => import('./components/TrendingMovie'));
const NewArrivals = lazy(() => import('./components/NewArrivals'));

interface HomePageProps {
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

export default function HomePage({ cardClick }: HomePageProps) {
    const [topMovie, setTopMovie] = useState<TrendingMovie[]>([]);

    useEffect(() => {
        async function fetchTrendingMovies() {
            const url = 'https://imdb8.p.rapidapi.com/title/v2/get-top-trending-video-trailers?first=5';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '272c20de72msh7600bfac64d9ec4p10d181jsne0a2759f8116',
                    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log('API Response:', result);
                handleTrendResults(result);
            } catch (error) {
                console.error(error);
            }
        }

        fetchTrendingMovies();
    }, []);

    function handleTrendResults(result: any) {
        const results: TrendingMovie[] = result.data.topTrendingTitles.edges.map((edge: any) => {
            const trailer = edge.node.item.latestTrailer;
            if (!trailer || !trailer.primaryTitle) {
                console.warn('Trailer or primaryTitle is missing:', trailer);
                return {
                    id: 'Unknown',
                    imgUrl: '',
                    title: 'Unknown',
                    rating: 0,
                    description: '',
                    genre: [],
                    year: 'Unknown',
                    country: 'Unknown',
                };
            }
    
            const movieId = trailer.primaryTitle.id || 'Unknown';
            const titleGenres = trailer.primaryTitle.titleGenres?.genres || [];
            const releaseDate = trailer.primaryTitle.releaseDate || {};
            const country = releaseDate.country ? releaseDate.country.id : 'Unknown';
            const year = releaseDate.year || 'Unknown';
    
            return {
                id: movieId,
                imgUrl: trailer.primaryTitle.primaryImage?.url || '',
                title: trailer.primaryTitle.titleText?.text || 'Unknown',
                rating: trailer.primaryTitle.ratingsSummary?.aggregateRating || 0,
                description: trailer.description?.value || '',
                genre: titleGenres.map((genre: any) => genre.genre.genreId) || [],
                year,
                country,
            };
        });
    
        setTopMovie(results);
    }
    

    return (
        <>
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><ClipLoader size={50} color={"#8d0e3f"} /></div>}>
                {topMovie.length > 0 ? (
                    <TrendingMovie topMovie={topMovie} cardClick={cardClick} />
                ) : (
                    <div className="flex justify-center items-center min-h-screen"><ClipLoader size={50} color={"#8d0e3f"} /></div>
                )}
            </Suspense>
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><ClipLoader size={50} color={"#8d0e3f"} /></div>}>
                {topMovie.length > 0 ? (
                    <NewArrivals topMovie={topMovie} cardClick={cardClick} />
                ) : (
                    <div className="flex justify-center items-center min-h-screen"><ClipLoader size={50} color={"#8d0e3f"} /></div>
                )}
            </Suspense>
        </>
    );
}
