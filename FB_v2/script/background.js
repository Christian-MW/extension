'use strict';



let clientId = '428036121573-la2tbalqbsp7v884up6dupf9hibhlnc2.apps.googleusercontent.com'
let redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`
let nonce = Math.random().toString(36).substring(2, 15)



// activate extension when host is www.website.com
chrome.runtime.onInstalled.addListener(function() {
	console.log("Mostrando ágina!!!");

	const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

	authUrl.searchParams.set('client_id', clientId);
	authUrl.searchParams.set('response_type', 'id_token');
	authUrl.searchParams.set('redirect_uri', redirectUri);
	// Add the OpenID scope. Scopes allow you to access the user’s information.
	authUrl.searchParams.set('scope', 'openid profile email');
	authUrl.searchParams.set('nonce', nonce);
	// Show the consent screen after login.
	authUrl.searchParams.set('prompt', 'consent');
	
	chrome.identity.launchWebAuthFlow(
		{
		  url: authUrl.href,
		  interactive: true,
		},
		(redirectUrl) => {
		  if (redirectUrl) {
			// The ID token is in the URL hash
			const urlHash = redirectUrl.split('#')[1];
			const params = new URLSearchParams(urlHash);
			const jwt = params.get('id_token');
  
			// Parse the JSON Web Token
			const base64Url = jwt.split('.')[1];
			const base64 = base64Url.replace('-', '+').replace('_', '/');
			const token = JSON.parse(atob(base64));
  
			console.log('token', token);
		  }
		},
	  );

	

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
