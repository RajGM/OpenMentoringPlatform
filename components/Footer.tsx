// components/Footer.tsx

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50" style={{marginTop:'10px'}}>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center text-teal-600 sm:justify-start">
            <b>FOSS Mentoring</b>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
            Built by{" "}
            <a href="https://github.com/RajGM" className="text-primary-content">
              @RajGM
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
