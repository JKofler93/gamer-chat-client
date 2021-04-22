
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NavBar from './components/NavBar';
import GameContainer from './components/games/GameContainer';
import UserPage from './components/users/UserPage';
import GamePage from './components/games/GamePage';

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [games, setGames] = useState([])
  const [favoriteGames, setFavoriteGames] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [modalIsOn, setModalIsOn] = React.useState(false)
  const [gameAvg, setGameAvg] = useState(0)
  
  const history = useHistory()
  const location = useLocation()


console.log("HISTORY", history)
  const putModalOnScreen = () => {
    setModalIsOn(true)
  }

  const takeModalOffScreen = () => {
    setModalIsOn(false)
  }

  // Authenticate user and keep them 'logged in'
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      fetch('http://localhost:3000/profile', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(user => {
        setCurrentUser(user);
      })
    }
  }, [])

  // Logs in user
  const loginUser = (user) => {
    setCurrentUser(user)
    history.push("/games")
  }

  // logs out user
  const logoutUser = () => {
    setCurrentUser(null)
    localStorage.removeItem('token')
    history.push('/')
  }

  const handleFavoriteGame = (gameObj) => {
    fetch('http://localhost:3000/favorite_games', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        game_id: gameObj.id,
        user_id: currentUser.id,
        favorite: false
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.id !== null) {
        setFavoriteGames([...favoriteGames, data])
      } else {
        alert('You already like this game...')
      }
    })
  }

  const addFavoriteGame = (updatedFavoriteGame) => {
    const updatedFavoriteGames = favoriteGames.map(favoriteGame => {
      if(favoriteGame.id === updatedFavoriteGame.id) {
        return {...favoriteGame, favorite: updatedFavoriteGame.favorite}
      }
      return favoriteGame
    })
    setFavoriteGames(updatedFavoriteGames)
  }

  useEffect(() => {
    fetch('http://localhost:3000/games')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setGames(data)
    })
  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/favorite_games')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setFavoriteGames(data)
      })
  }, []);
  
  const getRandomGame = () => {
    let game = games[Math.floor(Math.random() * games.length)]
    history.push(`/games/${game.id}`)
  }

  let filterGames = games.filter(game => game.title.toLowerCase().includes(search.toLowerCase()))

  if (filter !== "all") {
    filterGames = filterGames.filter(game => game.genre === filter)
  }

  
  return (
      <div className="App">
        <NavBar getRandomGame={getRandomGame} filter={filter} setFilter={setFilter} setSearch={setSearch} currentUser={currentUser} logoutUser={logoutUser}/>
        <Switch>

          <Route exact path="/games">
            <GameContainer games={filterGames} />
          </Route>

          <Route exact path="/games/:id">
            <GamePage setGameAvg={setGameAvg} currentUser={currentUser} handleFavoriteGame={handleFavoriteGame}/>
          </Route>

          <Route exact path="/users/:id">
            <UserPage currentUser={currentUser} setFavoriteGames={setFavoriteGames} favoriteGames={favoriteGames} addFavoriteGame={addFavoriteGame}/>
          </Route>
          
          
          <Route exact path='/'>
            <Login loginUser={loginUser}/>
          </Route>

          <Route>
            <Register loginUser={loginUser}/>
          </Route>

          <Route path="*">
            <Redirect to="/games" />
          </Route>

        </Switch>
      </div>
  );
}

export default App;
