import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MapView from './MapView';
import './Profile.css';

const Profile = () => {
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [loadingChargers, setLoadingChargers] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    status: 'Active',
    powerOutput: '',
  });
  const [editId, setEditId] = useState(null);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No Token found. Please login');
          navigate('/');
          return;
        }
        const res = await axios.get('http://localhost:3000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        localStorage.removeItem('token');
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchChargers();
    }
  }, [user]);

  const fetchChargers = async () => {
    try {
      setLoadingChargers(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/chargers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChargers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chargers');
    } finally {
      setLoadingChargers(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const [latitude, longitude] = form.location.split(',').map((c) => parseFloat(c.trim()));

    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Invalid location format. Use "latitude, longitude"');
      return;
    }

    const payload = {
      name: form.name,
      location: { latitude, longitude },
      status: form.status,
      powerOutput: Number(form.powerOutput),
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/chargers/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        await axios.post('http://localhost:3000/api/chargers', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: '', location: '', status: 'Active', powerOutput: '' });
      setError('');
      fetchChargers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving charger');
    }
  };

  const handleEdit = (charger) => {
    const { latitude, longitude } = charger.location || { latitude: '', longitude: '' };
    setForm({
      name: charger.name,
      location: `${latitude}, ${longitude}`,
      status: charger.status,
      powerOutput: charger.powerOutput?.toString() || '',
    });
    setEditId(charger._id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this charger?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/chargers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchChargers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete charger');
    }
  };

  const handleViewMap = (charger) => {
    if (charger.location) {
      setSelectedCharger(charger);
      setShowMap(true);  // just set to true, no toggling off/on
    }
  };

  const closeMap = () => {
    setShowMap(false);
    setSelectedCharger(null);
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button onClick={handleLogout} className="logout-btn">Logout</button>

      <hr />

      <h3>{editId ? 'Edit Charger' : 'Add New Charger'}</h3>
      <form onSubmit={handleSubmit} className="charger-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="location" placeholder="Location (latitude, longitude)" value={form.location} onChange={handleChange} required />
        <select name="status" value={form.status} onChange={handleChange} required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input name="powerOutput" placeholder="Power Output (kW)" value={form.powerOutput} onChange={handleChange} required type="number" />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: '', location: '', status: 'Active', powerOutput: '' });
              setError('');
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Charging Stations</h3>
      {loadingChargers ? (
        <p>Loading chargers...</p>
      ) : chargers.length === 0 ? (
        <p>No chargers found.</p>
      ) : (
        <>
          <table className="charger-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Power Output</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chargers.map((charger) => (
                <tr key={charger._id}>
                  <td>{charger.name}</td>
                  <td>{charger.location ? `${charger.location.latitude}, ${charger.location.longitude}` : 'N/A'}</td>
                  <td>{charger.status}</td>
                  <td>{charger.powerOutput}</td>
                  <td>
                    <button onClick={() => handleEdit(charger)} className="action-btn">Edit</button>
                    <button onClick={() => handleDelete(charger._id)} className="action-btn delete-btn">Delete</button>
                    <button onClick={() => handleViewMap(charger)} className="action-btn">View Map</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMap && selectedCharger && (
            <div className="map-container">
              <MapView charger={selectedCharger} onClose={closeMap} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
