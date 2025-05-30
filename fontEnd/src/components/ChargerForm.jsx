import React, { useState, useEffect } from "react";
import axios from "axios";

const ChargerForm = ({ chargerToEdit, onSaved, onCancel }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (chargerToEdit) {
      setName(chargerToEdit.name);
      setLocation(chargerToEdit.location);
      setCapacity(chargerToEdit.capacity);
    } else {
      setName("");
      setLocation("");
      setCapacity("");
    }
  }, [chargerToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location || !capacity) {
      setMessage("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (chargerToEdit) {
        // Update existing
        await axios.put(
          `http://localhost:5000/api/chargers/${chargerToEdit._id}`,
          { name, location, capacity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Charger updated successfully");
      } else {
        // Create new
        await axios.post(
          "http://localhost:5000/api/chargers",
          { name, location, capacity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Charger added successfully");
      }
      onSaved();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save charger");
    }
  };

  return (
    <div>
      <h2>{chargerToEdit ? "Edit Charger" : "Add Charger"}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit">{chargerToEdit ? "Update" : "Add"}</button>{" "}
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChargerForm;
