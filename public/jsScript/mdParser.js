let shutDownSvg=`
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src="./assets/关闭.svg" alt="">
</div>
`
let aboutMd=`
# 关于
本项目使用了OpenAI提供的API接口，自费购买接口，搭建服务器来构建chatGPT模型，并且使用了markdown解析文案   
让大家可以方便的，无需梯子，无需购买账号的体验一把AI的乐趣

## 公告
如果寄了，请等待几小时再来看看

## Todo
+ 自动解析markdown

## 作者
**Bigonion**

## 开源协议

**MIT**
## Namespace
[https://bigonion.cn](https://bigonion.cn)
`

function mdConverter() {
    // var md = document.getElementById("md-area").value;
    var converter = new showdown.Converter();  //增加拓展table
    converter.setOption('tables', true);  //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
    var view = converter.makeHtml(aboutMd);
    console.log(view);
    document.getElementById("view-area").innerHTML = shutDownSvg+view;
}
mdConverter()

//////Show and hidden Event//////
// kit.setCookie("notes",10,)

document.getElementById('closeAboutSvg').addEventListener('click',()=>{
    document.getElementById('aboutBox').style.display="none"
})
document.getElementById('showAbout').addEventListener('click',()=>{
    document.getElementById('aboutBox').style.display="flex"
})

// 解析gpt markdown回答
async function parseGptAnswer(raw){
    var md = markedParse(raw)
    md = await latexParse(md)
    hljs.highlightAll()
    return md
}
// 最小组成
function latexParse(md) {
    return new Promise((resolve) => {
        let reg1 = /\$.*?\$/g //含有$的
        let reg2 = /(?<=\$)(.+?)(?=\$)/g
        let parsedTex = new Array()
        let origin = md
        let latex = md.match(reg1)
        let latexIndex = getRegIndex(md, reg1)
        let finalResult = ""
        if (latex) {
            try {
                latex.forEach((ele, index) => {
                    ele = ele.match(reg2)
                    if (ele) {
                        parsedTex[index] = katex.renderToString(ele[0], {
                            throwOnError: false
                        })
                    } else {
                        parsedTex[index] = "<span style='color:#cc0000;'>ERR_NULL</span>"
                    }
                })
                md = md.replace(reg1, "<!temp?.!>")
                md = md.split("<!temp?.!>")
                parsedTex = [...parsedTex, ""]
                for (let i = 0; i <= md.length - 1; i++) {
                    finalResult += md[i] + parsedTex[i]
                    // console.log(finalResult);
                    if (i == md.length - 1) {
                        resolve(finalResult)

                    }
                }
            } catch (err) {
                console.log(err)
                return 5
            }
        }
        else resolve(origin)
    })
}

function markedParse(md) {
    return marked.parse(md)
}

function getRegIndex(text, regex) {
    // const text = '$匹配我$ $匹配我$ 不要匹配我 $匹配我$'
    // const regex = /\$(.*?)\$/g
    const result = Array.from(text.matchAll(regex), match => match.index)
    return result
}
//最小组成