import React from 'react';
import {BrowserRouter} from 'react-router-dom'

import AppRouter from './components/AppRouter';
import BurgerMenu from './components/burgerMenu/BurgerMenu';
import Header from './components/header/Header';

import './resource/styles/style.scss';



function App() {
  return (
      <BrowserRouter>
        <BurgerMenu/>
        <Header/>
        <AppRouter/>
      </BrowserRouter>
  );
}

export default App;
