import React, { useEffect, useState } from "react";

export default function Editor({ note, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]);

  if (!note) {
    return <main className="editor-empty">Select or create a note</main>;
  }

  function handleSave() {
    onSave(note.id, { title, content });
  }

  return (
    <main className="editor">
      <input
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="content-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
      />
      <div className="editor-actions">
        <button onClick={handleSave}>Save</button>
        <span className="muted">
          Last modified: {new Date(note.updatedAt).toLocaleString()}
        </span>
      </div>
    </main>
  );
}
