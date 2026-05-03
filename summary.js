import https from 'https';

const API_KEY = process.env.DEEPSEEK_KEY || '';
const API_HOST = 'api.deepseek.com';
const API_PATH = '/beta/chat/completions';

export async function summarize(tasks) {
  if (!API_KEY) {
    console.log('错误: 请设置环境变量 DEEPSEEK_KEY');
    return null;
  }
  if (tasks.length === 0) {
    return '今天没有已完成的任务。';
  }

  const taskList = tasks.map(t => `- ${t.title}`).join('\n');
  const prompt = `以下是今天完成的任务列表：\n${taskList}\n\n请用一段话总结今天的完成情况，语气轻松鼓励。`;

  const body = JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: '你是一个友好的个人助理，用中文回复。' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.8
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: API_HOST,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            console.log('API 错误:', json.error.message);
            resolve(null);
          } else {
            resolve(json.choices[0].message.content);
          }
        } catch {
          console.log('解析 API 返回失败');
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      console.log('API 请求失败，请检查网络');
      resolve(null);
    });

    req.write(body);
    req.end();
  });
}
