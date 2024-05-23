"use client"
import React, { useState } from "react";

interface NameSearchResult {
    name: string;
    imgUrl: string;
    knownFor: string;
}

interface MovieSearchResult {
    title: string;
    imgUrl: string;
    releaseYear: string;
}

export default function TestSearch() {
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState("NAME");
    const [searchResults, setSearchResults] = useState<(NameSearchResult | MovieSearchResult)[]>([]);

    async function search() {
        const url = `https://imdb8.p.rapidapi.com/v2/search?searchTerm=${searchValue}&type=${searchType}&first=10`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '87d4b5ab45mshe5e256ac4029f3bp11b320jsnd250a4fe1339',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            handleSearchResults(result);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    function handleSearchResults(result: any) {
        if (searchType === "NAME") {
            const results: NameSearchResult[] = result.data.mainSearch.edges.map((edge: any) => ({
                name: edge.node.entity.nameText.text,
                imgUrl: edge.node.entity.primaryImage?.url || "No Image Available",
                knownFor: edge.node.entity.knownFor.edges[0]?.node.credit.category.text || "Unknown"
            }));
            setSearchResults(results);
        } else if (searchType === "MOVIE") {
            const results: MovieSearchResult[] = result.data.mainSearch.edges.map((edge: any) => ({
                title: edge.node.entity.titleText.text,
                imgUrl: edge.node.entity.primaryImage?.url || "No Image Available",
                releaseYear: edge.node.entity.releaseYear?.year || "Unknown"
            }));
            setSearchResults(results);
        }
    }

    return (
        <div className='searchFunction'>
            <div className='searchSection'>
                <div>
                    <p>Type Something to search</p>
                </div>
                <input
                    className='searchValue'
                    style={{ color: 'black', margin: '1rem', borderRadius: '0.5rem', padding: '0.5rem' }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ margin: '1rem', borderRadius: '0.5rem', padding: '0.5rem', color:"black" }}
                >
                    <option value="NAME">Actor</option>
                    <option value="MOVIE">Movie</option>
                </select>
                <button className="searchButton" onClick={search}>Search</button>
            </div>
            <div className="searchResult" style={{ width: '95%', padding: '10px', display: 'flex', flexWrap: 'wrap' }}>
                {searchResults.map((result, index) => (
                    <div className="searchResultCard" key={index} style={{ margin: '10px', borderRadius: '5px', border: '3px solid white', width: '200px', textAlign: 'center' }}>
                        {searchType === "NAME" ? (
                            <>
                                <p>{(result as NameSearchResult).name}</p>
                                {(result as NameSearchResult).imgUrl !== "No Image Available" && <img src={(result as NameSearchResult).imgUrl} alt={(result as NameSearchResult).name} style={{ width: '100%' }} />}
                                <p>{(result as NameSearchResult).knownFor}</p>
                            </>
                        ) : (
                            <>
                                <p>{(result as MovieSearchResult).title}</p>
                                {(result as MovieSearchResult).imgUrl !== "No Image Available" && <img src={(result as MovieSearchResult).imgUrl} alt={(result as MovieSearchResult).title} style={{ width: '100%' }} />}
                                <p>{(result as MovieSearchResult).releaseYear}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
