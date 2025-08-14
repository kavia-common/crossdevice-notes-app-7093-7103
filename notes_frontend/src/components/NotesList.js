import React from 'react';
import { format } from 'date-fns';
import { toDateSafe } from '../utils/date';

// PUBLIC_INTERFACE
export default function NotesList({ groups, selectedId, onSelect }) {
  /** Renders notes grouped by date. */
  return (
    <div className="notes-list">
      {groups.map(({ label, notes }) => (
        <div className="notes-group" key={label}>
          <div className="notes-group-header">{label}</div>
          <ul className="notes-items">
            {notes.map((n) => {
              const ts = toDateSafe(n.updatedAt || n.createdAt || n.date);
              const sub = ts ? format(ts, 'p') : '';
              return (
                <li
                  key={n.id}
                  className={`note-item ${selectedId === n.id ? 'selected' : ''}`}
                  onClick={() => onSelect(n)}
                >
                  <div className="note-title">{n.title || 'Untitled'}</div>
                  <div className="note-sub">
                    <span className="note-time">{sub}</span>
                    <span className="note-preview">{(n.content || '').slice(0, 60)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
