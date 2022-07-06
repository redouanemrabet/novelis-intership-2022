import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"
import {UserContextProvider} from './contexts/userContext'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <UserContextProvider>
    <App />
    </UserContextProvider>
  </BrowserRouter> 
);


reportWebVitals();
