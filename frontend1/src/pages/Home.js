import React from 'react';
import EquipmentList from '../components/EquipmentList';
import EquipmentForm from '../components/EquipmentForm';

function Home() {
  return (
    <div>
      <h1>Welcome to Equipment Maintenance System</h1>
      <EquipmentForm />
      <EquipmentList />
    </div>
  );
}

export default Home;
