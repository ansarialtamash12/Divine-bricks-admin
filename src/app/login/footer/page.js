"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 text-center shadow-lg text-black bg-white">
      © Copyright {new Date().getFullYear()} | All Rights Reserved
    </footer>
  );
};

export default Footer;