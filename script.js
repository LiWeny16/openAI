// import bot from '/assets/bot.svg'
// import user from '/assets/user.svg'

// import { load } from "cheerio"
// import { application } from "express"

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

//////////////

//////////////

let loadInterval

function loader(ele) {
  ele.textContent = ""
  loadInterval = setInterval(() => {
    ele.textContent += "."
    if (ele.textContent === "....") {
      ele.textContent = ""
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      // element.innerHTML = parseGptAnswer(element.innerHTML)
      index++
    } else {
      clearInterval(interval)
    }
  }, 20)

}

function generateUniqueId() {
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
        <div class= "wrapper ${isAi && 'ai'}">
            <div class = "chat">
                <div class= "profile">
                    <img 
                    alt="${isAi ? "./assets/bot.svg" : "./assets/user.svg"}"
                    src="${isAi ? "./assets/bot.svg" : "./assets/user.svg"}" 
                     />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        <div>
        `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)
  if (data.get('prompt').replace(/(\s)|(\\n)/g, "") === "") {
    alert("你啥都没输入！")
  } else {
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'), "yourQues") //data.get('表单的name属性 ')
    form.reset()
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, '', uniqueId)
    chatContainer.scrollTop = chatContainer.scrollHeight
    const messageDiv = document.getElementById(uniqueId)

    loader(messageDiv)

    //fetch 
    // http://47.113.229.110:8082
    // http://127.0.0.1:5500/client/#
    try {
      const response = await fetch('https://d3b24d7.r8.cpolar.top/', {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          prompt: data.get('prompt')
        })
      })
      clearInterval(loadInterval)
      messageDiv.innerHTML = ""
      if (response.ok) {
        const data = await response.json()
        const parsedData = data.bot.trim()
        typeText(messageDiv, parsedData)
      } else {
        // const err = await response.text()
        messageDiv.innerHTML = "【网络错误】别骂了别骂了，在修了在修了😅"
      }
    } catch (err) {
      clearInterval(loadInterval)
      messageDiv.innerHTML = "【网络错误】别骂了别骂了，在修了在修了😅"
      console.log("err:" + " " + err);
    }

  }

}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && e.ctrlKey) {
    handleSubmit(e)
  }
})

