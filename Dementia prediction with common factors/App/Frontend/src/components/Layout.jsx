import React from 'react';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavBar />
      <main className="flex-1 p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
