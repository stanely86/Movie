"use client";
import React, { useState, useEffect } from 'react';
import NavBar from './conponment/NavBar';
import TrendingMovie from './conponment/TrendingMovie';
import NewArrivals from './conponment/NewArrivals';

interface TrendingMovie {
    imgUrl: string;
    title: string;
    rating: number;
    description: string;
    genre: string[];
    year: number;
    country: string;
}

export default function App() {
    const [topMovie, setTopMovie] = useState<TrendingMovie[]>([]);

    useEffect(() => {
        async function fetchTrendingMovies() {
            const url = 'https://imdb8.p.rapidapi.com/title/v2/get-top-trending-video-trailers?first=5';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '87d4b5ab45mshe5e256ac4029f3bp11b320jsnd250a4fe1339',
                    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log(result);
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
            const titleGenres = trailer.primaryTitle.titleGenres?.genres || [];
            const releaseDate = trailer.primaryTitle.releaseDate || {};
            const country = releaseDate.country ? releaseDate.country.id : 'Unknown';
            const year = releaseDate.year || 'Unknown';
            
            return {
                imgUrl: trailer.primaryTitle.primaryImage.url,
                title: trailer.primaryTitle.titleText.text,
                rating: trailer.primaryTitle.ratingsSummary.aggregateRating,
                description: trailer.description.value,
                genre: titleGenres.map((genre: any) => genre.genre.genreId),
                year,
                country,
            };
        });

        setTopMovie(results);
    }

    return (
        <div>
            <NavBar />
            <TrendingMovie topMovie={topMovie} />
            <NewArrivals topMovie={topMovie} />
        </div>
    );
}
