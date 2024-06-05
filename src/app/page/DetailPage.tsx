import React from 'react';

interface DetailPage{
    movieId :string
}

export default async function DetailPage({movieId}:DetailPage){

    const url = 'https://imdb8.p.rapidapi.com/title/v2/get-details?tconst=tt16366836&country=US&language=en-US';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '272c20de72msh7600bfac64d9ec4p10d181jsne0a2759f8116',
            'x-rapidapi-host': 'imdb8.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }

    return(
        <h1>This is Detial Page</h1>
    )

}