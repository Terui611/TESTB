# TODO CLI 使用说明

## 启动

先设置 DeepSeek API Key：

```bash
set DEEPSEEK_KEY=your-api-key
```

然后运行：

```bash
cd todo-cli
node index.js
```

## 菜单

```
1. 查看任务   — 列出所有任务及完成状态
2. 添加任务   — 输入标题，自动记录时间
3. 完成任务   — 输入 ID 标记完成
4. 删除任务   — 输入 ID 删除
5. AI 总结今日 — DeepSeek 总结今天完成了啥
6. 退出
```

## 数据

所有任务存 `data.json`，可手动查看编辑。
