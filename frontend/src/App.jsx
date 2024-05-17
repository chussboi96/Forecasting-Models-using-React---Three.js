import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar"; 
import Hero from "./Components/Hero";     
import LSTM from "./Components/LSTM";
import ETS from "./Components/ETS";
import "./App.css";
import Hybrid from "./Components/Hybrid";
import Prophet from "./Components/Prophet";
import Arima from "./Components/Arima";
import ANN from "./Components/ANN";
import SVR from "./Components/SVR";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/arima" element={<Arima />} />
        <Route path="/ann" element={<ANN />} />
        <Route path="/lstm" element={<LSTM />} />
        <Route path="/ets" element={<ETS />} />
        <Route path="/svr" element={<SVR />} />
        <Route path="/hybrid" element={<Hybrid />} />
        <Route path="/Prophet" element={<Prophet />} />
      </Routes>
    </Router>
  );
}

export default App;
