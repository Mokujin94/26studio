import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ScrollContainer } from "react-nice-scroll";
import "react-nice-scroll/dist/styles.css";

import AppRouter from "./components/AppRouter";
import BurgerMenu from "./components/burgerMenu/BurgerMenu";
import Header from "./components/header/Header";

import "./resource/styles/style.scss";
import { observer } from "mobx-react-lite";
import { Context } from ".";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./store/AuthStore";

const App = observer(() => {
  // let location = useLocation();
  // console.log(location);

  const { user } = useContext(Context);

  const { profile } = useContext(Context);

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
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <BurgerMenu />
          {user.path === "/registration" || user.path === "/login" ? null : <Header />}
          <AppRouter />
          {user.path === "/registration" || user.path === "/login" ? null : <Footer />}
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
});

export default App;
