import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('notesAPI', {
  getAll: () => ipcRenderer.invoke('notes-get-all'),
  create: note => ipcRenderer.invoke('notes-create', note),
  update: (id, updates) => ipcRenderer.invoke('notes-update', id, updates),
  delete: id => ipcRenderer.invoke('notes-delete', id),
  search: query => ipcRenderer.invoke('notes-search', query)
});
