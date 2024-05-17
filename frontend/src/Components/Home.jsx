import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar"; 
import Hero from "./Hero";     
import LSTM from "./LSTM";

// import Prophet from "./Components/Prophet";

function Home() {
    return (
        <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        {/* <Route path="/arima" element={<ARIMA />} />
        <Route path="/ann" element={<ANN />} />
        <Route path="/sarima" element={<SARIMA />} /> */}
        <Route path="/lstm" element={<LSTM />} />
        {/* <Route path="/prophet" element={<Prophet />} /> */}
        {/* <Route path="/ets" element={<ETS />} />
        <Route path="/svr" element={<SVR />} />
        <Route path="/hybrid" element={<HYBRID />} /> */}
      </Routes>
      {/* <Footer /> */}
    </Router>
    );
}

export default Home