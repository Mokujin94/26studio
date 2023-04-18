import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import ProjectStore from './store/ProjectStore';
import NewsStore from './store/NewsStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        project: new ProjectStore(),
        news: new NewsStore()
    }}>
        <App />
    </Context.Provider>
);


