import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import '../index.css';

function Navbar() {
  return (
    <header id="header" className="glass header d-flex align-items-center fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <a href="/" className="logo d-flex align-items-center me-auto me-lg-0">
          <h1>SmartViz</h1>
        </a>
        <nav id="navbar" className="navbar">
          <ul>
            <li><a href="/">Home</a></li>
            <li className="dropdown">
              <a href="#"><span>Models</span> <i className="bi bi-chevron-down"></i></a>
              <ul className="glass">
                <li><a href="/arima">ARIMA</a></li>
                <li><a href="/ANN">ANN</a></li>
                <li><a href="/sarima">SARIMA</a></li>
                <li><a href="/ets">ETS</a></li>
                <li><a href="/Prophet">PROPHET</a></li>
                <li><a href="/svr">SVR</a></li>
                <li><a href="/LSTM">LSTM</a></li>
                <li><a href="/hybrid">HYBRID MODEL</a></li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className="header-social-links">
          <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
          <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
          <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
          <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
        </div>
        <i className="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
        <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
      </div>
    </header>
  );
}

export default Navbar;
