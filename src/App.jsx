import { useEffect, useState } from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePersistentState } from "./hooks";
import { changeBag } from "./catalog";
import { Bag, Modal } from "./components";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.refresh();
  }, [pathname]);
  return null;
}
function ShopApp() {
  const [saved, setSaved] = usePersistentState("eventide-saved-v1", []);
  const [bag, setBag] = usePersistentState("eventide-bag-v1", []);
  const [modal, setModal] = useState(null);
  useEffect(() => {
    AOS.init({
      duration: 400,
      offset: 30,
      once: true,
      disable: () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);
  const count = bag.reduce((sum, item) => sum + item.quantity, 0);
  const toggleSave = (id) =>
    setSaved((list) =>
      list.includes(id) ? list.filter((value) => value !== id) : [...list, id],
    );
  const add = (product) => {
    setBag((list) => changeBag(list, product, 1));
    setModal("bag");
  };
  const shared = { saved, toggleSave, add };
  return (
    <>
      <ScrollToTop />
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <header>
        <Link className="wordmark" to="/" aria-label="Eventide home">
          EVENTIDE
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Shop
          </NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <button onClick={() => setModal("about")}>About</button>
        </nav>
        <div className="header-actions">
          <Link to="/saved" aria-label={"Saved items " + saved.length}>
            <Heart size={17} />
            <span>Saved</span>
            <small>{saved.length}</small>
          </Link>
          <button onClick={() => setModal("bag")}>
            <ShoppingBag size={17} />
            <span>Bag</span>
            <small>{count}</small>
          </button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home {...shared} />} />
          <Route path="/explore" element={<Explore {...shared} />} />
          <Route path="/collection/:id" element={<Explore {...shared} />} />
          <Route path="/saved" element={<Explore {...shared} savedOnly />} />
          <Route path="/author/:id" element={<Author {...shared} />} />
          <Route
            path="/item-details/:id"
            element={<ItemDetails {...shared} />}
          />
          <Route
            path="*"
            element={
              <div className="empty">
                <h1>Page not found</h1>
                <Link to="/explore">Back to the shop</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EVENTIDE</span>
          <span>Demo marketplace · USD</span>
        </div>
        <div className="footer-links">
          <button onClick={() => setModal("about")}>About</button>
          <button onClick={() => setModal("help")}>Delivery & returns</button>
          <button onClick={() => setModal("privacy")}>Privacy</button>
        </div>
      </footer>
      {modal && (
        <Modal
          title={
            modal === "bag"
              ? "Your bag · " + count
              : modal === "about"
                ? "About Eventide"
                : modal === "privacy"
                  ? "Privacy"
                  : "Delivery & returns"
          }
          close={() => setModal(null)}
        >
          {modal === "bag" ? (
            <Bag
              bag={bag}
              change={(product, delta) =>
                setBag((list) => changeBag(list, product, delta))
              }
              close={() => setModal(null)}
            />
          ) : (
            <div className="editorial">
              {modal === "about" ? (
                <>
                  <h2>About Eventide</h2>
                  <p>
                    A clothing marketplace built as a FES virtual internship
                    adaptation. Browse collections, visit seller profiles, and
                    save items for later.
                  </p>
                  <p>
                    This is a demo. Products come from a sample catalog. Seller
                    profiles, activity counts and timed listings are example
                    data; nothing is offered for purchase.
                  </p>
                </>
              ) : modal === "privacy" ? (
                <>
                  <h2>Your saved items</h2>
                  <p>
                    Your bag and saved items are stored in this browser. No
                    account or payment information is collected. Product images
                    are served by DummyJSON.
                  </p>
                  <button
                    className="secondary"
                    onClick={() => {
                      setSaved([]);
                      setBag([]);
                      setModal(null);
                    }}
                  >
                    Clear bag and saved items
                  </button>
                </>
              ) : (
                <>
                  <h2>Before you order</h2>
                  <p>
                    Checkout is unavailable in this demo. No payment is taken
                    and no order is created.
                  </p>
                  <p>
                    Delivery and return information on product pages comes from
                    the sample catalog. Size options are not supplied.
                    Marketplace countdowns are examples, not real offers.
                  </p>
                </>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
export default function App() {
  return (
    <HashRouter>
      <ShopApp />
    </HashRouter>
  );
}
