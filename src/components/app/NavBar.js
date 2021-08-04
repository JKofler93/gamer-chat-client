import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import navbarStyles from "../../styles/navbarStyles.css";

// const location = useLocation()

function NavBar({ getRandomGame, filter, setFilter, setSearch, currentUser, logoutUser }) {
    const history = useHistory()
    return (
        <div id="navbar">

            <div id="navbar-left">
                <button id="game-btn" className="nes-button is-warning" onClick={getRandomGame}>Game?</button> 
               { currentUser ? <button id="game-btn" className="nes-button is-warning" onClick={() => history.push("/games")}>Home</button> : null}
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
                        
                :

                    <div id="navbar-right">
                        <div id="closer-together">
                            <Link 
                                exact to={'/register'} 
                                id="user-btn">
                                <button id="user-btn">Register</button>
                            </Link>

                            <Link
                                exact to={'/'}
                                id="logout-btn" 
                            >
                                <button id="logout-btn">Log In</button>
                            </Link>
                        </div>
                    </div>
                }
                    
        </div>
    )
}

export default NavBar
