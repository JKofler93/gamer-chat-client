import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

function UserPage({ addFavoriteGame, currentUser, setFavoriteGames, favoriteGames }) {
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(null);
    
    const params = useParams()
    

    useEffect(() => {
        fetch(`http://localhost:3000/users/${params.id}`)
          .then(res => res.json())
          .then(user => {

            console.log(user)
            setUser(user);
            setIsLoaded(true);
          })
          
    }, [params.id]);

    const makeGameAFavoriteGame = (favoriteGameObj) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/favoriteGames/${favoriteGameObj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                favorite: !favoriteGameObj.favorite
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            addFavoriteGame(data)
        })
    }

    const deleteGameFromFavorites = (gameObj) => {
        //console.log(gameObj)
        fetch(`http://localhost:3000/favoriteGames/${gameObj}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            const newGames = favoriteGames.filter(favoriteGame => favoriteGame.id !== gameObj)
            setFavoriteGames(newGames)
        })
    }


    if(!isLoaded) return <h2>Loading....</h2>

    return (
        <div>   
            <div className="user-page-info">
                <div className="user-head">
                    <div className="username">
                        {user.username} 
                    </div>
                </div>
                <div className="game-list">
                    <h3>Game List</h3> 
                    <ul>
                        {favoriteGames.filter(favoriteGame =>
                            favoriteGame.user_id === user.id
                        )
                        .map(favoriteGame => 
                        <div key={favoriteGame.id}>
                            <NavLink exact to={`/games/${favoriteGame.game.id}`}>{favoriteGame.game.title}</NavLink>
                            {!currentUser ? 
                                null 
                                : currentUser.id === favoriteGame.user_id
                                ? 
                                <div>
                                    {favoriteGame.favorite ? (
                                    <button className="emoji-button favorite active" onClick={() => makeGameAFavoriteGame(favoriteGame)}>★</button>
                                    ) : (
                                    <button className="emoji-button favorite" onClick={() => makeGameAFavoriteGame(favoriteGame)}>☆</button>
                                    )}
                                    <button className="delete-button" onClick={() => deleteGameFromFavorites(favoriteGame.id)}>🗑</button>
                                </div>
                                : null}
                        </div>)}
                    </ul>
                </div>
                <div className="reviewed">
                    <h3>Reviewed Games</h3>
                    <ul>
                        {user.reviews.map(review => 
                            <div key={review.id} className="user-review">
                                <div className="user-review-head ">
                                    <div className={review.rating <= 3 ? "rating-circle-red" : review.rating <= 7 ? "rating-circle-yellow" : "rating-circle"}>
                                        {review.rating}
                                    </div>
                                        <div className="user-game-title">
                                            {review.game.title}
                                        </div>
                                    
                                </div>
                                <div className="user-review-content">{review.content}</div>
                            </div>)
                        }
                    </ul>
                </div>
            </div>
        </div>         
    )
}

export default UserPage
