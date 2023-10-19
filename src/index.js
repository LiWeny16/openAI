import kit from "https://unpkg.com/bigonion-kit@0.11.2/esm/esm-kit.mjs";
import hljs from "https://npm.elemecdn.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js";
import { marked } from "https://npm.elemecdn.com/marked/lib/marked.esm.js";
import axios from "axios";
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
    chatContainer.innerHTML += chatStripe(
      false,
      data.get("prompt"),
      "yourQues"
    ); //data.get('表单的name属性 ')
    form.reset();
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    let dataSendALl = {
      line1: JSON.stringify({
        messages: [
          {
            content: data.get("prompt"),
            role: "user",
          },
        ],
        model: "gpt-3.5-turbo",
        stream: false,
        // "text_moderation": true
      }),
      line2: JSON.stringify({
        message: [
          {
            content: data.get("prompt"),
            role: "user",
          },
        ],
        mode: "chinchilla:0",
        key: null,
      }),
    };

    let axiosConfig = {
      config1: {
        method: "post",
        url: "https://go.every-api.com/v1/chat/completions",
        headers: {
          Authorization:
            "Bearer argyhl-mKcVN6MEnHZQRCtG213iDtTO4iix4PimROUcQS783OCvkRdk",
          "Content-Type": "application/json",
        },
        data: dataSendALl.line1,
      },
      config2: {
        method: "post",
        url: "https://bak.zaiwenai.top/message_poe",
        data: dataSendALl.line2,
      },
    };
    // 请不要盗取我的Token，仅供大家学习使用，token是真金白银买的

    switch (line) {
      case 1:
        axios(axiosConfig.config1)
          .then(function (response) {
            let answer;
            try {
              console.log(response);
              answer = response.data.choices[0].message.content;
            } catch (error) {
              messageDiv.innerHTML =
                "【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";
            }
            let parsedData = answer.replace(/\&lt;/g, `<`);
            parsedData = parsedData.replace(/\&gt;/g, `>`);

            return parsedData;
          })
          .then((parsedData) => {
            clearInterval(loadInterval);
            messageDiv.innerHTML = "";
            typeText(messageDiv, parsedData);
          })
          .catch(function (error) {
            messageDiv.innerHTML =
              "【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";
            clearInterval(loadInterval);
            console.log(error);
          });
        break;

      case 2:
        axios(axiosConfig.config2)
          .then(function (response) {
            let answer;
            try {
              answer = response.data
            } catch (error) {
              messageDiv.innerHTML =
                "【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";
            }
            let parsedData = answer.replace(/\&lt;/g, `<`);
            parsedData = parsedData.replace(/\&gt;/g, `>`);

            return parsedData;
          })
          .then((parsedData) => {
            clearInterval(loadInterval);
            messageDiv.innerHTML = "";
            typeText(messageDiv, parsedData);
          })
          .catch(function (error) {
            messageDiv.innerHTML =
              "【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";
            clearInterval(loadInterval);
            console.log(error);
          });
        break;
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

/**
 * 相似度对比
 * @description 作者：三苗同学
                链接：https://juejin.cn/post/7086353349544509447
 * @param s 文本1
 * @param t 文本2
 * @param f 小数位精确度，默认2位
 * @returns {string|number|*} 百分数前的数值，最大100. 比如 ：90.32
 */
function similar(s, t, f) {
  if (!s || !t) {
    return 0;
  }
  if (s === t) {
    return 100;
  }
  var l = s.length > t.length ? s.length : t.length;
  var n = s.length;
  var m = t.length;
  var d = [];
  f = f || 2;
  var min = function (a, b, c) {
    return a < b ? (a < c ? a : c) : b < c ? b : c;
  };
  var i, j, si, tj, cost;
  if (n === 0) return m;
  if (m === 0) return n;
  for (i = 0; i <= n; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j;
  }
  for (i = 1; i <= n; i++) {
    si = s.charAt(i - 1);
    for (j = 1; j <= m; j++) {
      tj = t.charAt(j - 1);
      if (si === tj) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  let res = (1 - d[n][m] / l) * 100;
  return res.toFixed(f);
}
