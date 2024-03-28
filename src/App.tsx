import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Garage from './components/Garage';
import Winners from './components/Winners';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Async Race</h1>
          <nav>
            <ul>
              <li><a href="/">Garage</a></li>
              <li><a href="/winners">Winners</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Garage />} />
            <Route path="/winners" element={<Winners />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;