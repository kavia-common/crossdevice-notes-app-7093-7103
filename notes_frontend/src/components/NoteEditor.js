import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onDelete, onCancel, saving }) {
  /** Form for creating/editing a note. */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...note, title: title.trim(), content });
  };

  return (
    <div className="editor">
      <form onSubmit={handleSubmit} className="editor-form">
        <input
          className="input title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
        />
        <textarea
          className="textarea"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Note content"
        />
        <div className="editor-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          {note?.id && (
            <button type="button" className="btn danger" onClick={() => onDelete(note)} disabled={saving}>
              Delete
            </button>
          )}
          <button type="button" className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
