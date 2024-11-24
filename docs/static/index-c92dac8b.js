import b from"https://npm.elemecdn.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js";import*as M from"https://npm.elemecdn.com/marked/lib/marked.esm.js";import{marked as g}from"https://npm.elemecdn.com/marked/lib/marked.esm.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const B=`# 关于\r
本项目使用了OpenAI提供的API接口，自费购买接口，搭建服务器来构建chatGPT模型，并且使用了markdown解析文案，让大家可以方便的，无需梯子，无需登录/购买账号，体验一把AI的乐趣\r
\r
## 公告\r
如果寄了，请等待几小时再来看看\r
\r
## Todo\r
+ <s>自动解析markdown</s>\r
+ <s>高亮代码块</s>\r
+ <s>自动滑到底部</s>\r
+ GPT4.0 😆\r
## 作者\r
**Bigonion**\r
\r
## 开源协议\r
\r
**MIT**\r
## Namespace\r
[https://bigonion.cn](https://bigonion.cn)`,k="/static/关闭-2904f250.svg";let O=`
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src=${k} alt="shut">
</div>
`;document.getElementById("view-area").innerHTML=O+A(B);function A(e){return M.marked.parse(e)}document.getElementById("closeAboutSvg").addEventListener("click",()=>{document.getElementById("aboutBox").style.display="none"});document.getElementById("showAbout").addEventListener("click",()=>{document.getElementById("aboutBox").style.display="flex"});const D="/static/bot-61bdb6bf.svg",N="/static/user-bcdeb18e.svg";const u=document.querySelector("form"),l=document.querySelector("#chat_container");class _{markedInit(){g.use({mangle:!1,headerIds:!1,strict:!1})}}function $(){new _().markedInit()}$();let a;function C(e){e.textContent="",a=setInterval(()=>{e.textContent+=".",e.textContent==="...."&&(e.textContent="")},300)}function I(e,n){return n=n.replace(/\n/g,`  
`),new Promise(s=>{let r=0,t=setInterval(()=>{r<n.length?((r==0||r==1)&&d(document.getElementById("chat_container")),e.innerHTML+=n[r],e.innerHTML=e.innerHTML.replace(/  \n/g,"<br />"),e.innerHTML.match(/```/g)&&e.innerHTML.match(/```/g).length%2===0&&(e.innerHTML=g.parse(n.substring(0,r+1)),b.highlightAll(),d(document.getElementById("chat_container"))),document.getElementById("chat_container").scrollHeight-(document.getElementById("chat_container").scrollTop+document.getElementById("chat_container").clientHeight)<45&&d(document.getElementById("chat_container")),r++):r==n.length?(e.innerHTML=g.parse(n),b.highlightAll(),d(document.getElementById("chat_container")),r++):clearInterval(t)},25);s("end")})}function P(){const e=Date.now(),s=Math.random().toString(16);return`id-${e}-${s}`}function T(e,n,s){return`
        <div class= "wrapper ${e&&"ai"}">
            <div class = "chat">
                <div class= "profile">
                    <img 
                    draggable = "false"
                    alt="${e?"bot":"user"}"
                    src="${e?`${D}`:`${N}`}" 
                     />
                </div>
                <div class="message markdown-body-dark" id=${s}>${n}</div>
            </div>
        <div>
        `}const w=async e=>{var s;e.preventDefault();const n=new FormData(u);if(n.get("prompt").replace(/(\s)|(\\n)/g,"")==="")alert("你啥都没输入！");else{l.innerHTML+=T(!1,n.get("prompt"),"yourQues"),u.reset();const r=P();l.innerHTML+=T(!0,"",r),l.scrollTop=l.scrollHeight;const t=document.getElementById(r);C(t);let o={line1:{model:"glm-4-plus",tool:"web-search-pro",stream:!0,messages:[{role:"user",content:n.get("prompt")}]}};try{const c=await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"409f1e38b0d8586919166aa6117243f7.AVQTIQqUbGI1g8B5"},body:JSON.stringify(o.line1)});if(!c.body)throw new Error("ReadableStream not supported in this browser.");const L=c.body.getReader(),S=new TextDecoder("utf-8");let f=!1,m="";for(;!f;){const{value:h,done:E}=await L.read();if(f=E,h){const H=S.decode(h,{stream:!0}).split(`
`).filter(i=>i.trim()!=="");for(const i of H)if(i.startsWith("data:")){const p=i.replace("data:","").trim();if(p==="[DONE]"){clearInterval(a),t.innerHTML="",I(t,m);return}try{const v=(s=JSON.parse(p).choices[0].delta)==null?void 0:s.content;v&&(m+=v)}catch(y){console.error("JSON parse error:",y),clearInterval(a),t.innerHTML="【解析错误】请重新尝试，如仍然失败，请联系大聪花😫";return}}}}clearInterval(a),t.innerHTML="",I(t,m)}catch(c){clearInterval(a),t.innerHTML="【解析错误】请重新尝试，如仍然失败，请联系大聪花😫",console.error(c)}}};u.addEventListener("submit",w);u.addEventListener("keydown",e=>{e.keyCode===13&&e.ctrlKey&&w(e)});function d(e){var n=e;n.scrollTop=n.scrollHeight}
