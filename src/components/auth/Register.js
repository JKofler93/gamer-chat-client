import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

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

        fetch("http://localhost:3000/register", {
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
                localStorage.setItem("token", data.token)
            } else {
                setErrors(data.errors)
            }
        })
    }
    return (
        <div className="login">
            <div className="login-border">
                <form className="login-form" onSubmit={handleUserRegistration}>
                <h2 className="app-name">Gamer Chat 🕹 💬</h2>

                    <input
                        className="login-input-field"
                        placeholder="Create Username..."
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="login-input-field"
                        placeholder="Enter Password..."
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br></br>
                    <button type="submit" className="submit-button">Register!</button>
                </form>   
                    <div className="errors">{errors}</div>
                    <br/>
                    <button className="submit-button"><NavLink exact to="/" className="submit-button">Already a Member ?</NavLink></button>
                    <br/>
                    <button className="submit-button" onClick={() => history.push("/games")}>Look around?</button>
                </div>
        </div>
    )
}

export default Register
