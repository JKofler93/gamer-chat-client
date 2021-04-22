import React from "react";
import { Link } from "react-router-dom";

function GameCard({ game }) {
    const { id, title, image } = game
    let sumRating = game.reviews.map(review => review.rating).reduce((a, b) => a + b, 0)
    let avgRating = (sumRating / game.reviews.length).toFixed(1)

    return (
        <div className="card">
            <Link to={`/games/${id}`}>
                <img className="banner" src={image} alt={title}/>
            </Link>
            <div className="card-content">
                <div className="card-title">
                    {title}
                </div>
                <div className="card-rating">
                    👍 {isNaN(avgRating) ? "0" : avgRating} ({game.reviews.length})
                </div>
            </div>
        </div>
    )
}

export default GameCard;
