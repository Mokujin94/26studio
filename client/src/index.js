import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import ProjectStore from './store/ProjectStore';
import NewsStore from './store/NewsStore';
import ProfileStore from './store/ProfileStore';
import GroupsStore from './store/GroupsStore';
import ErrorStore from './store/ErrorStore';
import ModalStore from './store/ModalStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      project: new ProjectStore(),
      news: new NewsStore(),
      profile: new ProfileStore(),
      groups: new GroupsStore(),
      error: new ErrorStore(),
      modal: new ModalStore(),
    }}
  >
    <App />
  </Context.Provider>
);
