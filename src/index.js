import React from "react";
import ReactDOM from "react-dom";
import App from "./app.jsx";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .catch(registrationError => console.log('Service Worker registration failed: ', registrationError))
  });
}

ReactDOM.render(<App />, document.getElementById('app'));