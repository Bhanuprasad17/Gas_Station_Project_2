import React, { useEffect, useState } from "react";
import axios from "axios";

const ChargerList = ({ onEdit }) => {
  const [chargers, setChargers] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");

  const fetchChargers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/chargers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChargers(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load chargers");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this charger?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/chargers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Charger deleted");
      fetchChargers();
    } catch (error) {
      console.error(error);
      setMessage("Delete failed");
    }
  };

  useEffect(() => {
    fetchChargers();
  }, []);

  // Filter chargers by name or location
  const filteredChargers = chargers.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Charger List</h2>
      <input
        type="text"
        placeholder="Search by name or location"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 10, padding: 5, width: 300 }}
      />
      {message && <p>{message}</p>}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredChargers.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No chargers found
              </td>
            </tr>
          )}
          {filteredChargers.map((charger) => (
            <tr key={charger._id}>
              <td>{charger.name}</td>
              <td>{charger.location}</td>
              <td>{charger.capacity}</td>
              <td>
                <button onClick={() => onEdit(charger)}>Edit</button>{" "}
                <button onClick={() => handleDelete(charger._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChargerList;
