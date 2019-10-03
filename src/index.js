import React from "react";
import ReactDOM from "react-dom";
import App from "./app.jsx";

ReactDOM.render(<App />, document.getElementById('app'));

(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js', { scope: '/' })
            .then(() => console.log('Service Worker registered successfully.'))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
})();