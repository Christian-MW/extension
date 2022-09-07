'use strict';


// activate extension when host is www.website.com
chrome.runtime.onInstalled.addListener(function() {
	console.log("Mostrando ágina!!!");
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'www.facebook.com'},
        })
      ],
        actions: [new chrome.declarativeContent.ShowPageAction()]


    }]);
  });

});




/*
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.tabs.onActivated.addListener(async () => {	
    console.log(await getCurrentTab());
})
*/


/*
chrome.tabs.onActivated.addListener(async () => {

	let queryOptions = { active: true, currentWindow: true };
  	let [tab] = await chrome.tabs.query(queryOptions);

	var time = +new Date();
	var url = tab.url;

	if(url.includes("www.facebook.com")){

	    console.log(tab.title);
	    console.log(tab.url);
	    console.log(tab.status);

	  	chrome.storage.local.get("visitedPages", function(items) {
		    if (!chrome.runtime.error) {
		      console.log("items: ",items);

		      chrome.storage.local.set({'visitedPages':url}, function () {
			        console.log("Just visited", url);
			    });

			}else{
				console.log("error");
			}
	  	}); 
	}

console.log("");console.log("");
})
*/
