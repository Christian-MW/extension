'use strict';

let posTT = -1;
let posts = [];
let flagTT = new observable(2);
let tiktok_processed = [];
let reqTikTokSheet = {columns:null,range:null,spreadsheet_id:null}



flagTT.onChange(function(v){
    console.log("");console.log("");
    console.log("value changed to: " + v);  
    if(v < 2){
        if(v == 0){ 
            //Procesar el post
            posTT++;
            if(posTT < posts.length ){
                document.getElementById(option+"lbState").innerHTML = "Procesando "+(posTT+1)+" de " +posts.length + " post(s)";
                document.getElementById(option+"description").innerHTML ="Post "+posts[posTT].TEXTO;
                flagTT.setValue(1);

                chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
                
                    goToPageTT(posts[posTT].POST, tabs[0].id); 
                });
            }else{
                alert("El archivo sheet compartido ha sido actualizado");
                clearTT();
            }
        }
    }
});

async function goToPageTT(url,tab_id) {
    return new Promise(function(resolve, reject) {
        // update current tab with new url
        chrome.tabs.update({url: url});
        console.log("goToPageTT...");
        // fired when tab is updated
        chrome.tabs.onUpdated.addListener(function openPage(tabID, changeInfo) {
            //console.log(tabID);
            //console.log(tab_id);
            // tab has finished loading, validate whether it is the same tab
            if(tab_id == tabID && changeInfo.status === 'complete') {
                console.log("Carga completa!!!");
                // remove tab onUpdate event as it may get duplicated
                chrome.tabs.onUpdated.removeListener(openPage);
                
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab_id},
                        files: ['script/jquery.min.js','content_scripts/tiktok.js'],

                    }, function () { 
                    resolve; }                
                );  

                chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
                    try{

                        console.log("getDOMInfo...");
                        console.log("Finalizando el timer por respuesta del script");
                        // remove onMessage event as it may get duplicated
                        chrome.runtime.onMessage.removeListener(getDOMInfo);
                        // save data from message to a JSON file and download                        
                        //console.log("save data from message to a JSON file and download..");
                        if(message!=""){
                            let _json_data = JSON.parse(message);
                            saveResultSearchTT(_json_data);
                        }else{
                            flagTT.setValue(0);    
                        }
                    }catch(err){
                        console.log(err);
                        flagTT.setValue(0);
                    }
                });
            }
        });
    });

}



$("#ttstart").click(function(event){
    // query the current tab to find its id
    domain = "https://www.tiktok.com";   
    switchBlock("process");
    tiktok_processed=[];

    document.getElementById(option+"lbState").innerHTML = "";
    document.getElementById(option+"description").innerHTML ="";

    let url = $("#urlSheetTT").val();
    if(url != "" && url.startsWith("https://docs.google.com/spreadsheets/d/")){
        $("#ttstart").hide();
        url = url.replace("https://docs.google.com/spreadsheets/d/","");
        url = url.split('/')[0];
        spreadsheet_id = url;
        listControlsExecuted=[];
        listControlsExecuted.push({control:"BTN-START",module:mapOption[option.replace("-","")]});
        saveLog();

        document.getElementById(option+"lbState").innerHTML = "Procesando...";
        document.getElementById(option+"description").innerHTML = "Obteniendo los post...";

        let urlApiSheet = xpathUrl["api_java_sheet"][0];
        
        reqTikTokSheet.columns = xpathUrl["tt_columnsbase"].join();
        reqTikTokSheet.range = xpathUrl["tt_sheetname"][0];
        reqTikTokSheet.spreadsheet_id = url;

        let endponit = xpathUrl["get_sheet"][0];
        fetch(urlApiSheet+endponit, {
            method: 'POST',
            body: JSON.stringify(reqTikTokSheet),
            headers: { 'Content-Type': 'application/json',  }
        })
        .then((resp) => resp.json())
        .then(function(resp){ 
            console.log(resp);
            try {
                if(resp.code == 200){     
                    document.getElementById(option+"description").innerHTML = "Post obtenidos";
                    posts = convertDataTT(resp.objectResult);
                    console.log("flagTT");
                    console.log(flagTT);
                    flagTT.setValue(0);
                    
                }else if(resp.code == 409){
                    document.getElementById(option+"LinkProcess").innerHTML = "El archivo sheet tiene inconsitencia en la información";
                    alert("El archivo sheet tiene inconsitencia en la información");
                    clearTT();
                }else if(resp.code == 500){
                    document.getElementById(option+"LinkProcess").innerHTML = "No existe hoja "+xpathUrl["tt_sheetname"][0];
                    alert("No existe hoja "+xpathUrl["tt_sheetname"][0]);
                    clearTT();
                }
            } catch (error) {
                document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener los post";
                alert("Problemas al obtener los post");
                clearTT();
                SendMessage("TIKTOK",urlApiSheet+endponit,"",JSON.stringify(resp));
            }
        })
        .catch(function(error){
            console.log(error);          
            document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener los post";
            alert("Problemas al obtener los post");
            clearTT();
        });


    }else{
        //document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google sheets";
        alert("Ingresa una url valida de google sheets");
        switchBlock("extencion");
        //clearTT();
    }
});

