import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { initializeGame, destroyGame } from '../../mainPhaser'; 
import '../../css/About.css';

const About: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [coins, setCoins] = useState<number>(0); 

  useEffect(() => {
    initializeGame('character-pixel');

    const storedCoins = localStorage.getItem('coins');
    setCoins(storedCoins ? parseInt(storedCoins) : 0);

    return () => {
      destroyGame();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCoins = localStorage.getItem('coins');
      setCoins(updatedCoins ? parseInt(updatedCoins) : 0);
    }, 500);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="username-container">
          <img src="../../assets/username.jpg" alt="Username" className="username-icon" />
          <div className="username">Username</div>
        </div>
        <ul>
        <li>
        <img src="../../assets/bolsa-papel.png" alt="Bolsa-papel" className="bolsa-papel-icon" />
            <span>Marketplace</span>
          </li>
          <li>
          <img src="../../assets/item.png" alt="Item" className="item-icon" />
            <span>Items</span>
          </li>
          <li>
          <img src="../../assets/engranaje.png" alt="Engranaje" className="engranaje-icon" />
            <span>Options</span>    
            </li>
        </ul>
      </div>

      <div className="main">
        <div className="top-bar">
          <img src="../../assets/object_coin.png" alt="Coin" className="coin-icon" />
          <span>{coins}</span> 
        </div>

        <div className="content-section">
          <div className="character-preview">
            <div className="character">
              <div id="character-pixel" className="character-pixel"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
