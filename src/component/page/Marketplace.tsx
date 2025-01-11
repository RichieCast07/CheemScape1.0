import React from 'react';
import '../../css/Marketplace.css';

interface NFTCardProps {
  name: string;
  price: string;
  img: string;
}

const nftData: NFTCardProps[] = [
  { name: 'NFT 1', price: '$100', img: 'https://via.placeholder.com/150' },
  { name: 'NFT 2', price: '$200', img: 'https://via.placeholder.com/150' },
  { name: 'NFT 3', price: '$300', img: 'https://via.placeholder.com/150' },
  { name: 'NFT 4', price: '$400', img: 'https://via.placeholder.com/150' },
  { name: 'NFT 5', price: '$500', img: 'https://via.placeholder.com/150' },
  { name: 'NFT 6', price: '$600', img: 'https://via.placeholder.com/150' },
];

const NFTGrid: React.FC = () => {
  return (
    <div className="nft-container">
      {nftData.map((nft, index) => (
        <div className="nft-card" key={index}>
          <img src={nft.img} alt={nft.name} className="nft-image" />
          <div className="nft-info">
            <h3 className="nft-name">{nft.name}</h3>
            <p className="nft-price">{nft.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTGrid;