function convertDataTT(objectResult){
    let searchsC=[];
    let columns = objectResult[0];
  
    for (let r = 1; r < objectResult.length; r++) {
      let row = objectResult[r];
      let obj = {};
  
      for (let index = 0; index < columns.length; index++) {
        obj[columns[index].toUpperCase()] = row[index];    
      }
      searchsC.push(obj);
  
    }

    return searchsC;
  
  }

function saveResultSearchTT(_json_data){
    document.getElementById(option+"description").innerHTML ="Guardando la información en el google sheet";
    let objPost=[{
        post:posts[posTT].POST,
        text:posts[posTT].TEXTO,
        likes:_json_data.likes,
        comments:_json_data.comments,
        favorites:_json_data.favorites,
        shareds:_json_data.shareds
    }]
    
    let rq = {
        spreadsheet_id: spreadsheet_id,
        objectResult: objPost
    }

    let urlApiSheet = xpathUrl["api_java_sheet"][0];
    let endponit = xpathUrl["sheet_tiktok"][0];
    fetch(urlApiSheet+endponit, {
        method: 'POST',
        body: JSON.stringify(rq),
        headers: { 'Content-Type': 'application/json',  }
    })
    .then((resp) => resp.json())
    .then(function(resp){ 
        try {
            let msg = "";
            if(resp.code > 0){ 
                if(resp.code == 200){      
                    msg ="El archivo sheet ha sido actualizado!!!";
                    
                }else{
                    msg ="Hubo un problema al actualizar el sheet intenta mas tarde";                                
                }
            }
            else{
                msg ="Hay un problema en el api de google intente mas tarde";                                
            }
            //alert(msg);
            //console.log("Finalizado en")
            //console.timeEnd();
        } catch (error) {
            
            //console.log("Finalizado en")
            //console.timeEnd();
            //alert("Hay un problema en el api de google intente mas tarde"); 
            SendMessage("TIKTOK",urlApiSheet+endponit,"",JSON.stringify(resp));                               
        }
        flagTT.setValue(0);
        //clearTT();
    })                
    .catch(function(error){
        console.log(error);          
        SendMessage("TIKTOK",urlApiSheet+endponit,"",(error));
        flagTT.setValue(0);
    });

}

function clearTT(){
    switchBlock("extencion");
    document.getElementById(option+"lbState").innerHTML = "";
    document.getElementById(option+"description").innerHTML ="";    
    $("#urlSheetTT").val("");
    $("#ttstart").show();
    flagTT.setValue(2);
    posTT = -1; 
    spreadsheet_id ='';    
}