import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { PIXELS_TEXT, SLAG_PIXELS } from '../App';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  gap: 1px;
  background-color: #000;
  padding: 1px;
  width: 500px;
  height: 500px;
  perspective: 1000px;
`;

const createShudder = () => keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) rotate(${Math.random() * 2 - 1}deg); }
  50% { transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) rotate(${Math.random() * 2 - 1}deg); }
  75% { transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) rotate(${Math.random() * 2 - 1}deg); }
`;

const violentExplode = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  20% {
    transform: scale(0.5) rotate(${() => Math.random() * 180 - 90}deg);
    opacity: 0;
  }
  40% {
    transform: scale(0) rotate(${() => Math.random() * 360 - 180}deg);
    opacity: 0;
  }
  60% {
    transform: scale(0) translate(${() => Math.random() * 200 - 100}%, ${() => Math.random() * 200 - 100}%);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const pixelateIn = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Pixel = styled.div.attrs(props => ({
  className: props.isColored ? 'colored' : '',
}))`
  background-color: ${props => props.color};
  width: 100%;
  height: 100%;
  transition: background-color 0.3s ease;
  transform-origin: center;
  position: relative;
  
  &.colored {
    animation: ${props => {
      if (props.$isShaking) return createShudder();
      if (props.$initializing) return pixelateIn;
      return 'none';
    }}
    0.15s
    linear
    ${props => props.$delay}s
    ${props => props.$isShaking ? 'infinite' : 'forwards'};
  }
`;

const PixelGrid = ({ pixels, gridSize }) => {
  const [animationState, setAnimationState] = React.useState('text');
  const [currentPixels, setCurrentPixels] = React.useState([]);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = React.useState(false);

  const scatterPixels = (pixelsToScatter) => {
    const newPixels = Array(gridSize * gridSize).fill("rgb(41, 41, 41)");
    const availableIndices = [...Array(gridSize * gridSize).keys()];
    
    const coloredPixels = pixelsToScatter.filter(pixel => pixel.color !== "rgb(41, 41, 41)");
    
    coloredPixels.forEach(pixel => {
      const randomIdx = Math.floor(Math.random() * availableIndices.length);
      const newIndex = availableIndices[randomIdx];
      availableIndices.splice(randomIdx, 1);
      newPixels[newIndex] = pixel.color;
    });
    
    return newPixels;
  };

  // Initial animation sequence
  useEffect(() => {
    // Start with PIXELS text
    const initialPixels = Array(gridSize * gridSize).fill("rgb(41, 41, 41)");
    PIXELS_TEXT.forEach(pixel => {
      const index = ((pixel.y - 1) * gridSize) + (pixel.x - 1);
      initialPixels[index] = pixel.color;
    });
    setCurrentPixels(initialPixels);

    // Animation sequence
    setTimeout(() => setAnimationState('shaking'), 800);
    
    // Scatter PIXELS text
    setTimeout(() => {
      const scatteredPixels = scatterPixels(PIXELS_TEXT);
      setCurrentPixels(scatteredPixels);
    }, 2000);

    // Quick transition to scattered slag pixels
    setTimeout(() => {
      const scatteredSlag = scatterPixels(SLAG_PIXELS);
      setCurrentPixels(scatteredSlag);
      setIsInitialAnimationComplete(true);
    }, 2800);
  }, []);

  // Immediate button response
  useEffect(() => {
    if (!isInitialAnimationComplete || !pixels) return;
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setCurrentPixels(pixels);
      
      // Check if it's the BUILD pattern
      const isBuilt = pixels.every((color, index) => {
        const y = Math.floor(index / gridSize) + 1;
        const x = (index % gridSize) + 1;
        const slagPixel = SLAG_PIXELS.find(p => p.x === x && p.y === y);
        return color === (slagPixel?.color || "rgb(41, 41, 41)");
      });

      if (isBuilt) setAnimationState('ready');
    });
  }, [pixels, isInitialAnimationComplete]);

  return (
    <Grid size={gridSize}>
      {currentPixels.map((color, index) => {
        const isColored = color !== "rgb(41, 41, 41)";
        return (
          <Pixel 
            key={`${index}-${color}`}
            color={color}
            isColored={isColored}
            $initializing={animationState === 'text'}
            $isShaking={animationState !== 'ready'}
            $delay={animationState === 'text' ? Math.random() * 0.2 : 0}
          />
        );
      })}
    </Grid>
  );
};

export default PixelGrid; 