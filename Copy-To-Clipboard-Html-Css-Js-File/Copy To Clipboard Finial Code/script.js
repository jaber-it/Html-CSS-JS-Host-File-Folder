function addCopyButtons(clipboard) {
    document.querySelectorAll("pre > code").forEach(function(codeBlock) {
        BtnEle = document.querySelector(".C_box_main");
        BtnEle.addEventListener("click", function() {
            clipboard.writeText(codeBlock.textContent).then(function() {
                BtnEle.classList.add("copied");
                document.getElementById("toastNotif").innerHTML="<span>Copied to Clipboard!</span>";
                setTimeout(()=>{BtnEle.classList.remove("copied")},3e3);
               console.log('Text Copy')
            }, function(error) {
                console.error(error)
            })
        });
        var pre = codeBlock.parentNode;
        if (pre.parentNode.classList.contains("textCopy")) {
            var highlight = pre.parentNode;
            highlight.parentNode.insertBefore(button, highlight)
        } else {
            pre.parentNode.insertBefore(button, pre)
        }
    })
}
if (navigator && navigator.clipboard) {
    addCopyButtons(navigator.clipboard)
} else {
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js";
    script.integrity = "sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=";
    script.crossOrigin = "anonymous";
    script.onload = function() {
        addCopyButtons(clipboard)
    };
    document.body.appendChild(script)
}