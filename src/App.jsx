import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const API_BASE ="https://frontend-crud-react.netlify.app"

  // ✅ Fetch all users
  const getAllUsers = async () => {
    try {
      const res = await axios.get("https://backend-node-crud-5.onrender.com/users");
      setUsers(res.data);
      setFilterusers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // ✅ Search users
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterusers(filteredUsers);
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    try {
      const res = await axios.delete(`https://backend-node-crud-5.onrender.com/users/${id}`);
      setUsers(res.data);
      setFilterusers(res.data);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ✅ Add user button
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  // ✅ Input data handler
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // ✅ Submit form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (userData.id) {
        // Update existing user
        const res = await axios.patch(`https://backend-node-crud-5.onrender.com/users/${userData.id}`, userData);
        console.log("✅ Updated user:", res.data);
        setUsers(res.data);
        setFilterusers(res.data);
      } else {
        // Add new user
        const res = await axios.post("https://backend-node-crud-5.onrender.com/users", userData);
        console.log("✅ Added user:", res.data);
        setUsers(res.data);
        setFilterusers(res.data);
      }

      setIsModalOpen(false); // close modal
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // ✅ Edit user
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>

        <div className="input-search">
          <input
            type="search"
            placeholder="Search Text Here"
            onChange={handleSearchChange}
          />
          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterusers &&
              filterusers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                    <button className="btn green" onClick={() => handleUpdateRecord(user)}>
                      Edit
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id)} className="btn red">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* ✅ Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h2>{userData.id ? "Edit User" : "Add User"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  value={userData.name}
                  name="name"
                  id="name"
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  value={userData.age}
                  name="age"
                  id="age"
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  value={userData.city}
                  name="city"
                  id="city"
                  onChange={handleData}
                />
              </div>
              <button className="btn green" onClick={handleSubmit}>
                {userData.id ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
