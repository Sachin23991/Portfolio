import React from 'react';
import ReactDOM from 'react-dom/client';
import AnimatedApp from './components/AnimatedApp.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <AnimatedApp />
    </React.StrictMode>
);
