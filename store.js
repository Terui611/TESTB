import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data.json');

function read() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return data.tasks || [];
  } catch {
    return [];
  }
}

function write(tasks) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ tasks }, null, 2), 'utf-8');
}

export function list() {
  return read();
}

export function add(title, due = null) {
  const tasks = read();
  const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const task = { id, title, done: false, time: new Date().toISOString(), due };
  tasks.push(task);
  write(tasks);
  return task;
}

export function done(id) {
  const tasks = read();
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  task.done = true;
  write(tasks);
  return task;
}

export function remove(id) {
  const tasks = read();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  write(tasks);
  return true;
}

export function todayDone() {
  const tasks = read();
  const today = new Date().toISOString().slice(0, 10);
  return tasks.filter(t => t.done && t.time.slice(0, 10) === today);
}

export function dueReminders() {
  const now = new Date();
  return read().filter(t => !t.done && t.due && new Date(t.due) <= now);
}
