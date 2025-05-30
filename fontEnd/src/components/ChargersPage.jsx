// components/ChargersPage.jsx
import React, { useState } from "react";
import ChargerList from "./ChargerList";
import ChargerForm from "./ChargerForm";
import MapView from "./MapView";

const ChargersPage = () => {
  const [chargerToEdit, setChargerToEdit] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleEdit = (charger) => {
    setChargerToEdit(charger);
  };

  const handleSaved = () => {
    setChargerToEdit(null);
    setRefreshList((prev) => !prev); // trigger list refresh
  };

  const handleCancel = () => {
    setChargerToEdit(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chargers Management</h1>
      <ChargerForm
        chargerToEdit={chargerToEdit}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />
      <hr />
      <ChargerList key={refreshList} onEdit={handleEdit} />
      <hr />
      <MapView />
    </div>
  );
};

export default ChargersPage;
