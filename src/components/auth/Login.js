import React, {useState} from 'react';
import { NavLink, useHistory } from 'react-router-dom';

function Login({ loginUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const history = useHistory();

    const handleUserLogin = (e) => {
        e.preventDefault();

        const formInputData = {
            username,
            password
        }

        fetch('http://localhost:3000/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }, 
            body: JSON.stringify(formInputData),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.user)

            if(data.user) {
                loginUser(data.user)
                localStorage.setItem('token', data.token)
            } else {
                console.log(data)
                setErrors(data.error)
            }
        })
    }
    return (
        <div className='login'>
            <div className='login-border'>
                <form className='login-from' onSubmit={handleUserLogin}>
                    <h2>Welcome to GamerChat!</h2>
                        <label htmlFor='username'>Username</label>
                        <input
                            type='text'
                            id='username'
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />

                        <label htmlFor='password'>Password</label>
                        <input 
                            type='password'
                            id='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button type='submit'>Login</button>
                </form>
                <div className='errors'>{errors}</div>

                <button 
                className="submit-button">
                    <NavLink exact to="/register" className='submit-button'>Not a Member?</NavLink>
                </button>

                <button 
                    className='submit-button' 
                    onClick={() => history.push("/games")}
                > Wanna look around?</button>
            </div>
        </div>
    )
}

export default Login
