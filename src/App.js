import React, { useEffect } from 'react';
import {useTranslation} from 'react-i18next';
import Router from './routers';
 

function App() {
  const { i18n } = useTranslation();
  const lang = localStorage.getItem("language") || "en";
  useEffect(() => {
    i18n.changeLanguage(lang);
   
  }, [lang, i18n]);

  return (
    <Router />
  );
}

export default App;
