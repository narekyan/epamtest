import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Garage from './Garage';
import Winners from './Winners';
import { AppProvider } from '../state/AppProvider';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <header>
            <h1>Async Race</h1>
            <nav>

              <li><a href="/">Garage</a></li>
              <li><a href="/winners">Winners</a></li>

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
    </AppProvider>
  );
}

export default App;