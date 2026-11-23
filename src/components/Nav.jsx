import React from "react";
import Logo from "../images/Ultraverse.png";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const openNav = () => {
    document.body.classList.add("menu__open");
  };

  const closeNav = () => {
    document.body.classList.remove("menu__open");
  };

  return (
    <header className="transparent header-light scroll-light smaller">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex sm-pt10">
              <div className="de-flex-col">
                <div className="de-flex-col">
                  <div id="logo">
                    <Link to="/">
                      <img
                        alt="Ultraverse home"
                        className="logo-2"
                        src={Logo}
                      />
                    </Link>
                  </div>
                </div>
                <div className="de-flex-col">
                  <form
                    id="quick-search-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const query = new FormData(event.currentTarget).get(
                        "quick_search",
                      );
                      navigate("/explore?search=" + encodeURIComponent(query));
                    }}
                  >
                    <input
                      id="quick_search"
                      className="xs-hide"
                      name="quick_search"
                      placeholder="search item here..."
                      aria-label="Search NFTs"
                      type="text"
                    />
                  </form>
                </div>
              </div>
              <div className="de-flex-col header-col-mid">
                <ul id="mainmenu">
                  <li className="menu-item-has-children has-child">
                    <Link to="/">
                      Home<span></span>
                    </Link>
                  </li>
                  <li className="menu-item-has-children has-child">
                    <Link to="/explore">
                      Explore<span></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="btn-main connect-wallet"
                      onClick={() =>
                        alert("This feature has not been implemented yet")
                      }
                    >
                      Connect wallet
                    </Link>
                  </li>
                </ul>

                <div className="menu_side_area">
                  <button
                    type="button"
                    aria-label="Open menu"
                    onClick={() => openNav()}
                    id="menu-btn"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul id="dropdown__wrapper">
        <li className="dropdown__list">
          <Link to="/" onClick={() => closeNav()}>
            Home
          </Link>
        </li>
        <li className="dropdown__list">
          <Link to="/explore" onClick={() => closeNav()}>
            Explore
          </Link>
        </li>
        <li className="close__button">
          <button aria-label="Close menu" onClick={() => closeNav()}>
            <span aria-hidden="true">×</span>
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Nav;
