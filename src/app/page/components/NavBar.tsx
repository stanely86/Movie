import { useState, useEffect } from "react";

interface NavBarProps {
    setHasSearched: (hasSearch: boolean) => void,
    handleSearchResults: (result: any) => void,
    searchType: string,
    setSearchType: (result: string) => void,
    reset: () => void,
    setLoading: (loading: boolean) => void // New prop for managing loading state
}

export default function NavBar({ setHasSearched, handleSearchResults, searchType, setSearchType, reset, setLoading }: NavBarProps) {
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    async function search() {
        setLoading(true); // Trigger loading animation
        const url = `https://imdb8.p.rapidapi.com/v2/search?searchTerm=${searchValue}&type=${searchType}&first=10`;
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
            handleSearchResults(result);
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false); // Stop loading animation
            setIsSearching(false); // Hide search overlay after search
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSearching(false); // Hide overlay when screen width is larger than phone mode
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='w-full flex justify-between sm:justify-normal items-center p-4 text-center bg-pink-950 relative'>
            <h1 onClick={reset} className='sm:w-1/2 hover-text-shadow text-3xl text-center cursor-pointer'>
                MovieBuff
            </h1>

            <input
                className={`w-1/6 searchValue text-white bg-white/30 hidden md:inline-block`}
                style={{ color: 'black', margin: '1rem', borderRadius: '0.5rem', padding: '0.5rem' }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
                className={`searchButton h-1/2 hidden md:inline-block`}
                onClick={search}>
                🔎Search
            </button>

            <select
                className="bg-white/30 hidden md:inline-block searchButton"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={{ margin: '1rem', borderRadius: '0.5rem', padding: '0.5rem' }}
            >
                <option className="bg-white/30 text-black" value="NAME">Actor</option>
                <option className="bg-white/30 text-black" value="MOVIE">Movie</option>
            </select>

            <button
                className="items-end searchButton h-1/2 md:hidden "
                onClick={() => setIsSearching(true)}>
                🔎Search
            </button>

            {isSearching && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                    <input
                        className="w-full searchValue  bg-white/30 mb-4"
                        style={{ color: 'black', borderRadius: '0.5rem', padding: '0.5rem' }}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <select
                        className="w-full bg-white/30 mb-4"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        style={{ borderRadius: '0.5rem', padding: '0.5rem' }}
                    >
                        <option className="bg-white/30" value="NAME">Actor</option>
                        <option className="bg-white/30" value="MOVIE">Movie</option>
                    </select>
                    <button
                        className="searchButton w-full bg-blue-500 text-white rounded py-2"
                        onClick={search}>
                        Search
                    </button>
                    <button
                        className="searchButton w-full bg-gray-500 text-white rounded py-2 mt-2"
                        onClick={() => setIsSearching(false)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
