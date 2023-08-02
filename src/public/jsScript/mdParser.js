import aboutMd from "../source/about.md?raw"
import * as marked_esm from "https://npm.elemecdn.com/marked/lib/marked.esm.js"
let shutDownSvg = `
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src="./assets/关闭.svg" alt="">
</div>
`
document.getElementById('view-area').innerHTML = shutDownSvg + md2Html(aboutMd)
function md2Html(md) {
    return marked_esm.marked.parse(md);
}

document.getElementById('closeAboutSvg').addEventListener('click', () => {
    document.getElementById('aboutBox').style.display = "none"
})
document.getElementById('showAbout').addEventListener('click', () => {
    document.getElementById('aboutBox').style.display = "flex"
})

