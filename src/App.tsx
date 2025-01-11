import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './component/page/About';
import Marketplace from './component/page/Marketplace';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/CheemScape/" element={<About />} />
        <Route path="/CheemScape/Marketplace" element={<Marketplace />} />
      </Routes>
    </Router>
  );
};

export default App;
