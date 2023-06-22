console.log("content script");
let isRecording = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      
      initialize();
      prompt = request.prompt;
      setTextareaValue(document.getElementById("prompt-textarea"),prompt)
      
    }
  );

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

initialize = ()=>{

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const recordButton = document.createElement('div');
        recordButton.id = 'recordButton';
        recordButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 12V6c0-2.217-1.785-4.021-3.979-4.021a.933.933 0 0 0-.209.025A4.006 4.006 0 0 0 8 6v6c0 2.206 1.794 4 4 4s4-1.794 4-4zm-6 0V6c0-1.103.897-2 2-2a.89.89 0 0 0 .163-.015C13.188 4.06 14 4.935 14 6v6c0 1.103-.897 2-2 2s-2-.897-2-2z"></path><path d="M6 12H4c0 4.072 3.061 7.436 7 7.931V22h2v-2.069c3.939-.495 7-3.858 7-7.931h-2c0 3.309-2.691 6-6 6s-6-2.691-6-6z"></path></svg>'
        recordButton.className = " absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 dark:hover:bg-green-900 right- enabled:bg-brand-red text-white bottom-1.5 transition-colors disabled:opacity-40 record"

        recordButton.addEventListener('click', () => {
            toggleRecording();
        });
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = true;
    
        node = document.getElementById("prompt-textarea")
        sendButton = node.nextSibling;
        node.parentNode.insertBefore(recordButton, node.nextSibling)

        recognition.onresult = (event) => {
            const { transcript } = event.results[event.resultIndex][0]
            setTextareaValue( node,node.value + " " + transcript);
        };           
    
    
        function toggleRecording() {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }


    
        function startRecording() {
            isRecording = true;
            recordButton.classList.toggle("record");
            recordButton.classList.toggle("stop");
            recognition.start();
        }
        function stopRecording() {
            isRecording = false;
            recognition.stop();
            recordButton.classList.toggle("stop");
            recordButton.classList.toggle("record");
        }
    
    }
    
}

// initialize();

// new MutationObserver(function(mutations) {
//     if(mutations[0].addedNodes.length>0)
//         return;
//     initialize();
// }).observe(
//     document.getElementsByTagName('main')[0],
//     { subtree: true, characterData: true, childList: true }
// );

new MutationObserver(function(mutations) {
    initialize();
}).observe(
    document.querySelector('title'),
    { subtree: true, characterData: true, childList: true }
);