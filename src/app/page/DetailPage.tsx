import React, { useEffect, useState, Suspense } from 'react';
import StarRatings from 'react-star-ratings';
import { ClipLoader } from 'react-spinners';
import { db } from '../../../firebase'
import { collection, onSnapshot, orderBy, query, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
const BarChart = React.lazy(() => import('./components/element/Bart'));

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

interface MovieComment {
    id: string;
    dateTime: any;
    comment: string;
    rate: number;
    movieId: string;
}

const DetailPage: React.FC<DetailPageProps> = ({ movieId }) => {
    const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [commentInput, setCommentInput] = useState<string>('');
    const [isCommenting, setIsCommenting] = useState<boolean>(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedCommentText, setEditedCommentText] = useState<string>('');
    const [movieComment, setMovieComment] = useState<MovieComment[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [editedRating, setEditedRating] = useState<number>(0);

    useEffect(() => {
        async function fetchMovieDetails() {
            const url = `https://imdb8.p.rapidapi.com/title/v2/get-overview?tconst=${movieId}&country=US&language=en-US`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '87d4b5ab45mshe5e256ac4029f3bp11b320jsnd250a4fe1339',
                    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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

                    // Fetch movie comments from Firebase
                    const collectionRef = collection(db, "movieRate");
                    const q = query(collectionRef, orderBy("dateTime"));
                    const unsubscribe = onSnapshot(q, (querySnapShot) => {
                        setMovieComment(querySnapShot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id,
                            dateTime: doc.data().dateTime?.toDate().getTime(),
                            comment: doc.data().comment,
                            rate: doc.data().rate,
                            movieId: doc.data().movieId
                        })));
                    });

                    return unsubscribe;
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


    const handleAddComment = async () => {
        if (commentInput.trim() !== '' && rating > 0) {
            try {
                await addDoc(collection(db, 'movieRate'), {
                    comment: commentInput,
                    rate: rating,
                    dateTime: new Date(),
                    movieId: movieId
                });
                setCommentInput('');
                setRating(0);
                setIsCommenting(false);
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    const handleEditComment = (id: string, comment: string, rate: number) => {
        setEditingCommentId(id);
        setEditedCommentText(comment);
        setEditedRating(rate);
    };

    const handleSaveEditedComment = async () => {
        if (editingCommentId && editedCommentText.trim() !== '') {
            try {
                const commentDoc = doc(db, "movieRate", editingCommentId);
                await updateDoc(commentDoc, {
                    comment: editedCommentText,
                    rate: editedRating,
                    dateTime: new Date(),
                });
                setEditingCommentId(null);
                setEditedCommentText('');
                setEditedRating(0);
            } catch (error) {
                console.error("Error updating comment:", error);
            }
        }
    };

    const handleDeleteComment = async (id: string) => {
        try {
            const commentDoc = doc(db, "movieRate", id);
            await deleteDoc(commentDoc);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    if (error) return <p>{error}</p>;
    if (!movieDetail) return <div className="flex justify-center items-center min-h-screen"><ClipLoader color={"#8d0e3f"} size={50} /></div>;

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

                <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><ClipLoader color={"#8d0e3f"} size={50} /></div>}>
                    <BarChart movieId={movieId} />
                </Suspense>

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
                            <StarRatings
                                numberOfStars={5}
                                changeRating={setRating}
                                size={10}
                                starRatedColor="#ffd700"
                                rating={rating}
                            />
                            <div className="flex justify-end mt-2">
                                <button onClick={handleAddComment} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                                <button onClick={() => setIsCommenting(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setIsCommenting(true)} className="px-4 py-2 bg-green-500 text-white rounded">Add Comment</button>
                    )}

                    <div className="comment-list mt-4">
                        {movieComment.map((comment) => (
                            movieId === comment.movieId &&

                            <div key={comment.id} className="p-2 border-b border-gray-300 justify-between items-center">
                                {editingCommentId === comment.id ? (
                                    <>
                                        <div className='flex w-full justify-between'>
                                            <textarea
                                                value={editedCommentText}
                                                onChange={(e) => setEditedCommentText(e.target.value)}
                                                className="w-80 p-2 border border-gray-300 rounded text-stone-950"
                                                rows={4}
                                            />
                                            <div className="flex w-10">
                                                <button onClick={handleSaveEditedComment} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Save</button>
                                                <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                                            </div>
                                        </div>
                                        <StarRatings
                                            key={comment.id}
                                            edit={true}
                                            changeRating={(newRating: number) => {
                                                setEditedRating(newRating)
                                            }}
                                            numberOfStars={5}
                                            size={10}
                                            starRatedColor="#ffd700"
                                            rating={editedRating}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className='flex w-full justify-between'>
                                            <p>{comment.comment}</p>
                                            <div>
                                            <button onClick={() => handleEditComment(comment.id, comment.comment, comment.rate)} className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">Edit</button>
                                            <button onClick={() => handleDeleteComment(comment.id)} className="px-3 py-1 bg-red-500 text-white rounded ">Delete</button>
                                            </div>
                                        </div>

                                        <StarRatings
                                            numberOfStars={5}
                                            edit={false}
                                            size={10}
                                            starRatedColor="#ffd700"
                                            rating={comment.rate}
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
