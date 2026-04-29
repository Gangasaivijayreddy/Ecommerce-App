import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container-fluid px-2 px-md-4 home-page">

      {/* Category Section */}
      <div className="row g-3 mt-2 align-items-stretch">
        <div className="col-12">
          <div className="section-heading">
            <p className="section-eyebrow mb-2">Curated Collections</p>
            <h3 className="section-title">Select category to see cloths</h3>
          </div>
        </div>
        {/* MEN */}
        <div className="col-md-4 col-12">
          <Link to="/products/men" className="text-decoration-none">
            <div className="card text-white border-0 shadow-sm category-card">
              <img
                src="https://images.unsplash.com/photo-1520975916090-3105956dac38"
                className="card-img"
                alt="Men"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="card-img-overlay d-flex align-items-end justify-content-center category-overlay">
                <h3 className="fw-bold">Men</h3>
              </div>
            </div>
          </Link>
        </div>

        {/* WOMEN */}
        <div className="col-md-4 col-12">
          <Link to="/products/women" className="text-decoration-none">
            <div className="card text-white border-0 shadow-sm category-card">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
                className="card-img"
                alt="Women"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="card-img-overlay d-flex align-items-end justify-content-center category-overlay">
                <h3 className="fw-bold">Women</h3>
              </div>
            </div>
          </Link>
        </div>

        {/* KIDS */}
        <div className="col-md-4 col-12">
          <Link to="/products/kids" className="text-decoration-none">
            <div className="card text-white border-0 shadow-sm category-card">
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9"
                className="card-img"
                alt="Kids"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="card-img-overlay d-flex align-items-end justify-content-center category-overlay">
                <h3 className="fw-bold">Kids</h3>
              </div>
            </div>
          </Link>
        </div>

      </div>

      {/* Banner Section */}
      <div className="mt-4">
        <div className="card border-0 shadow-sm text-white hero-card">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050"
            className="card-img"
            alt="Banner"
            style={{ height: "400px", objectFit: "cover" }}
          />
          <div className="card-img-overlay d-flex flex-column justify-content-center hero-overlay">
            <div className="ms-3 hero-copy">
              <p className="section-eyebrow mb-2 text-white-50">Season Edit</p>
              <h1 className="fw-bold">New Collection</h1>
              <p className="fs-5">Discover latest trends</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
