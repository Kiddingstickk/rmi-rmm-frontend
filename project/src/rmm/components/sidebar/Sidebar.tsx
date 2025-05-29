import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaStar, FaCommentDots, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css'; // You’ll create this CSS file next

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </button>

      <div className="sidebar-content">
        <div className="logo">{!collapsed && <h2>RateMyMgmt</h2>}</div>

        <nav>
          <ul>
            <li>
              <Link to="/profile">
                <FaUserCircle />
                {!collapsed && <span>Profile</span>}
              </Link>
            </li>
            <li>
              <Link to="/reviews">
                <FaStar />
                {!collapsed && <span>My Reviews</span>}
              </Link>
            </li>
            <li>
              <Link to="/forum">
                <FaCommentDots />
                {!collapsed && <span>Forum</span>}
              </Link>
            </li>
            <li>
              <Link to="/logout">
                <FaSignOutAlt />
                {!collapsed && <span>Logout</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
