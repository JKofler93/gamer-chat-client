import React from 'react';
import GameCard from './GameCard';

function GameContainer({ games }) {

    const gamesArr = games.map(game => <GameCard key={game.id} game={game}/>)
    return (
        <>
            {gamesArr}
        </>
    )
}

export default GameContainer;
