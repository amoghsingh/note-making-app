import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const NOTES_FILENAME = "notes.json";

// Get path to store notes (platform-appropriate)
function getNotesFilePath() {
  return path.join(app.getPath("userData"), NOTES_FILENAME);
}

async function readNotes() {
  const file = getNotesFilePath();
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeNotes(notes) {
  const file = getNotesFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(notes, null, 2), "utf8");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  // IPC handlers
  ipcMain.handle("notes-get-all", readNotes);

  ipcMain.handle("notes-create", async (_, note) => {
    const notes = await readNotes();
    const id = Date.now().toString();
    const newNote = {
      id,
      title: note.title || "Untitled",
      content: note.content || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    await writeNotes(notes);
    return newNote;
  });

  ipcMain.handle("notes-update", async (_, id, updates) => {
    const notes = await readNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    notes[idx] = {
      ...notes[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await writeNotes(notes);
    return notes[idx];
  });

  ipcMain.handle("notes-delete", async (_, id) => {
    let notes = await readNotes();
    notes = notes.filter((n) => n.id !== id);
    await writeNotes(notes);
    return true;
  });

  ipcMain.handle("notes-search", async (_, query) => {
    const notes = await readNotes();
    if (!query) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
    );
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
