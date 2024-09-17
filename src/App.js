import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';
import LoginPage from './pages/login-page/LoginPage';
import CreateStepView from './pages/create-step-view/create-step-view.jsx';


// NewPage component

function NewPage() {
  return (
    <div>
      <h2>New Page</h2>
      <p>This is a new page.</p>
        <Link to="/" className="App-link">Go to Home</Link>
    </div>
  );
}

function Home() {
    return (
      <div>
      <h2>Home</h2>
      <p>Welcome to the home page.</p>
      <Link to="/new-page" className="App-link">Go to New Page</Link>
      <br />
      <Link to="/create-step-view" className="App-link">Create a New Step</Link> {/* Link to CreateStepView */}
    </div>
    );
}

// App component
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />  {/* Add this if you want a default landing page */}
          <Route path="/new-page" element={<NewPage />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/create-step-view" element={<CreateStepView />} />
        </Routes>
    </Router>
  );
}

export default App;
