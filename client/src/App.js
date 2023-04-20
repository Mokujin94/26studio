import React, { useContext, useEffect, useState } from 'react';
import {BrowserRouter} from 'react-router-dom'
import { ScrollContainer } from 'react-nice-scroll';
import 'react-nice-scroll/dist/styles.css';

import AppRouter from './components/AppRouter';
import BurgerMenu from './components/burgerMenu/BurgerMenu';
import Header from './components/header/Header';

import './resource/styles/style.scss';
import { observer } from 'mobx-react-lite';
import { Context } from '.';



const App = observer(() => {

  const {profile} = useContext(Context)

  // const [padding, setPadding] = useState(false)

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (document.body.clientHeight > window.innerHeight) {

  //       setPadding(true)
  //     } else {
  //       setPadding(false)
  //     }
  //   }, 510)

  // }, [profile.selectedMenu])


  return (
    <div className='App'>
      <BrowserRouter>
        <BurgerMenu/>
        <Header/>
        <AppRouter/>
      </BrowserRouter>
    </div>

  );
})

export default App;
