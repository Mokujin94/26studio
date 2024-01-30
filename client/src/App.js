import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { ScrollContainer } from "react-nice-scroll";
import "react-nice-scroll/dist/styles.css";

import AppRouter from "./components/AppRouter";
import BurgerMenu from "./components/burgerMenu/BurgerMenu";
import Header from "./components/header/Header";

import "./resource/styles/style.scss";

import notificationAudio from "./resource/audio/notification.mp3";
import { observer } from "mobx-react-lite";
import { Context } from ".";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./store/AuthStore";
import { check } from "./http/userAPI";
import { fetchGroups } from "./http/groupsAPI";
import AddProjectModal from "./components/addProjectModal/AddProjectModal";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "./utils/consts";
import { CSSTransition } from "react-transition-group";
import ModalError from "./components/modalError/ModalError";
import NotAuthPopup from "./components/notAuthPopup/NotAuthPopup";
import ModalNewsUpload from "./components/modalNewsUpload/ModalNewsUpload";
import ModalComplete from "./components/modalComplete/ModalComplete";
import ProfileMiniatureModal from "./components/profileMiniatureModal/ProfileMiniatureModal";

const App = observer(() => {
  const { user, error, modal } = useContext(Context);

  useEffect(() => {
    check().then((data) => {
      user.setUser(data);
      user.setAuth(true);
    });
  }, []);

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_URL);

    socket.on("notification", (updateNotification) => {
      if (user.user.id && updateNotification.senderId === user.user.id) {
        return;
      } else {
        console.log("Получены новые уведомления:", updateNotification);

        new Audio(notificationAudio).play();
      }
    });
  }, [user.user.id]);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <CSSTransition
            in={user.modalProject}
            timeout={300}
            classNames="create-anim"
            mountOnEnter
            unmountOnExit
          >
            <div
              className="modal__bg"
              onClick={() => user.setModalProject(false)}
            >
              <AddProjectModal />
            </div>
          </CSSTransition>
          <CSSTransition
            in={user.modalNews}
            timeout={300}
            classNames="create-anim"
            mountOnEnter
            unmountOnExit
          >
            <div className="modal__bg" onClick={() => user.setModalNews(false)}>
              <ModalNewsUpload />;
            </div>
          </CSSTransition>
          <CSSTransition
            in={error.notAuthError}
            timeout={0}
            classNames="create-anim"
            mountOnEnter
            unmountOnExit
          >
            <div
              className="modal__bg"
              onClick={() => error.setNotAuthError(false)}
            >
              <NotAuthPopup />
            </div>
          </CSSTransition>
          <CSSTransition
            in={modal.modalComplete}
            timeout={300}
            classNames="popup-success"
            unmountOnExit
          >
            <div className="modal__complete">
              <ModalComplete completeMessage={modal.modalCompleteMessage} />
            </div>
          </CSSTransition>

          <CSSTransition
            in={modal.modalError}
            timeout={300}
            classNames="popup-success"
            unmountOnExit
          >
            <div className="modal__complete">
              <ModalError error={modal.modalErrorMessage} />
            </div>
          </CSSTransition>

          {user.path === REGISTRATION_ROUTE ||
          user.path === LOGIN_ROUTE ? null : (
            <BurgerMenu />
          )}
          {user.path === REGISTRATION_ROUTE ||
          user.path === LOGIN_ROUTE ? null : (
            <Header />
          )}
          <div className="App__inner">
            <AppRouter />
          </div>
          {user.path === REGISTRATION_ROUTE ||
          user.path === LOGIN_ROUTE ? null : (
            <Footer />
          )}
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
});

export default App;
