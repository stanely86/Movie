"use client";
import React, { useState, useEffect,forwardRef } from 'react';
import TrendingMovie from './components/TrendingMovie';
import NewArrivals from './components/NewArrivals';

interface HomePageProps {
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

const HomePage = forwardRef(function HomePage({cardClick}:HomePageProps, ref) {

    const [topMovie, setTopMovie] = useState<TrendingMovie[]>([]);

    useEffect(() => {
        async function fetchTrendingMovies() {
            const url = 'https://imdb8.p.rapidapi.com/title/v2/get-top-trending-video-trailers?first=5';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '272c20de72msh7600bfac64d9ec4p10d181jsne0a2759f8116',
		            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
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
                id:trailer.primaryTitle.id,
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
        <div> topMovie.id
            <TrendingMovie  cardClick={cardClick} topMovie={topMovie} />
            <NewArrivals ref={ref} cardClick={cardClick} topMovie={topMovie} />
        </div>
    );
}
) 

export default HomePage