import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import EditReviewForm from "./EditReviewForm"

function GamePage({ currentUser, handleFavoriteGame,  setGameAvg }) {
    const [game, setGame] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const params = useParams()

    useEffect(() => {
        fetch("http://localhost:3000/reviews")
          .then(res => res.json())
          .then(reviews => {
            
            const gameReviews = reviews.filter(review => review.game_id === parseInt(params.id))
            // console.log(gameReviews)
            setReviews(gameReviews.reverse());
          });
    }, [params.id])

    useEffect(() => {
        fetch(`http://localhost:3000/games/${params.id}`)
          .then(res => res.json())
          .then(game => {
              //console.log(game)
            setGame(game);
            console.log(game)
            setIsLoaded(true);
            let sumRating = game.reviews.map(review => review.rating).reduce((a, b) => a + b, 0)
            let avgRating = sumRating / game.reviews.length
            isNaN(avgRating) ? setAverage(0) : setAverage(avgRating.toFixed(1))
          });
    }, [params.id]);
    
    const addNewReview = (newReview) => {
        const newReviews = [newReview, ...reviews]
        setReviews(newReviews)
    }


    const submitNewReview = (e) => {
        e.preventDefault()

        fetch("http://localhost:3000/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ 
                user_id: currentUser.id,
                game_id: game.id,
                rating: parseFloat(rating),
                content: content
            })
        })
        .then(res => res.json())
        .then(newReview => {
            if(newReview.id !== null) {
                addNewReview(newReview)
            } else {
                alert("You already reviewed this game...")
            }
        })
    }

    const deleteReview = (reviewObj) => {

        fetch(`http://localhost:3000/reviews/${reviewObj.id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            const newReviews = reviews.filter(review => review.id !== reviewObj.id)
            setReviews(newReviews)
        })
    }

    useEffect(() => {
        let newSum = reviews.map(review => review.rating)
            .reduce((a, b) => a + b, 0)
        let newAvg = newSum / reviews.length

        if(isNaN(newAvg)) {
            setAverage(0)
            // setGameAvg(0)
        } else {
            setAverage(newAvg.toFixed(1))
            // setGameAvg(newAvg.toFixed(1))
        }
    }, [reviews])

    if (!isLoaded) return <h2>Loading...</h2>

    return (
        <div className="game-card">
            <div className="game-title">
                <h1>{game.title}</h1>
            </div>
                <div className="game-video">
                    <ReactPlayer
                        url={game.video}
                        height={460}
                        width={1100}
                        volume={0.5}
                        muted={true}
                        playing={true}
                    />
                </div>
                    <div className="game-banner">
                        <img src={game.banner} alt={game.title}/>
                    </div>
                        <div className="game-description">
                            <p>Genre: {game.genre}</p>
                            <p>ESRB Rating: {game.esrb_rating}</p>
                            <p>{game.description}</p>
                            {currentUser ? 
                                <button 
                                    className="favorite-game-button" 
                                    onClick={() => handleFavoriteGame(game) }
                                >One of your favs...?</button> 
                                : 
                                null }
                        </div>

        <div className="game-review">
            <h3>Reviews</h3>
            <ul>
                {reviews.map(review => 
                    <div className="review" key={review.id}>
                        {isEditing 
                        ? 
                        null 
                        :
                        <div className="review-top">
                            <div className="review-username">
                                <NavLink 
                                    exact 
                                    to={`/users/${review.user.id}`}>
                                {review.user.username}</NavLink>
                                <div className="review-content">
                                {review.content}
                                </div>
                            </div>
                        </div>}
                        {!currentUser 
                            ? 
                            null
                            : currentUser.id === review.user_id
                            ? 
                            <div>
                                    {/* onUpdateReview={handleUpdateReview} */}
                                {isEditing ? 
                                <EditReviewForm 
                                    id={review.id} 
                                    content={review.content} 
                                    rating={review.rating} 
                                    setReviews={setReviews}
                                    reviews={reviews} 
                                    setIsEditing={setIsEditing}
                                    isEditing={isEditing}
                                />
                                :  
                                null
                                }
                                    <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>📝</button>
                                    <button className="delete-button" onClick={() => deleteReview(review)}>🗑</button>
                                </div>
                                : null}
                    </div>
                )}
            </ul>

            {!currentUser 
            ?
            <div>To leave a comment you must be signed in...</div>
            : 
            !reviews.map(review => review.user_id).includes(currentUser.id)
            ?
            <div className="review form">
                <form onSubmit={submitNewReview}>
                    <label>
                    Leave a review:<br/>
                    <textarea 
                        name="content" 
                        value={content} 
                        onChange={event => setContent(event.target.value)}
                    />
                    <br/>
                    Your Rating:
                        <select
                            name="rating" 
                            value={rating} 
                            onChange={event => setRating(event.target.value)}
                        >   
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </label>
                    <br/>
                    <button
                        className="submit-btn"
                        type="submit"
                    >Post Review...</button>

                </form>
            </div>
            : 
            null
            }
        </div>
    </div>

    )
}

export default GamePage
