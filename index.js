import readline from 'readline';
import * as store from './store.js';
import { summarize } from './summary.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

function showMenu() {
  console.log('\n==== TODO Manager ====');
  console.log('1. 查看任务');
  console.log('2. 添加任务');
  console.log('3. 完成任务');
  console.log('4. 删除任务');
  console.log('5. AI 总结今日');
  console.log('6. 退出\n');
}

function showTasks() {
  const tasks = store.list();
  if (tasks.length === 0) {
    console.log('暂无任务。');
    return;
  }
  tasks.forEach(t => {
    const status = t.done ? '[✓]' : '[ ]';
    let line = `  ${t.id}. ${status} ${t.title}`;
    if (t.due && !t.done) {
      const due = new Date(t.due);
      const now = new Date();
      if (due <= now) {
        line += '  ⏰ 已超时!';
      } else {
        const min = Math.round((due - now) / 60000);
        line += `  ⏰ 还剩 ${min} 分钟`;
      }
    }
    console.log(line);
  });
}

async function main() {
  while (true) {
    showMenu();
    const choice = await question('选择: ');

    switch (choice) {
      case '1':
        showTasks();
        break;
      case '2': {
        const title = await question('任务标题: ');
        if (!title.trim()) break;
        const remind = await question('提醒时间(分钟数, 回车跳过): ');
        let due = null;
        if (remind.trim() && !isNaN(remind)) {
          due = new Date(Date.now() + parseInt(remind) * 60000).toISOString();
          console.log(`将在 ${remind} 分钟后提醒`);
        }
        const t = store.add(title.trim(), due);
        console.log(`已添加: #${t.id} ${t.title}`);
        break;
      }
      case '3': {
        const id = parseInt(await question('完成的任务 ID: '));
        if (isNaN(id)) { console.log('无效 ID'); break; }
        const t = store.done(id);
        console.log(t ? `已完成: ${t.title}` : '找不到该任务');
        break;
      }
      case '4': {
        const id = parseInt(await question('删除的任务 ID: '));
        if (isNaN(id)) { console.log('无效 ID'); break; }
        const ok = store.remove(id);
        console.log(ok ? '已删除' : '找不到该任务');
        break;
      }
      case '5': {
        console.log('正在生成总结...');
        const tasks = store.todayDone();
        const result = await summarize(tasks);
        if (result) console.log('\n' + result);
        break;
      }
      case '6':
        console.log('再见!');
        rl.close();
        process.exit(0);
      default:
        console.log('无效选项');
    }
  }
}

main();
