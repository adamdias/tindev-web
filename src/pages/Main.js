import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';

import './Main.css';
import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import imgItsMatch from '../assets/itsamatch.png';

function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: match.params._id
        }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params._id]);

  async function handleDislike(_id) {
    await api.post(`devs/${_id}/dislikes`, null, {
      headers: {
        user: match.params._id
      }
    });

    setUsers(users.filter(user => user._id !== _id));
  }

  async function handleLike(_id) {
    await api.post(`devs/${_id}/likes`, null, {
      headers: {
        user: match.params._id
      }
    });

    setUsers(users.filter(user => user._id !== _id));
  }

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { user: match.params._id }
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [match.params._id]);

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>

      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Acabou :(</div>
      )}

      { matchDev && (
        <div className="match-container">
          <img src={imgItsMatch} alt="Deu Match!"/>
          <img className="avatar" src={matchDev.avatar} alt={matchDev.name}/>
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      ) }
    </div>
  );
}

export default Main;
