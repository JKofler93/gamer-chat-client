import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import EditReviewForm from "./EditReviewForm"
import GamePageStyles from '../../styles/GamePageStyles.css'

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
        <div className="game-page-card">
            <h1 className="game-page-title">{game.title}</h1>
            <div className="fav-button">{currentUser ? <button className="favorite-game-button" onClick={() => handleFavoriteGame(game)}>Add to Favorites</button> : <button className="favorite-game-button" onClick={() => handleFavoriteGame(game)}>Remove to Favorites</button> }</div>
            <div className="game-page-info">
                <div className="game-banner-div">
                    <img src={game.banner} alt={game.title} className="game-banner"/>
                </div>
                <div className="game-video-div">
                    <ReactPlayer
                    className="game-video"
                        url={game.video}
                        height={300}
                        width={600}
                        volume={0.5}
                        muted={true}
                        playing={true}
                    />
                </div>
                        <div className="game-description">
                            <p>Genre: {game.genre}</p>
                            <p>ESRB Rating: {game.esrb_rating}</p>
                            <p>{game.description}</p>
                        </div>

        <div className="game-review">
            <h3 className="reviews-heading">Reviews</h3>
            <ul>
                {reviews.map(review => 
                    <div className="review" key={review.id}>
                        {isEditing 
                        ? 
                        null 
                        :
                            <div className="review-div">
                                <NavLink exact className="review-username" to={`/users/${review.user.id}`} onMouseOver={() => console.log(review.user.id)}>{review.user.username}</NavLink>
                                <p className="review-content">{review.content}</p>
                            </div>
                        }
                        {!currentUser 
                        
                        ? 
                            
                            null

                        : currentUser.id === review.user_id
                            
                        ? 
                            <div>
                                {isEditing 
                                
                                ? 
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
                                    <div className="review-div">
                                        <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>📝</button>
                                        <button className="delete-button" onClick={() => deleteReview(review)}>🗑</button>
                                    </div>
                                }
                            </div>
                            
                            :
                            
                                null
                        }
                    </div>
                )}
            </ul>

            {!currentUser 
            ?
            <div>To leave a comment you must be signed in...</div>
            : 
            !reviews.map(review => review.user_id).includes(currentUser.id)
            ?
            <div className="review-form-div">
                <form onSubmit={submitNewReview} className="review-form">
                    <label className="leave-review">Leave a review:</label>
                    <br/>
                    <input 
                        className="review-input"
                        name="content" 
                        value={content} 
                        onChange={event => setContent(event.target.value)}
                    />
                    <br/>
                    <div className="custom-select">
                        <label className="your-rating">Your Rating:</label>
                            <select
                                className="select-selected"
                                name="rating" 
                                value={rating} 
                                onChange={event => setRating(event.target.value)}>  
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                    </div>
                    <br/>
                    <button className="submit-btn" type="submit">Post Review</button>

                </form>
            </div>
            : 
            null
            }
            </div>
        </div>
    </div>

    )
}

export default GamePage
