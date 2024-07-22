import React, { useEffect, useState } from 'react';
import { BarChart } from './components/Bart';

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

const DetailPage: React.FC<DetailPageProps> = ({ movieId }) => {
    const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState<string>('');
    const [isCommenting, setIsCommenting] = useState<boolean>(false);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedCommentText, setEditedCommentText] = useState<string>('');

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

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

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
        if (commentInput.trim() !== '') {
            setComments([...comments, { id: comments.length + 1, text: commentInput }]);
            setCommentInput('');
            setIsCommenting(false);
        }
    };

    const handleCancelComment = () => {
        setCommentInput('');
        setIsCommenting(false);
        setEditingCommentId(null);
        setEditedCommentText('');
    };

    const handleEditComment = (id: number) => {
        const commentToEdit = comments.find(comment => comment.id === id);
        if (commentToEdit) {
            setEditingCommentId(id);
            setEditedCommentText(commentToEdit.text);
        }
    };

    const handleSaveEditedComment = () => {
        if (editedCommentText.trim() !== '') {
            setComments(comments.map(comment =>
                comment.id === editingCommentId ? { ...comment, text: editedCommentText } : comment
            ));
            setEditingCommentId(null);
            setEditedCommentText('');
        }
    };

    const handleDeleteComment = (id: number) => {
        setComments(comments.filter(comment => comment.id !== id));
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!movieDetail) {
        return <p>Loading...</p>;
    }

    return (
        <div className='w-full flex justify-center'>
            <div className="w-full sm:w-2/3 p-4 flex flex-col items-center content-center">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <img src={movieDetail.imgUrl} className='w-full sm:w-1/4 rounded-lg' alt={movieDetail.title} />
                    <div className='w-full sm:w-3/4 text-left'>
                        <h1 className='text-3xl'>{movieDetail.title}</h1>
                        <p className='text-2xl'><strong>Rating:</strong> {movieDetail.rating}</p>
                        <p className='text-2xl'><strong>Rating Count:</strong> {movieDetail.ratingCount}</p>
                        <p className='text-2xl'><strong>Release Date:</strong> {movieDetail.releaseDate}</p>
                        <p className='text-2xl'><strong>Description:</strong> {movieDetail.description}</p>
                    </div>
                </div>

                <BarChart movieId = {movieId}/>

                <div className="comment-section mt-4 w-full">
                    <h2 className="text-2xl text-gray-50">Share Your Opinion</h2>
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
                            <div key={comment.id} className="p-2 border-b border-gray-300 flex justify-between items-center">
                                {editingCommentId === comment.id ? (
                                    <textarea
                                        value={editedCommentText}
                                        onChange={(e) => setEditedCommentText(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded text-stone-950"
                                        rows={4}
                                    />
                                ) : (
                                    <p>{comment.text}</p>
                                )}
                                <div>
                                    {editingCommentId === comment.id ? (
                                        <div className="flex">
                                            <button onClick={handleSaveEditedComment} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Save</button>
                                            <button onClick={handleCancelComment} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex">
                                            <button onClick={() => handleEditComment(comment.id)} className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">Edit</button>
                                            <button onClick={() => handleDeleteComment(comment.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
