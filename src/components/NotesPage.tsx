import React, { useState, useEffect, useCallback } from 'react';

// Basic Notion-like block model
interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'bulleted';
  content: string;
}

interface NotePageData {
  id: string;
  title: string;
  blocks: Block[];
  updated_at: string;
  created_at: string;
}

const LS_KEY = 'lexilearn.notes.v1';

function loadPages(): NotePageData[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as NotePageData[];
    return [];
  } catch {
    return [];
  }
}

function savePages(pages: NotePageData[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(pages));
  } catch {
    // ignore
  }
}

const createEmptyBlock = (): Block => ({ id: `blk-${Date.now()}-${Math.random().toString(36).slice(2)}`, type: 'paragraph', content: '' });
const createNewPage = (): NotePageData => ({
  id: `note-${Date.now()}`,
  title: 'Untitled',
  blocks: [createEmptyBlock()],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export const NotesPage: React.FC = () => {
  const [pages, setPages] = useState<NotePageData[]>(() => loadPages());
  const [activeId, setActiveId] = useState<string | null>(() => pages[0]?.id || null);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const activePage = pages.find(p => p.id === activeId) || null;

  // Persist pages (debounced)
  const scheduleSave = useCallback((next: NotePageData[]) => {
    if (debounceTimer) window.clearTimeout(debounceTimer);
    const t = window.setTimeout(() => savePages(next), 400);
    setDebounceTimer(t);
  }, [debounceTimer]);

  const updatePage = (pageId: string, mut: (p: NotePageData) => NotePageData) => {
    setPages(prev => {
      const next = prev.map(p => p.id === pageId ? mut({ ...p }) : p);
      scheduleSave(next);
      return next;
    });
  };

  function addPage() {
    setPages(prev => {
      const newPage = createNewPage();
      const next = [newPage, ...prev];
      scheduleSave(next);
      return next;
    });
    setActiveId(pages[0]?.id || createNewPage().id); // will adjust after state commit
  }

  useEffect(() => {
    if (!activeId && pages.length) setActiveId(pages[0].id);
  }, [pages, activeId]);

  function deletePage(id: string) {
    setPages(prev => {
      const idx = prev.findIndex(p => p.id === id);
      const next = prev.filter(p => p.id !== id);
      scheduleSave(next);
      // pick next page
      if (activeId === id) {
        const replacement = next[idx] || next[idx - 1] || next[0] || null;
        setActiveId(replacement?.id || null);
      }
      return next;
    });
  }

  function renamePage(id: string, title: string) {
    updatePage(id, p => ({ ...p, title, updated_at: new Date().toISOString() }));
  }

  function addBlock() {
    if (!activePage) return;
    updatePage(activePage.id, p => ({
      ...p,
      blocks: [...p.blocks, createEmptyBlock()],
      updated_at: new Date().toISOString()
    }));
  }

  function updateBlock(blockId: string, value: string) {
    if (!activePage) return;
    updatePage(activePage.id, p => {
      const blocks = p.blocks.map(b => {
        if (b.id !== blockId) return b;
        let type = b.type;
        // inline shortcuts
        if (value.startsWith('# ')) {
          type = 'heading';
          value = value.replace(/^#\s+/, '');
        } else if (value.startsWith('- ')) {
          type = 'bulleted';
          value = value.replace(/^-\s+/, '');
        }
        return { ...b, content: value, type };
      });
      return { ...p, blocks, updated_at: new Date().toISOString() };
    });
  }

  function setBlockType(blockId: string, type: Block['type']) {
    if (!activePage) return;
    updatePage(activePage.id, p => ({
      ...p,
      blocks: p.blocks.map(b => b.id === blockId ? { ...b, type } : b),
      updated_at: new Date().toISOString()
    }));
  }

  function moveBlock(blockId: string, dir: 'up' | 'down') {
    if (!activePage) return;
    updatePage(activePage.id, p => {
      const idx = p.blocks.findIndex(b => b.id === blockId);
      if (idx < 0) return p;
      const blocks = [...p.blocks];
      const target = dir === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= blocks.length) return p;
      const [item] = blocks.splice(idx, 1);
      blocks.splice(target, 0, item);
      return { ...p, blocks, updated_at: new Date().toISOString() };
    });
  }

  function deleteBlock(blockId: string) {
    if (!activePage) return;
    updatePage(activePage.id, p => ({
      ...p,
      blocks: p.blocks.filter(b => b.id !== blockId),
      updated_at: new Date().toISOString()
    }));
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>, blockId: string) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock();
    }
  }

  return (
    <div className="flex h-full">
      {/* Pages list */}
      <div className="w-64 bg-[#F7FDEB] border-r-2 border-green-200 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-green-200">
          <h2 className="font-bold text-gray-700 font-['Comic_Sans_MS']">Notes</h2>
          <button onClick={addPage} className="px-2 py-1 bg-green-300 hover:bg-green-400 rounded text-sm font-semibold">+ Page</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {pages.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-['Comic_Sans_MS'] transition ${activeId === p.id ? 'bg-green-300 text-gray-900' : 'hover:bg-green-100 text-gray-700'}`}
            >
              {p.title || 'Untitled'}
            </button>
          ))}
          {pages.length === 0 && (
            <div className="text-xs text-gray-500 px-3 py-2">No pages yet. Create one.</div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-[#FFFFF0]">
        {activePage ? (
          <>
            <div className="p-4 border-b border-green-200 flex items-center gap-3">
              <input
                value={activePage.title}
                onChange={e => renamePage(activePage.id, e.target.value)}
                placeholder="Untitled"
                className="flex-1 bg-white border-2 border-green-200 rounded px-3 py-2 font-['Comic_Sans_MS'] focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button onClick={() => deletePage(activePage.id)} className="px-3 py-2 bg-red-100 hover:bg-red-200 rounded border border-red-300 text-sm">Delete</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activePage.blocks.map(b => (
                <div key={b.id} className="group relative">
                  <div className="absolute -left-10 top-1 flex flex-col opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => moveBlock(b.id, 'up')} className="text-xs px-2 py-1 bg-green-200 rounded mb-1">↑</button>
                    <button onClick={() => moveBlock(b.id, 'down')} className="text-xs px-2 py-1 bg-green-200 rounded mb-1">↓</button>
                    <button onClick={() => deleteBlock(b.id)} className="text-xs px-2 py-1 bg-red-200 rounded mb-1">✕</button>
                    <select
                      value={b.type}
                      onChange={e => setBlockType(b.id, e.target.value as Block['type'])}
                      className="text-xs bg-white border border-green-300 rounded px-1 py-1"
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="heading">Heading</option>
                      <option value="bulleted">Bulleted</option>
                    </select>
                  </div>
                  <textarea
                    value={b.content}
                    onChange={e => updateBlock(b.id, e.target.value)}
                    onKeyDown={e => handleKey(e, b.id)}
                    placeholder={b.type === 'heading' ? 'Heading' : 'Write something...'}
                    className={`w-full resize-none outline-none bg-transparent font-['Comic_Sans_MS'] rounded px-2 py-1 ${b.type === 'heading' ? 'text-2xl font-bold' : 'text-base'} ${b.type === 'bulleted' ? 'pl-6 relative' : ''}`}
                    rows={b.type === 'heading' ? 1 : 2}
                  />
                  {b.type === 'bulleted' && <span className="absolute left-1 top-2 text-green-600">•</span>}
                </div>
              ))}
              <button onClick={addBlock} className="text-sm px-3 py-2 bg-green-100 hover:bg-green-200 border border-green-300 rounded">+ Add Block</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 font-['Comic_Sans_MS']">No page selected.</div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
