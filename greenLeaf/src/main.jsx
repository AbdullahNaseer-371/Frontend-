import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import store from'./redux/store.js'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import ErrorBoundary from './errotBoundary.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Provider store={store}>
      <ErrorBoundary >
      <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
)
