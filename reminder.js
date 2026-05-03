import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dueReminders } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PS1_PATH = path.join(__dirname, 'notify.ps1');
const notified = new Set();

function notify(task) {
  const body = task.title.replace(/"/g, "'");
  try {
    execSync(`powershell -ExecutionPolicy Bypass -File "${PS1_PATH}" -Title "⏰ 任务提醒" -Body "${body}"`, { stdio: 'ignore', timeout: 15000 });
  } catch {}
}

console.log('提醒服务已启动，每60秒检查一次...');

setInterval(() => {
  const tasks = dueReminders();
  tasks.forEach(t => {
    if (notified.has(t.id)) return;
    notified.add(t.id);
    console.log(`提醒: ${t.title}`);
    notify(t);
  });
}, 60000);
