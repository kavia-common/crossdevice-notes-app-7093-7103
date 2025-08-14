import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Sidebar from '../components/Sidebar';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import { NotesApi } from '../api/client';
import { toDateSafe } from '../utils/date';

// PUBLIC_INTERFACE
export default function NotesPage() {
  /** Authenticated notes management page with list and editor. */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await NotesApi.list();
      // Normalize IDs if backend uses different key
      const normalized = (data || []).map((n) => ({
        id: n.id || n._id || n.noteId || String(n.createdAt || Date.now()),
        title: n.title || '',
        content: n.content || '',
        createdAt: n.createdAt || n.updatedAt || new Date().toISOString(),
        updatedAt: n.updatedAt || n.createdAt || new Date().toISOString(),
      }));
      setNotes(normalized);
      if (!selected && normalized.length > 0) setSelected(normalized[0]);
    } catch (error) {
      setErr(error?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo(() => {
    // Group notes by date (YYYY-MM-DD)
    const map = new Map();
    notes.forEach((n) => {
      const dt = toDateSafe(n.updatedAt || n.createdAt);
      const key = dt ? format(dt, 'yyyy-MM-dd') : 'Unknown Date';
      const label = dt ? format(dt, 'EEE, MMM d, yyyy') : 'Unknown Date';
      if (!map.has(key)) map.set(key, { label, notes: [] });
      map.get(key).notes.push(n);
    });
    // Sort groups descending by date
    const list = Array.from(map.entries())
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([, group]) => group);
    return list;
  }, [notes]);

  const onCreate = () => {
    setSelected({ title: '', content: '' });
  };

  const onSave = async (payload) => {
    setSaving(true);
    setErr('');
    try {
      if (payload.id) {
        const updated = await NotesApi.update(payload.id, { title: payload.title, content: payload.content });
        setNotes((prev) => prev.map((n) => (n.id === payload.id ? { ...n, ...updated } : n)));
        setSelected((prev) => ({ ...prev, ...updated }));
      } else {
        const created = await NotesApi.create({ title: payload.title, content: payload.content });
        const normalized = {
          id: created.id || created._id || String(Date.now()),
          title: created.title || payload.title,
          content: created.content || payload.content,
          createdAt: created.createdAt || new Date().toISOString(),
          updatedAt: created.updatedAt || new Date().toISOString(),
        };
        setNotes((prev) => [normalized, ...prev]);
        setSelected(normalized);
      }
    } catch (error) {
      setErr(error?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (payload) => {
    if (!payload?.id) {
      setSelected(null);
      return;
    }
    if (!window.confirm('Delete this note? This action cannot be undone.')) return;
    setSaving(true);
    setErr('');
    try {
      await NotesApi.remove(payload.id);
      setNotes((prev) => prev.filter((n) => n.id !== payload.id));
      setSelected(null);
    } catch (error) {
      setErr(error?.message || 'Failed to delete note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="layout">
        <Sidebar onCreate={onCreate} />
        <main className="content">
          {loading && <div className="alert">Loading notes...</div>}
          {err && <div className="alert error">{err}</div>}
          <div className="notes-pane">
            <div className="list-col">
              <NotesList
                groups={groups}
                selectedId={selected?.id}
                onSelect={(n) => setSelected(n)}
              />
            </div>
            <div className="editor-col">
              <NoteEditor
                note={selected}
                onSave={onSave}
                onDelete={onDelete}
                onCancel={() => setSelected(null)}
                saving={saving}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
