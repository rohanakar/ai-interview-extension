const content = document.getElementById("content");
var itemList = [];
function loadItemListFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["itemList"], function (result) {
            var list = [];
            if (result.itemList) {
                list = result.itemList;
            }
            resolve(list);
        })
    })
}

itemList = await loadItemListFromStorage();


for (var index in itemList) {
    let item = itemList[index]; 
    var chip = document.createElement("div");
    chip.className = "chip";

    var heading = document.createElement("h3");
    heading.textContent = item['role'];

    var subheading = document.createElement("p");
    subheading.textContent = item['company']

    chip.appendChild(heading);
    chip.appendChild(subheading);
    chip.addEventListener("click",setPrompt(item['description']));
    content.append(chip)
}

function setPrompt(prompt){
    return (e)=>{
        ( () => {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                const tab = tabs[0];
                console.log(tab);
                chrome.tabs.sendMessage(tab.id, {prompt});
            });
            
          })();
    }
}

function setTextareaValue(node,text) {
    const textarea = node;
    function setNativeValue(element, value) {
        const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {}
        const prototype = Object.getPrototypeOf(element)
        const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {}

        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value)
        } else if (valueSetter) {
            valueSetter.call(element, value)
        } else {
            throw new Error('The given element does not have a value setter')
        }
    }
    setNativeValue(textarea, text)
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
}