import React from "react";

export default function NotesList({ notes, activeId, onSelect, onDelete }) {
  return (
    <aside className="sidebar">
      {notes.length === 0 && <div className="empty">No notes yet</div>}
      <ul className="notes-list">
        {notes.map((n) => (
          <li
            key={n.id}
            className={`note-item ${n.id === activeId ? "active" : ""}`}
          >
            <div className="note-meta" onClick={() => onSelect(n.id)}>
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-excerpt">
                {(n.content || "").slice(0, 80)}
              </div>
            </div>
            <button className="delete-btn" onClick={() => onDelete(n.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
