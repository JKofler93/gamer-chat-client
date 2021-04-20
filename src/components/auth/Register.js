import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

function Register({ loginUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("")
    const history = useHistory()

    const handleUserRegistration = (e) => {
        e.preventDefault();

        const formInputData = {
            username,
            password
        }

        fetch('http://localhost:3000/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formInputData)
        })
        .then(res => res.json())
        .then(data => {
            if(data.user) {
                loginUser(data.user);
                localStorage.setItem('token', data.token)
            } else {
                setErrors(data.errors)
            }
        })
    }
    return (
        <div className='login'>
            <form className='login-form' onSubmit={handleUserRegistration}>
            <h2>Welcome to GamerChat!</h2>

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className='submit-button'>Register!</button>
            </form>   
                <div className="errors">{errors}</div>
                
                <button 
                className="submit-button">
                    <NavLink exact to="/" className='submit-button'>Already a Member ?</NavLink>
                </button>

                <button 
                    className='submit-button' 
                    onClick={() => history.push("/games")}
                > Wanna look around?</button>
        </div>
    )
}

export default Register
