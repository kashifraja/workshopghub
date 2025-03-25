import React, { useState } from 'react';



const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);



  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex">
      <div className={`position-fixed top-0 start-0 w-25 bg-darkNavy text-secondary h-100 p-3 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

        <h2 className="h5 fw-bold">Navigation</h2>


        <ul>
          <li className="my-2"><a className="text-decoration-none" href="/">Home</a></li>
          <li className="my-2"><a className="text-decoration-none" href="/products">Products</a></li>
          <li className="my-2"><a className="text-decoration-none" href="/cart">Cart</a></li>
          <li className="my-2"><a className="text-decoration-none" href="/orders">Orders</a></li>
          <li className="my-2"><a className="text-decoration-none" href="/admin">Admin</a></li>


        </ul>
      </div>
      <div className={`flex-grow ms-25 p-3 bg-white h-100 overflow-auto`}>

        <div className="flex justify-between items-center mb-4">
          <button onClick={toggleSidebar} className="d-md-none btn btn-light">Toggle Navigation</button>


          <div className="flex items-center">
            <input type="text" placeholder="Search..." className="form-control me-2" />
            <img src="/path/to/avatar.jpg" alt="Profile" className="rounded-circle" />

          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
