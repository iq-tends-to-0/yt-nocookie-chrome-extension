document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("create").addEventListener("click", createHandler);
  document.getElementById("grayscale").addEventListener("click", grayscaleHandler);
  chrome.storage.local.get(["grayScaleBool"],(result)=>{
    const grayscaleTempBool = result.grayScaleBool;
    const element = document.getElementById("grayscale");
    
    if(grayscaleTempBool==true){
        element.innerHTML = "Grayscale:True";
    }else if (grayscaleTempBool==false){
        element.innerHTML = "Grayscale:False";
    }else{
        chrome.storage.local.set({grayScaleBool: false});
        element.innerHTML = "Grayscale:False";
        console.log("initial set to false ")
    }
})
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function grayscaleHandler(){
    chrome.storage.local.get(["grayScaleBool"],(result)=>{
        const grayscaleTempBool = result.grayScaleBool;
        
        const element = document.getElementById("grayscale");
        if(grayscaleTempBool==true){
            chrome.storage.local.set({grayScaleBool: false},()=>{});
            element.innerHTML = "Grayscale:False";
        }else if (grayscaleTempBool==false){
            chrome.storage.local.set({grayScaleBool: true},()=>{});
            element.innerHTML = "Grayscale:True";
        }else{
            // alert(grayscaleTempBool)
            chrome.storage.local.set({grayScaleBool: false},()=>{});
            element.innerHTML = "Grayscale:False";
        }
    })
}


function createHandler(e) {
    getCurrentTab().then((tab) => {
        if (tab.url.slice(0, 23) == "https://www.youtube.com")
        {

            if (tab.url.indexOf("&") != -1){
            ytID = tab.url.slice(32, tab.url.indexOf("&"));
            }
            else{
            ytID = tab.url.slice(32, tab.url.length);
            }

            console.log(ytID);
            chrome.tabs.create({
                url: `https://www.youtube-nocookie.com/embed/${ytID}?modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&color=white`
            }).then((newTab)=>{
                chrome.storage.local.get(["grayScaleBool"],(result)=>{
                    if(result.grayScaleBool){
                        chrome.scripting.insertCSS({
                            target:{tabId:newTab.id},
                            css:"body{filter:grayscale(1);}"
                        })
                    }                    
                })
                
            });
            chrome.tabs.remove(tab.id);
        }
    });
}
