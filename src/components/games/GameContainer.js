import React from "react";
import GameCard from "./GameCard";

function GameContainer({ games }) {

    const gamesArray = games.map(game => <GameCard key={game.id} game={game}/>)
    return (
        <div className="game-grid">
            {gamesArray}
        </div>
    )
}

export default GameContainer;
