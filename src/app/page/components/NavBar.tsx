import { useState } from "react";

interface HomePageProps{
    setHasSearched: (hassearch: boolean) => void,
    handleSearchResults: (result: any) => void,
    searchType:string,
    setSearchType : (result: string) => void,
    reset: () => void
}


export default function NavBar({setHasSearched, handleSearchResults, searchType, setSearchType, reset}: HomePageProps){

    const [searchValue, setSearchValue] = useState("");

    async function search() {
        const url = `https://imdb8.p.rapidapi.com/v2/search?searchTerm=${searchValue}&type=${searchType}&first=10`;
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
            handleSearchResults(result);
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    return(
        <div className='flex items-center p-4 text-center bg-pink-950'>
                <h1 onClick={reset}  
                    className='w-1/2 hover-text-shadow  text-3xl text-center cursor-pointer'
                >
                MovieBuff</h1>

                <input
                    className='w-1/6 searchValue bg-white/30'
                    style={{ color: 'black', margin: '1rem', borderRadius: '0.5rem', padding: '0.5rem' }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button 
                    className="searchButton h-1/2 " 
                    onClick={search}>
                🔎Search</button>

                <select
                    className="bg-white/30"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{margin: '1rem', borderRadius: '0.5rem', padding: '0.5rem'}}
                >
                    <option className="bg-white/30" value="NAME ">Actor</option>
                    <option className="bg-white/30" value="MOVIE">Movie</option>
                </select>
                
        </div>
    )
}