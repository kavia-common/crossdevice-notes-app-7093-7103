import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ onCreate }) {
  /** Sidebar with create note shortcut and simple filter list. */
  return (
    <aside className="sidebar">
      <button className="btn primary full" onClick={onCreate}>+ New Note</button>
      <div className="sidebar-section">
        <div className="sidebar-title">Filters</div>
        <ul className="sidebar-list">
          <li className="sidebar-item active">All Notes</li>
          {/* Future filters (e.g., by label/folder) could go here */}
        </ul>
      </div>
    </aside>
  );
}
