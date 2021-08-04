import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/gamesPage.css"
import { useHistory } from "react-router-dom";

function GameCard({ game }) {
    const { id, title, image } = game
    const history = useHistory()
    let sumRating = game.reviews.map(review => review.rating).reduce((a, b) => a + b, 0)
    let avgRating = (sumRating / game.reviews.length).toFixed(1)

    return (
            <div className="game-card" onClick={() => history.push(`/games/${id}`)}>
                    <img className="banner" src={image} alt={title}/>
                    <div className="game-info">
                        <h1 className="game-title"><strong>{title}</strong></h1>
                        <div className="game-rating">
                            <p><strong>{game.reviews.length} Reviews</strong></p> 
                            <p><strong>{isNaN(avgRating) ? "0" : avgRating} ⭐️ </strong></p>
                        </div>
                    </div>
            </div>
    )
}

export default GameCard;
