let shutDownSvg=`
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src="./assets/关闭.svg" alt="">
</div>
`
let aboutMd=`
# 关于
本项目使用了OpenAI提供的API接口，自费购买接口，搭建服务器来构建chatGPT模型，并且使用了markdown解析文案   
让大家可以方便的，无需梯子，无需购买账号的体验一把AI的乐趣

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

document.getElementById('closeAboutSvg').addEventListener('click',()=>{
    document.getElementById('aboutBox').style.display="none"
})
document.getElementById('showAbout').addEventListener('click',()=>{
    document.getElementById('aboutBox').style.display="block"
})