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
import { check } from "./http/userAPI";
import { fetchGroups } from "./http/groupsAPI";

const App = observer(() => {
  const { user } = useContext(Context);

  useEffect(() => {
    check().then((data) => {
      user.setUser(data);
      user.setAuth(true);
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          {user.path === "/registration" || user.path === "/login" ? null : (
            <BurgerMenu />
          )}
          {user.path === "/registration" || user.path === "/login" ? null : (
            <Header />
          )}
          <div className="App__inner">
            <AppRouter />
          </div>
          {user.path === "/registration" || user.path === "/login" ? null : (
            <Footer />
          )}
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
});

export default App;
