// SearchPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import HomePage from './HomePage';
import DetailPage from "./DetailPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ClipLoader from "react-spinners/ClipLoader";

// Types for search results
interface NameSearchResult {
    id: string;
    name: string;
    imgUrl: string;
    knownFor: string;
}

interface MovieSearchResult {
    id: string;
    title: string;
    imgUrl: string;
    releaseYear: string;
}

// Main component
export default function SearchPage() {
    const [searchType, setSearchType] = useState("NAME");
    const [searchResults, setSearchResults] = useState<(NameSearchResult | MovieSearchResult)[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function reset() {
        setHasSearched(false);
        setSearchResults([]);
        setSelectedMovieId(null);
        setLoading(false); // Reset loading state on reset
    }

    function handleSearchResults(result: any) {
        setLoading(false); // Stop loading when results are received
        if (searchType === "NAME") {
            const results: NameSearchResult[] = result.data.mainSearch.edges.map((edge: any) => ({
                id: "No Name Available",
                name: edge.node.entity.nameText.text,
                imgUrl: edge.node.entity.primaryImage?.url || "No Image Available",
                knownFor: edge.node.entity.knownFor.edges[0]?.node.credit.category.text || "Unknown"
            }));
            setSearchResults(results);
        } else if (searchType === "MOVIE") {
            const results: MovieSearchResult[] = result.data.mainSearch.edges.map((edge: any) => ({
                id: edge.node.entity.id,
                title: edge.node.entity.titleText.text,
                imgUrl: edge.node.entity.primaryImage?.url || "No Image Available",
                releaseYear: edge.node.entity.releaseYear?.year || "Unknown"
            }));
            setSearchResults(results);
        }
    }

    function handleClick(movieId: string) {
        setSelectedMovieId(movieId);
    }

    function resultToDetail(movieId: string) {
        setSearchResults([]);
        handleClick(movieId);
    }

    // Simulate a search action and show loader while waiting
    useEffect(() => {
        if (hasSearched) {
            setLoading(true); // Start loading when a search is initiated
        }
    }, [hasSearched]);

    return (
        <>
            {/* Search Section */}
            <NavBar
                reset={reset}
                setHasSearched={setHasSearched}
                setSearchType={setSearchType}
                handleSearchResults={handleSearchResults}
                searchType={searchType} setLoading={function (loading: boolean): void {
                    throw new Error("Function not implemented.");
                } }            />

            {/* Central Content */}
            <div className="content-container" style={{ padding: '10px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                    <ClipLoader color={"#8d0e3f"} size={50} />
                ) : hasSearched && searchResults.length > 0 ? (
                    <div className="searchResult gap-10 justify-center" style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                        {searchResults.map((result, index) => (
                            <div
                                onClick={() => resultToDetail(result.id)}
                                className="searchResultCard cursor-pointer"
                                key={index}
                                style={{ margin: '10px', borderRadius: '5px', border: '3px solid white', width: '200px', textAlign: 'center' }}
                            >
                                {searchType === "NAME" ? (
                                    <>
                                        <p>{(result as NameSearchResult).name}</p>
                                        {(result as NameSearchResult).imgUrl !== "No Image Available" && (
                                            <Image src={(result as NameSearchResult).imgUrl} alt={(result as NameSearchResult).name} width={200} height={200} />
                                        )}
                                        <p>{(result as NameSearchResult).knownFor}</p>
                                    </>
                                ) : (
                                    <>
                                        <p>{(result as MovieSearchResult).title}</p>
                                        {(result as MovieSearchResult).imgUrl !== "No Image Available" && (
                                            <Image src={(result as MovieSearchResult).imgUrl} alt={(result as MovieSearchResult).title} width={200} height={200} />
                                        )}
                                        <p>{(result as MovieSearchResult).releaseYear}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : selectedMovieId ? (
                    <DetailPage movieId={selectedMovieId} />
                ) : (
                    <HomePage cardClick={handleClick} />
                )}
            </div>

            <Footer />
        </>
    );
}
