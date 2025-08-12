import React, { useEffect, useState } from "react";
import NotesList from "./components/NotesList";
import Editor from "./components/Editor";
import "./styles.css";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");

  async function loadNotes() {
    const all = await window.notesAPI.getAll();
    setNotes(all);
    if (all.length && !activeId) setActiveId(all[0].id);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleCreate() {
    const newNote = await window.notesAPI.create({
      title: "New Note",
      content: "",
    });
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  }

  async function handleDelete(id) {
    if (!confirm("Delete note?")) return;
    await window.notesAPI.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id)
      setActiveId(notes.length ? notes[0]?.id || null : null);
  }

  async function handleSave(id, updates) {
    const updated = await window.notesAPI.update(id, updates);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }

  async function doSearch(q) {
    setQuery(q);
    const results = await window.notesAPI.search(q);
    setNotes(results);
    if (results.length) setActiveId(results[0].id);
    else setActiveId(null);
  }

  const activeNote = notes.find((n) => n.id === activeId) || null;

  return (
    <div className="app">
      <header className="topbar">
        <h1>Light Notes</h1>
        <div className="top-actions">
          <input
            placeholder="Search notes..."
            value={query}
            onChange={(e) => doSearch(e.target.value)}
            className="search"
          />
          <button onClick={handleCreate}>New</button>
        </div>
      </header>

      <div className="main">
        <NotesList
          notes={notes}
          activeId={activeId}
          onSelect={setActiveId}
          onDelete={handleDelete}
        />
        <Editor note={activeNote} onSave={handleSave} />
      </div>
    </div>
  );
}
