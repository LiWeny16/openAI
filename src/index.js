import kit from "bigonion-kit";
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

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const line = 1;

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
}
allInit();
//////////////

let loadInterval;

function loader(ele) {
  ele.textContent = "";
  loadInterval = setInterval(() => {
    ele.textContent += ".";
    if (ele.textContent === "....") {
      ele.textContent = "";
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
                <div class="message markdown-body-dark" id=${uniqueId}>${value}</div>
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
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"), "yourQues"); //data.get('表单的name属性 ')
    form.reset();
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    let dataSendALl = {
      line1: {
        model: "glm-4-plus",
        tool: "web-search-pro",
        stream: true,
        messages: [
          {
            role: "user",
            content: data.get("prompt"),
          },
        ],
      },
    };

    try {
      const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "409f1e38b0d8586919166aa6117243f7.AVQTIQqUbGI1g8B5",
        },
        body: JSON.stringify(dataSendALl.line1),
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
                const messageChunk = choice.delta?.content;
                if (messageChunk) {
                  finalMessage += messageChunk;
                }
              } catch (err) {
                console.error("JSON parse error:", err);
                clearInterval(loadInterval);
                messageDiv.innerHTML = "【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";
                return;
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
