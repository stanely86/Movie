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

interface Comment {
    id: number;
    text: string;
}

export default function DetailPage({ movieId }: DetailPageProps) {
    const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState<string>('');
    const [isCommenting, setIsCommenting] = useState<boolean>(false);

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

    const handleAddComment = () => {
        setIsCommenting(true);
    };

    const handleSaveComment = () => {
        setComments([...comments, { id: comments.length + 1, text: commentInput }]);
        setCommentInput('');
        setIsCommenting(false);
    };

    const handleCancelComment = () => {
        setCommentInput('');
        setIsCommenting(false);
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!movieDetail) {
        return <p>Loading...</p>;
    }

    return (
        <div className='w-full flex justify-center'>
            <div className="w-2/3 p-4 flex flex-col items-center content-center">
                <div className="flex justify-center">
                    <img src={movieDetail.imgUrl} className='w-1/4' alt={movieDetail.title} />
                    <div className='w-3/4 text-left'>
                        <h1 className='text-3xl'>{movieDetail.title}</h1>
                        <p><strong>Rating:</strong> {movieDetail.rating}</p>
                        <p><strong>Rating Count:</strong> {movieDetail.ratingCount}</p>
                        <p><strong>Release Date:</strong> {movieDetail.releaseDate}</p>
                        <p><strong>Description:</strong> {movieDetail.description}</p>
                    </div>
                </div>
                <div className="comment-section mt-4 w-full">
                    <h2 className="text-2xl">Comments</h2>
                    {isCommenting ? (
                        <div className="comment-form mt-2">
                            <textarea
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-stone-950"
                                rows={4}
                                placeholder="Write your comment here..."
                            />
                            <div className="flex justify-end mt-2">
                                <button onClick={handleSaveComment} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                                <button onClick={handleCancelComment} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={handleAddComment} className="px-4 py-2 bg-green-500 text-white rounded">Add Comment</button>
                    )}
                    <div className="comment-list mt-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="p-2 border-b border-gray-300">
                                <p>{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
