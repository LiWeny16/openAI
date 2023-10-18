
function yizhiFetch(){
    const param: any = {
      token,
      messages: msgs,
      stream: true,
      create_conversation: true,
      ret_usage: true,
      use_context: useContext,
    };
    if (conversationId) {
      param.conversation_id = conversationId;
    }
    setLoading(true);
    aiChat(param)
      .then(async (resp) => {
        if (resp.status !== 200) {
          const json = await resp.json();
          message.error(json.msg);
          return;
        }
        const reader = resp.body?.getReader();
        msgs.push({
          role: 'assistant',
          content: '',
          createtime: Math.floor(new Date().getTime() / 1000),
        });
        let convDone = false;
        while (true) {
          const { value, done } = await reader!.read();
          if (done) break;
          const decoder = new TextDecoder();
          const data = decoder.decode(value);
          const datas = data.split('\n');
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            data = data.trim();
            // 处理掉data:前缀
            if (data.startsWith('data:')) {
              data = data.substring(5);
            }
            data = data.trim();
            if (data === '[DONE]') {
              convDone = true;
              continue;
            }
            if (data === '') {
              continue;
            }
            if (convDone) {
              // 获取会话id与用量
              const json = JSON.parse(data) as { conversation_id: string; usage: number };
              if (conversationId === '') {
                setConversations((convs) => {
                  return [
                    {
                      id: json.conversation_id,
                      description: msgs[0].content,
                      createtime: dayjs().unix(),
                    },
                    ...convs,
                  ];
                });
                setConversationId(json.conversation_id);
              }
              return;
            }
            const json = JSON.parse(data);
            json.choices.forEach((val: { delta: { content: string } }) => {
              if (val.delta.content) {
                setMessages((msgs) => {
                  if (msgs[msgs.length - 1]) {
                    msgs[msgs.length - 1].content += val.delta.content;
                    return [...msgs];
                  }
                  return msgs;
                });
              }
            });
          }
        }
      })
      .catch(() => {
        message.error('AI请求失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }