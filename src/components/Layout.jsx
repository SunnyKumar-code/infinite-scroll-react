import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
    
      <main>
        <Outlet /> {/* This renders child routes */}
      </main>
     
    </div>
  );
};

export default Layout;
