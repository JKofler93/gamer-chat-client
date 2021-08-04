import React, { useState, useEffect } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import ProfilePageStyles from "../../styles/ProfilePageStyles.css"

function UserPage({ currentUser, setFavoriteGames, favoriteGames }) {
    const [user, setProfileUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(null);
    console.log(favoriteGames)
    
    const params = useParams()
    // console.log(user.id)
    console.log(params)
    

    useEffect(() => {
        fetch(`http://localhost:3000/users/${params.id}`)
          .then(res => res.json())
          .then(user => {

            console.log(user)
            setProfileUser(user);
            setIsLoaded(true);
          })
          
    }, [params.id]);


    const deleteGameFromFavorites = (gameObj) => {
        //console.log(gameObj)
        fetch(`http://localhost:3000/favorite_games/${gameObj}`, {
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
                    <h1 className="username">
                        {user.username} 
                    </h1>
                </div>
                {currentUser.id === user.id ? <h3 className="fav-game-header">Your Favorite Games are...</h3> : <h3 className="fav-game-header">Their Favorite Games are...</h3>}
                <div className="game-list">
                        {favoriteGames.filter(favoriteGame =>
                            favoriteGame.user_id === user.id
                        )
                        .map(favoriteGame => 
                        <div key={favoriteGame.id} className="favorite-game-img-div">
                            <NavLink exact to={`/games/${favoriteGame.game.id}`}><img alt="game-banner" src={favoriteGame.game.image} className="favorite-game-img"/></NavLink>
                            {currentUser.id === user.id ? 
                                <div>
                                    <button className="delete-button" onClick={() => deleteGameFromFavorites(favoriteGame.id)}>🗑</button>
                                </div>
                                : null}
                        </div>)}
                </div>
                    {currentUser.id === user.id ? <h3 className="fav-game-header">Your Reviewed Games are...</h3> : <h3 className="fav-game-header">Their Reviewed Games are...</h3>}
                <div className="reviewed">
                        {user.reviews.map(review => 
                            <div key={review.id} className="user-review">
                                <div className="user-review-div">
                                <ul className="profile-ul">
                                    <li className="profile-li">{review.game.title} <br></br>{review.rating}⭐️</li>
                                </ul>
                                    {/* <h4 className="profile-review-game-title">{review.game.title}</h4>
                                    <h4 className="profile-review-game-rating">{review.rating}⭐️</h4> */}
                                    {/* <h4 className="user-review-content">{review.content}</h4> */}
                                </div>
                            </div>)
                        }
                </div>
            </div>
        </div>         
    )
}

export default UserPage
