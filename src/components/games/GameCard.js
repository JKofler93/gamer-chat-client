import React from 'react';
import { Link } from "react-router-dom";

function GameCard({ game }) {
    const { id, title, image } = game

    return (
        <div className="card">
            <Link to={`/games/${id}`}>
                <img className="poster" src={image} alt={title}/>
            </Link>
            <div className='card-content'>
                <div className="card-title">
                    {title}
                </div>
                <div className="card-rating">
                    {/* ⭐ {isNaN(averageRating) ? "0" : averageRating} ({game.reviews.length}) */}
                </div>
            </div>
        </div>
    )
}

export default GameCard;
