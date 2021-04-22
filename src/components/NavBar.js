import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

// const location = useLocation()

function NavBar({ getRandomGame, filter, setFilter, setSearch, currentUser, logoutUser }) {
    return (
        <div id="navbar">

                    <div id="navbar-left">
                        <button id="game-btn" onClick={getRandomGame}>Random Game?</button>    
                    </div>

                    <div id="navbar-center">
                        <input id="navbar-search" type="text" placeholder="Search Games..." onChange={(e) => setSearch(e.target.value)}/>
                    </div>

                    {currentUser ? 

                        <div id="navbar-right">

                            <div id="closer-together">
                                <Link 
                                    exact to={`/users/${currentUser.id}`} 
                                    id="user-btn">
                                    <button id="user-btn">Profile</button>
                                </Link>

                                    <button 
                                        id="logout-btn" 
                                        onClick={logoutUser}
                                    >Logout</button>
                                    
                            </div>
                        </div>
                        
                : null 
                }
                    
        </div>
    )
}

export default NavBar
