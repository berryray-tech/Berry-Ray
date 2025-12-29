import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 footer text-slate-300 py-8">
      <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h4 className="font-semibold text-white">BerryRay</h4>
          <p className="text-sm mt-2">Education • Registration • Support • E-commerce</p>
        </div>

        <div className="flex gap-8">
          <div>
            <h5 className="font-medium">Products</h5>
            <ul className="mt-2 text-sm">
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/shop">Shopping Mall</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium">Company</h5>
            <ul className="mt-2 text-sm">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/portfolio">Founder</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
