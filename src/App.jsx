import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CarSelection from './pages/CarSelection';
import Payment from './pages/Payment';
import UserInfo from './pages/UserInfo';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-gray-50">
        <Navbar />

        <main className="w-full flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Home />} />
            <Route path="/booking/cars" element={<CarSelection />} />
            <Route path="/booking/info" element={<UserInfo />} />
            <Route path="/booking/payment" element={<Payment />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;