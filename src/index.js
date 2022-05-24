import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "./i18n";
import { Provider as ReduxProvider } from 'react-redux';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTopButton from './component/ScrollToTopButton';
import { AuthProvider } from './contexts/JWTContext';
import { store } from './store/store';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);
root.render(
  <AuthProvider>
    <HelmetProvider>
    <ReduxProvider store={store} >

      <BrowserRouter>
        <Toaster position="top-right" />
        <ScrollToTopButton />
        <App />
      </BrowserRouter>
      </ReduxProvider>
    </HelmetProvider>
  </AuthProvider>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
