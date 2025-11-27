import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t  mt-auto py-6 px-6">
      

      <div className="border-t border-gray-800 pt-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} PharmaCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
