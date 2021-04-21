import React from 'react';
import { NavLink, useLocation } from "react-router-dom";

// const location = useLocation()

function NavBar({ getRandomGame, filter, setFilter, setSearch, currentUser, logoutUser }) {
    return (
        <div className="nav-bar">
            <div className="user-nav">
                {currentUser ? 
                    <div className="user-logged-in">
                        <div className="welcome-msg">
                            <NavLink exact to={`/users/${currentUser.id}`} className="nav-button">
                                Hey, {currentUser.username}!
                            </NavLink>
                            <button className="nav-button" onClick={logoutUser}>Logout</button>
                        </div>
                    </div>
                :
                    <div>
                        <NavLink exact to={'/'}>
                            Login
                        </NavLink>
                    </div>
                } 
            </div>
        </div>
    )
}

export default NavBar
