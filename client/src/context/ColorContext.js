import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

const ColorContext = createContext();

// Predefiniowane palety kolorów
const colorPalettes = {
  default: {
    name: 'Domyślna',
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#333',
    textLight: '#555',
    background: '#f8f9fa',
    white: '#ffffff',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107'
  },
  red: {
    name: 'Czerwona',
    primary: '#e74c3c',
    secondary: '#c0392b',
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    background: '#fdf2f2',
    white: '#ffffff',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12'
  },
  green: {
    name: 'Zielona',
    primary: '#27ae60',
    secondary: '#2ecc71',
    gradient: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    background: '#f2fdf5',
    white: '#ffffff',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12'
  },
  blue: {
    name: 'Niebieska',
    primary: '#3498db',
    secondary: '#2980b9',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    background: '#f2f8fd',
    white: '#ffffff',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12'
  },
  purple: {
    name: 'Fioletowa',
    primary: '#9b59b6',
    secondary: '#8e44ad',
    gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    background: '#faf5fd',
    white: '#ffffff',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12'
  },
  orange: {
    name: 'Pomarańczowa',
    primary: '#f39c12',
    secondary: '#e67e22',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    background: '#fdfaf2',
    white: '#ffffff',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12'
  }
};

export const useColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};

export const ColorProvider = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState('default');

  useEffect(() => {
    // Wczytaj zapisaną paletę z localStorage
    const savedPalette = localStorage.getItem('colorPalette');
    if (savedPalette && colorPalettes[savedPalette]) {
      setCurrentPalette(savedPalette);
    }
  }, []);

  // Funkcja do przyciemniania hexów w gradientach
  function darkenGradient(gradient, percent) {
    return gradient.replace(/#([0-9a-fA-F]{6})/g, (m, hex) => {
      let r = parseInt(hex.slice(0,2), 16);
      let g = parseInt(hex.slice(2,4), 16);
      let b = parseInt(hex.slice(4,6), 16);
      r = Math.max(0, Math.floor(r * (1 - percent)));
      g = Math.max(0, Math.floor(g * (1 - percent)));
      b = Math.max(0, Math.floor(b * (1 - percent)));
      return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    });
  }

  useEffect(() => {
    // Ustaw CSS custom properties dla scrollbara
    const palette = colorPalettes[currentPalette];
    if (palette) {
      document.documentElement.style.setProperty('--scrollbar-gradient', darkenGradient(palette.gradient, 0.25));
      document.documentElement.style.setProperty('--scrollbar-gradient-hover', darkenGradient(palette.gradient, 0.35));
    }
  }, [currentPalette]);

  const changePalette = (paletteName) => {
    if (colorPalettes[paletteName]) {
      setCurrentPalette(paletteName);
      localStorage.setItem('colorPalette', paletteName);
    }
  };

  const getCurrentColors = () => {
    return colorPalettes[currentPalette];
  };

  const getAllPalettes = () => {
    return colorPalettes;
  };

  return (
    <ColorContext.Provider value={{
      currentPalette,
      colors: getCurrentColors(),
      changePalette,
      getAllPalettes
    }}>
      <ThemeProvider theme={getCurrentColors()}>
        {children}
      </ThemeProvider>
    </ColorContext.Provider>
  );
}; 