import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Nav() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const trimmedSearch = searchTerm.trim();

  const handleSearch = () => {
    if (!trimmedSearch) {
      navigate("/products");
      setOpen(false);
      return;
    }

    navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);
    setOpen(false);
  };

  return (
    <>
      <div className="container bg-secondary-subtle p-3 mb-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="d-flex justify-content-between justify-content-md-start align-items-center">
              <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
                <i className={`bi ${open ? "bi-x" : "bi-list"} fs-3`}></i>
              </div>

              <Link to="/" className="text-decoration-none text-dark ms-3" onClick={() => setOpen(false)}>
                <h3 className="m-0 fs-4">MyShoppingSite</h3>
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-5">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2"></i>
              <input
                type="text"
                className="form-control px-5"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="d-flex justify-content-center justify-content-md-end">
              <Link to="/cartItems" className="text-dark">
                <i className="bi bi-cart mx-3 fs-4"></i>
              </Link>
              <Link to="/wishList" className="text-dark">
                <i className="bi bi-heart fs-4"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="bg-light p-3 container shadow rounded">
          <ul className="list-unstyled m-0">
            <li>
              <Link to="/profilePage" className="text-decoration-none d-block py-2" onClick={() => setOpen(false)}>
                User Profile Page
              </Link>
            </li>
            <li>
              <Link to="/orderHistory" className="text-decoration-none d-block py-2" onClick={() => setOpen(false)}>
                Order history page
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Nav;
