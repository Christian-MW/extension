var urlConfig = "https://docs.google.com/spreadsheets/d/1yQ41kTP39D9y7Eh3pM7yDQyLxhI-5H6-3YjbgbfD98I/gviz/tq?&sheet=MetaBusiness&tq=Select *"
var xpath ={};
var seg = 0;
var minutesInSeg = 10;
var scroll = true;
var secondsRemaining = 200;
var lastPosition = 0;
var returnMessage = false;

var htmlPost = document.createElement("div");
let href = window.location.href;

$(document).ready(function() {
 
    console.log(href);
    if(href.includes('business.facebook.com')){
        setTimeout(function(){
            minutesInSeg = 100;
            timer();
            //document.body.attributeStyleMap.set("zoom","25%");
            //window.parent.document.body.style.zoom = 0.25;

                console.log("es business");
                startScroll(secondsRemaining);
        },3000);

    }else{
        timer();
        console.log("es comunidad");
        waitForElm("div.ga8hg6jm")	
		.then((elm) => {	
            let anchor = document.getElementsByTagName("a");
            let link="";
            for (let index = 0; index < anchor.length; index++) {
                const element = anchor[index];
                link= element.attributes.href.value;
                if(link.startsWith("https://business.facebook.com/latest/posts/published_posts") || 
                    link.includes("https://business.facebook.com/latest/posts/published_posts") ||
                    link.startsWith("https://business.facebook.com/latest/home?asset_id=") || 
                    link.includes("https://business.facebook.com/latest/home?asset_id=")){
                    console.log("Se encontro una url similar!!!");
                    break;
                }
            }
            console.log("Regresando el link: "+link);
            returnMessage = true;
            chrome.runtime.sendMessage(null, link);
            seg = minutesInSeg;
        });
    }

});

function setPositionScroll() {
    //let sc = document.getElementsByClassName("ReactVirtualized__Grid _1zmk");
    let sc = document.getElementsByClassName(xpath["list_publications"][0]);
    if(sc.length > 0){
        console.log("lastPosition: "+lastPosition);
        console.log("scrollHeight: "+sc[0].scrollHeight);
        
        if (lastPosition < sc[0].scrollHeight) {

            console.log("scroleando...");
            sc[0].scrollTop  = sc[0].scrollHeight;
            lastPosition = sc[0].scrollHeight;
            //console.log(sc[0].innerHTML);
            htmlPost.innerHTML +=sc[0].innerHTML;
        }else{
            console.log("El scroll se encuentra en la parte final!!!");
            scroll = false;
            secondsRemaining = -1;
            console.log(htmlPost.innerHTML);
            //document.body.attributeStyleMap.set("zoom","100%");
            //window.parent.document.body.style.zoom = 1;
            
            returnMessage = true;
            chrome.runtime.sendMessage(null, htmlPost.innerHTML);        
            seg = minutesInSeg;
        }    
        
    }else{
        console.log("NO se encontro el contenedor :(");
        
        returnMessage = true;
		chrome.runtime.sendMessage(null, "O se encontro el contenedor");        
        seg = minutesInSeg;
    }
 }

 
function startScroll(duration) {
    secondsRemaining = duration
    let min = 0;
    let sec = 0;
    let countInterval = setInterval(function () {
        min = parseInt(secondsRemaining / 60);
        sec = parseInt(secondsRemaining % 60);
        if(scroll)
            setPositionScroll();
        secondsRemaining = secondsRemaining - 1;
        console.log("secondsRemaining: "+secondsRemaining);
        if (secondsRemaining < 0 || !scroll) { 
            console.log("Tiempo finalizado!!!");
            clearInterval(countInterval);
        };
    
    }, 5000);
 }

 function waitForElm(selector) {

	console.log("Buscando el selector:");
	console.log(selector);
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
        	//console.log("return resolve(document.querySelector(selector): ");
        	//document.querySelector(selector)
        	//getReactions(document.querySelector(selector));
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                console.log("resolve(document.querySelector(selector): ");
                console.log(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function timer(){
	seg++;
	console.log("Tiempo transcurrido "+seg+" segundos ");
    if(minutesInSeg < seg ){       
        if(!returnMessage){
		    chrome.runtime.sendMessage(null, htmlPost.innerHTML);
        }
    }

    setTimeout(function(){ 
		if(minutesInSeg > seg ){
			timer();
		}		
	}, 1000);
}


function loadConfiguration(){
    $.ajax({
        async: false,
        type: 'GET',
        url: urlConfig,
        success: function(data) {
        	console.log("#LoadConfiguration: ")
        	getDataConfiguration(JSON.parse(data.substr(47).slice(0,-2)));
        }
   });
}

loadConfiguration();

function getDataConfiguration(data){
    try{
        let rows = data.table.rows;
     
        for (var i = 0; i < rows.length; i++) {
            let r = rows[i]["c"];
            xpath[r[0]["v"]]= r[1]["v"].split(',');
        }
        console.log("Xpath: " + JSON.stringify(xpath));

    }catch(error){
        console.log(error);
    }
}
