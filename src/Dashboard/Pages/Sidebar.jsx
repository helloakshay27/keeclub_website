import React, { useRef, } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const sidebarRef = useRef(null);


    const closeNav = () => {
        if (sidebarRef.current) {
            sidebarRef.current.classList.add("hidden");
        }
    };

    return (
        <div
            ref={sidebarRef}
            className="w-64 min-h-screen bg-[#2c001e] text-white p-2.5"
            id="mySidebar"
        >
            <p className="flex justify-end mb-2 md:hidden">
                <span
                    className="material-symbols-outlined text-lg cursor-pointer text-red-500"
                    onClick={closeNav}
                >
                    cancel
                </span>
            </p>
            <ul className="space-y-2 mb-2">
                <li>
                    <NavLink to="/dashboard/transactions"

                        className={({ isActive }) =>
                            `flex justify-between items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#d341a5] hover:to-[#2c001e] transition-colors ${isActive ? "bg-gradient-to-r from-[#d341a5] to-[#2c001e] border-b border-[#e95420]" : ""
                            }`
                        }
                    >
                        <span>Transaction Status</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-caret-right-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                        </svg>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;