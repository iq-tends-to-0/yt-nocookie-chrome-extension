

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn').addEventListener('click', clickHandler);
})


async function getCurrentTab()
{
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function clickHandler(e){
    getCurrentTab().then( tab=>{
        if ( tab.url.slice(0,23) == "https://www.youtube.com" )
        {
            const ytID = tab.url.slice(32,(tab.url.indexOf("&")))
            chrome.tabs.create({url:`https://www.youtube-nocookie.com/embed/${ytID}?modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&color=white`});
            chrome.tabs.remove(tab.id)
        }
    });
}