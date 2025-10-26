import { Link } from "react-router-dom";
import "../styles/land.css";

const Land = () => {
  return (
    <div>
      <header>
        <nav>
          <div className="logo">⚒️PlanForge</div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="login-btn">Login</Link></li>
          </ul>
        </nav>
      </header>

      <main className="hero">
        <video autoPlay muted loop playsInline id="bg-video">
          <source src="/background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-content">
          <h1>Achieve More, Stress Less.</h1>
          <p>Organize your life and work, from small tasks to big projects.</p>
          <Link to="/login" className="welcome-btn">Get Started Now</Link>
        </div>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Land;
