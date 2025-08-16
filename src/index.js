// import kit from "bigonion-kit";
import hljs from "https://npm.elemecdn.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js";
import { marked } from "https://npm.elemecdn.com/marked/lib/marked.esm.js";
import "./public/jsScript/mdParser.js";

/**
 * @description 导入Svg资源
 */
import botSvg from "@Assets/bot.svg";
import userSvg from "@Assets/user.svg";

import "./public/cssStyle/markdown-github-dark.css";
import "./public/cssStyle/markdown-github.css";
import "./public/cssStyle/hljs.min.css";

import "./public/cssStyle/md.css";
import "./public/cssStyle/keyframes.css";
import "./public/cssStyle/response.css";
import "./public/cssStyle/index.css";
import "./public/cssStyle/main.css";
import "./public/cssStyle/controls.css";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const line = 1;

// 初始化控制开关
function initializeControls() {
  const webSearchToggle = document.getElementById("webSearchToggle");
  const thinkingToggle = document.getElementById("thinkingToggle");
  
  // 从本地存储加载设置
  const savedWebSearch = localStorage.getItem("webSearchEnabled");
  const savedThinking = localStorage.getItem("thinkingEnabled");
  
  if (savedWebSearch !== null) {
    webSearchToggle.checked = savedWebSearch === "true";
  }
  
  if (savedThinking !== null) {
    thinkingToggle.checked = savedThinking === "true";
  }
  
  // 添加事件监听器保存设置
  webSearchToggle.addEventListener("change", () => {
    localStorage.setItem("webSearchEnabled", webSearchToggle.checked);
    updatePlaceholder();
  });
  
  thinkingToggle.addEventListener("change", () => {
    localStorage.setItem("thinkingEnabled", thinkingToggle.checked);
  });
  
  // 初始化占位符文本
  updatePlaceholder();
}

// 更新输入框占位符文本
function updatePlaceholder() {
  const webSearchEnabled = document.getElementById("webSearchToggle").checked;
  const inputArea = document.getElementById("inputArea");
  
  if (webSearchEnabled) {
    inputArea.placeholder = "Ask chatGPT with web search...";
  } else {
    inputArea.placeholder = "Ask chatGPT...";
  }
}

//////////////
class settingsClass {
  markedInit() {
    marked.use({
      mangle: false,
      headerIds: false,
      strict: false,
    });
  }
}

function allInit() {
  const settings = new settingsClass();
  settings.markedInit();
  
  // 等待DOM加载完成后初始化控制开关
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeControls);
  } else {
    initializeControls();
  }
}
allInit();
//////////////

let loadInterval;

function loader(ele) {
  ele.textContent = "";
  const webSearchEnabled = document.getElementById("webSearchToggle")?.checked;
  const loadingTexts = webSearchEnabled 
    ? ["正在搜索", "正在搜索.", "正在搜索..", "正在搜索...", "正在分析", "正在分析.", "正在分析..", "正在分析..."]
    : [".", "..", "...", ""];
  
  let textIndex = 0;
  loadInterval = setInterval(() => {
    if (webSearchEnabled) {
      ele.textContent = loadingTexts[textIndex % loadingTexts.length];
      textIndex++;
    } else {
      ele.textContent += ".";
      if (ele.textContent === "....") {
        ele.textContent = "";
      }
    }
  }, 300);
}

