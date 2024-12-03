import React from 'react';
import styled from 'styled-components';
import { SLAG_PIXELS } from '../App';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.5rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.color};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Controls = ({ setPixels, gridSize }) => {
  const handleBuild = () => {
    // Create array of background pixels
    const newPixels = Array(gridSize * gridSize).fill("rgb(41, 41, 41)");
    
    // Place slag pixels in their correct positions
    SLAG_PIXELS.forEach(pixel => {
      const index = ((pixel.y - 1) * gridSize) + (pixel.x - 1);
      newPixels[index] = pixel.color;
    });
    
    setPixels([...newPixels]);
  };

  const handleShake = () => {
    // Create array of background pixels
    const newPixels = Array(gridSize * gridSize).fill("rgb(41, 41, 41)");
    const availableIndices = [...Array(gridSize * gridSize).keys()];
    
    // Get all colored pixels from slag image
    const coloredPixels = SLAG_PIXELS.filter(pixel => pixel.color !== "rgb(41, 41, 41)");
    
    // Randomly scatter slag pixels
    coloredPixels.forEach(pixel => {
      const randomIdx = Math.floor(Math.random() * availableIndices.length);
      const newIndex = availableIndices[randomIdx];
      availableIndices.splice(randomIdx, 1);
      newPixels[newIndex] = pixel.color;
    });
    
    setPixels([...newPixels]);
  };

  return (
    <ButtonContainer>
      <Button color="#4CAF50" onClick={handleBuild}>BUILD</Button>
      <Button color="#f44336" onClick={handleShake}>SHAKE</Button>
    </ButtonContainer>
  );
};

export default Controls; 