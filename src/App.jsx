import { useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
  Link,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.remove("menu__open");
    AOS.refreshHard();
  }, [pathname]);
  return null;
}
function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 40,
      disable: () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);
  return (
    <Router>
      <RouteEffects />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/author/:id" element={<Author />} />
        <Route path="/item-details/:id" element={<ItemDetails />} />
        <Route
          path="*"
          element={
            <div className="container route-error">
              <h2>Page not found</h2>
              <Link to="/explore">Explore NFTs</Link>
            </div>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
