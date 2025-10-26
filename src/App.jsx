import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      console.log(res.data);
      setUsers(res.data);
      setFilterusers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // ✅ Search function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterusers(filteredUsers); // ✅ update state properly
  };

  //delete user function
const handleDelete = async (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  if (!isConfirmed) return;

  try {
    const res = await axios.delete(`http://localhost:8000/users/${id}`);
    setUsers(res.data);
    setFilterusers(res.data);
  } catch (err) {
    console.error("Delete error:", err);
  }
};




  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>

        <div className="input-search">
          <input
            type="search"
            placeholder="Search Text Here"
            onChange={handleSearchChange} // ✅ no space
          />
          <button className="btn green">Add Record</button>
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
                    <button className="btn green">Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id)} className="btn red">Delete</button>


                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
