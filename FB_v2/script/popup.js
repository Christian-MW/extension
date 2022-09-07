'use strict';
console.log("Cargando archivo popup");
// list of urls to navigate
var urls_list = [];
var urls_processed = [];

var pos = -1;
var currentUrl = "";
var minutesInSeg = 20;
var seg = -1; 


//var flag = 0;
var flag = new observable(2);
flag.onChange(function(v){
    console.log("");console.log("");
     console.log("value changed to: " + v);  
    if(v < 2){
         if(v == 0){        
            pos++;        
            if(pos < urls_list.length ){   
                seg = 0;
                clearTimeout(myTimeout);             
                console.log("pos: " + pos +" de "+urls_list.length ); 
                chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
                    document.getElementById(option+"lbState").innerHTML = "Procesando " + (pos + 1) + " de " + urls_list.length;
                    document.getElementById(option+"LinkProcess").innerHTML = urls_list[pos];
                    flag.setValue(1);
                    if(urls_list[pos] !== undefined && urls_list[pos] != "" && urls_list[pos].startsWith("http") ){
                        if(urls_list[pos].startsWith(domain) || urls_list[pos].startsWith("https://web.facebook.com")){
                            currentUrl = urls_list[pos];
                            console.log("Iniciando a procesar el siguiente link!!!");
                            //flag = 1;
                            
                            document.getElementById(option+"lbState").innerHTML = "Procesando " + (pos + 1) + " de " + urls_list.length;
                            document.getElementById(option+"LinkProcess").innerHTML = urls_list[pos];
                            goToPage(urls_list[pos], pos+1, tabs[0].id);    
                        }else{
                            console.log("La url no pertenece al dominio solicitado "+domain);
                            var row =["", urls_list[pos], dateTime, "N/A", "N/A", "N/A", "N/A","Dominio no permitido"];
                            urls_processed.push(row);
                            flag.setValue(0);
                        }
                    }else{
                        console.log("No es una url valida");
                        flag.setValue(0);
                    }
                });

            }else{
                clearTimeout(myTimeout);  
                document.getElementById(option+"lbState").innerHTML = "";
                document.getElementById(option+"LinkProcess").innerHTML = "";
                download(nameFileLoaded,urls_processed);
                alert("Se han procesado los links cargados, el resultado lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory+"  \n Archivo: "+nameFileLoaded);
                restart();
            }
         }else if(v==1){
            console.log("Se esta procesando el link....");                
         }
    }
});



// start navigation when #startNavigation button is clicked
fbstart.onclick = function(element) {
    // query the current tab to find its id
    console.log("Starting....")
    domain = "https://www.facebook.com";
    switchBlock("process");
    urls_processed=[];
    //element.target.hidden = true;
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
        if(urls_list.length > 0){
            dateTime = new Date().toLocaleString().substring(0,16).replace(",","");

            console.log("Agregando los encabezados!!!");
            var row =["PostName", "url", "date", "likes", "comments", "shared", "reproductions", "datails"];
            urls_processed.push(row);
            flag.setValue(0);
            
        }else{
            alert("No hay links para procesar!!!");
            restart();
            hiddenProcess();
        }

    });
};
fbcancel.onclick = function(element) {
    // query the current tab to find its id
    restart();
    switchBlock("extencion");

};

async function goToPage(url, url_index, tab_id) {
    return new Promise(function(resolve, reject) {
        // update current tab with new url
        chrome.tabs.update({url: url});
        console.log("goToPage...");
        // fired when tab is updated


        chrome.tabs.onUpdated.addListener(function openPage(tabID, changeInfo) {
            
            // tab has finished loading, validate whether it is the same tab
            if(tab_id == tabID && changeInfo.status === 'complete') {
                console.log("Carga completa!!!");
                // remove tab onUpdate event as it may get duplicated
                chrome.tabs.onUpdated.removeListener(openPage);
                
                
                // execute content script
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab_id},
                        files: ['content_scripts/script.js'],

                    }, function () { 
                     resolve(); }
                    
                );
                seg = 0;
                timer();
                // fired when content script sends a message
                //chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
                chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
                    try{

                    console.log("getDOMInfo...");
                    console.log("Finalizando el timer por respuesta del script");
                    clearTimeout(myTimeout);
                    seg = -1;
                    // remove onMessage event as it may get duplicated
                    chrome.runtime.onMessage.removeListener(getDOMInfo);

                    // save data from message to a JSON file and download
                    
                    //console.log("save data from message to a JSON file and download..");
                    let json_data = JSON.parse(message);      
                    json_data.date = dateTime;  
                    json_data.url = url;     
                    //json_data.html= json_data.html.replace("\\n","").replace("\n","");

                    try{
                        console.log("Agregando fila");
                        var row =[json_data.PostName, json_data.url, json_data.date, json_data.likes, json_data.comments, json_data.shared,json_data.reproductions,json_data.details];
                        urls_processed.push(row);
                    }catch(err){
                        console.log(err);
                    }
                    console.log("Liberando el proceso de flag....");
                    flag.setValue(0);
                    //console.log(urls_processed);
                    console.log(json_data);

                    
                    }catch(err){
                         console.log(err);
                    }
                });



        
            }
        });
    });
}













    