function typeText(element, text) {
  // let rawText = text
  text = text.replace(/\n/g, "  \n");

  return new Promise((resolve) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        if (index == 0 || index == 1) {
          goToFooter(document.getElementById("chat_container"));
        }
        element.innerHTML += text[index];
        element.innerHTML = element.innerHTML.replace(/  \n/g, "<br />");
        if (
          element.innerHTML.match(/```/g)
            ? element.innerHTML.match(/```/g).length % 2 === 0
            : false
        ) {
          element.innerHTML = marked.parse(text.substring(0, index + 1));
          hljs.highlightAll();
          goToFooter(document.getElementById("chat_container"));
        }
        if (
          document.getElementById("chat_container").scrollHeight -
          (document.getElementById("chat_container").scrollTop +
            document.getElementById("chat_container").clientHeight) <
          45
        ) {
          goToFooter(document.getElementById("chat_container"));
        }

        index++;
      } else if (index == text.length) {
        // let mdText = marked.parse(text.replace(/\n /g, "<br />"))
        element.innerHTML = marked.parse(text);
        hljs.highlightAll();
        goToFooter(document.getElementById("chat_container"));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    resolve("end");
  });
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  // 如果是AI回复，添加功能状态指示
  let statusIndicator = "";
  if (isAi && value === "") {
    const webSearchEnabled = document.getElementById("webSearchToggle")?.checked;
    const thinkingEnabled = document.getElementById("thinkingToggle")?.checked;
    
    let indicators = [];
    if (webSearchEnabled) indicators.push("🌐 联网搜索");
    if (thinkingEnabled) indicators.push("🧠 深度思考");
    
    if (indicators.length > 0) {
      statusIndicator = `<div class="status-indicator">${indicators.join(" | ")}</div>`;
    }
  }
  
  return `
        <div class= "wrapper ${isAi && "ai"}">
            <div class = "chat">
                <div class= "profile">
                    <img 
                    draggable = "false"
                    alt="${isAi ? "bot" : "user"}"
                    src="${isAi ? `${botSvg}` : `${userSvg}`}" 
                     />
                </div>
                <div class="message markdown-body-dark" id=${uniqueId}>
                  ${statusIndicator}
                  ${value}
                </div>
            </div>
        <div>
        `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  if (data.get("prompt").replace(/(\s)|(\\n)/g, "") === "") {
    alert("你啥都没输入！");
  } else {
    // 获取控制开关状态
    const webSearchEnabled = document.getElementById("webSearchToggle").checked;
    const thinkingEnabled = document.getElementById("thinkingToggle").checked;
    
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"), "yourQues"); //data.get('表单的name属性 ')
    form.reset();
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // 构建基础请求数据
    let dataSendAll = {
      model: "glm-4.5",
      stream: true,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: data.get("prompt"),
        },
      ],
    };

    // 如果启用深度思考
    if (thinkingEnabled) {
      dataSendAll.thinking = {
        type: "enabled",
      };
    }

    // 如果启用联网搜索，添加工具配置
    if (webSearchEnabled) {
      dataSendAll.tools = [{
        type: "web_search",
        web_search: {
          enable: true,
          search_engine: "search_pro",
          search_result: true,
          search_prompt: "你是一位智能助手。请用简洁明了的语言总结网络搜索结果中的关键信息，按重要性排序并引用来源。今天的日期是" + new Date().toLocaleDateString('zh-CN') + "。",
          count: 5,
          search_recency_filter: "noLimit",
          content_size: "high"
        }
      }];
    }

    try {
      const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "4f0f9e54e52e43faadbf24c9a7754b00.Xon9PmRyJShYVVJ7",
        },
        body: JSON.stringify(dataSendAll),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let finalMessage = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");
          for (const line of lines) {
            if (line.startsWith("data:")) {
              const jsonStr = line.replace("data:", "").trim();
              if (jsonStr === "[DONE]") {
                clearInterval(loadInterval);
                messageDiv.innerHTML = "";
                typeText(messageDiv, finalMessage);
                return;
              }
              try {
                const json = JSON.parse(jsonStr);
                const choice = json.choices[0];
                
                // 处理工具调用（联网搜索）
                if (choice.delta?.tool_calls) {
                  // 这里可以添加工具调用的处理逻辑
                  console.log("Tool calls detected:", choice.delta.tool_calls);
                }
                
                const messageChunk = choice.delta?.content;
                if (messageChunk) {
                  finalMessage += messageChunk;
                }
                
                // 检查是否有finish_reason
                if (choice.finish_reason === "tool_calls") {
                  console.log("Tool calls completed");
                }
              } catch (err) {
                console.error("JSON parse error:", err);
                // 如果是小的解析错误，继续处理，不立即终止
                if (!err.message.includes("Unexpected end")) {
                  clearInterval(loadInterval);
                  messageDiv.innerHTML = "【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";
                  return;
                }
              }
            }
          }
        }
      }
      clearInterval(loadInterval);
      messageDiv.innerHTML = "";
      typeText(messageDiv, finalMessage);
    } catch (error) {
      clearInterval(loadInterval);
      messageDiv.innerHTML = "【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";
      console.error(error);
    }
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 && e.ctrlKey) {
    handleSubmit(e);
  }
});

function goToFooter(ele) {
  var div = ele;
  div.scrollTop = div.scrollHeight;
}
