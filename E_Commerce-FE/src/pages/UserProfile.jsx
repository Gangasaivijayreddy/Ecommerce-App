import { useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";

function ProfilePage() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    houseNo: "",
    area: "",
    landmark: ""
  });
  const [editId, setEditId] = useState(null);

  // 📥 Fetch addresses
  useEffect(() => {
    fetch(`${API_BASE_URL}/address/all`)
      .then(res => res.json())
      .then(data => {setAddresses(data.data || data.addresses || [])
          //console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching addresses", error);
        toast.error("Unable to load addresses");
      });
      
  }, []);

  // ➕ Add / ✏️ Edit
  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.city) {
      toast.info("Please fill required fields");
      return;
    }

    const url = editId
  ? `${API_BASE_URL}/address/${editId}`
  : `${API_BASE_URL}/address/add`;




    try {
      const res = await fetch(url, {
       method : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to save address");
      }

      const nextAddress = data.data || data;

      if (editId) {
        setAddresses(prev =>
          prev.map(addr => addr._id === editId ? nextAddress : addr)
        );
      } else {
        setAddresses(prev => [...prev, nextAddress]);
      }

      toast.success(editId ? "Address updated successfully" : "Address added successfully");
      resetForm();
    } catch (error) {
      console.error("Error saving address", error);
      toast.error(error.message || "Unable to save address");
    }
  };

  // ❌ Delete
  const deleteAddress = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/address/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Unable to delete address");
      }

      setAddresses(prev => prev.filter(addr => addr._id !== id));
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address", error);
      toast.error(error.message || "Unable to delete address");
    }
  };

  // ✏️ Edit
  const handleEdit = (addr) => {
    setFormData(addr);
    setEditId(addr._id);
    setShowForm(true);
  };

  // ⭐ Set Default
  const setDefault = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/address/default/${id}`, {
        method: "POST"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to set default address");
      }

      setAddresses(prev =>
        prev.map(addr =>
          addr._id === id
            ? { ...addr, isDefault: true }
            : { ...addr, isDefault: false }
        )
      );
      toast.success(data.message || "Default address updated");
    } catch (error) {
      console.error("Error setting default address", error);
      toast.error(error.message || "Unable to set default address");
    }
  };

  // 🔄 Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      pincode: "",
      state: "",
      city: "",
      houseNo: "",
      area: "",
      landmark: ""
    });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="container mt-3">

      {/* PROFILE INFO */}
      <div className="mb-3">
        <h3>Name: Vijay Kumar</h3>
        <h5>Email: vijay@gmail.com</h5>
        <h5>Phone: 8500639894</h5>
      </div>

      {/* ADD BUTTON */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(true)}
      >
        Add New Address
      </button>

      {/* FORM */}
      {showForm && (
        <div className="card p-3 mb-3">
          <h5>{editId ? "Edit Address" : "Add Address"}</h5>

          <input className="form-control mb-2" placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <input className="form-control mb-2" placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />

          <input className="form-control mb-2" placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
          />

          <input className="form-control mb-2" placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
          />

          <input className="form-control mb-2" placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />

          <input className="form-control mb-2" placeholder="House No"
            value={formData.houseNo}
            onChange={(e) => setFormData({...formData, houseNo: e.target.value})}
          />

          <input className="form-control mb-2" placeholder="Area"
            value={formData.area}
            onChange={(e) => setFormData({...formData, area: e.target.value})}
          />

          <input className="form-control mb-2" placeholder="Landmark"
            value={formData.landmark}
            onChange={(e) => setFormData({...formData, landmark: e.target.value})}
          />

          <div>
            <button className="btn btn-success me-2" onClick={handleSubmit}>
              {editId ? "Update" : "Save"}
            </button>

            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ADDRESS LIST */}
      {addresses.map(addr => (
        <div key={addr._id} className="card p-3 mb-2">

          <h6>
            {addr.name}
            {addr.isDefault && (
              <span className="badge bg-success ms-2">Default</span>
            )}
          </h6>

          <p className="mb-1">
            {addr.houseNo}, {addr.area}
          </p>

          <p className="mb-1">
            {addr.city}, {addr.state} - {addr.pincode}
          </p>

          <p>Phone: {addr.phone}</p>

          <div>
            <button className="btn btn-sm btn-outline-primary me-2"
              onClick={() => setDefault(addr._id)}>
              Set Default
            </button>

            <button className="btn btn-sm btn-warning me-2"
              onClick={() => handleEdit(addr)}>
              Edit
            </button>

            <button className="btn btn-sm btn-danger"
              onClick={() => deleteAddress(addr._id)}>
              Delete
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}

export default ProfilePage;
