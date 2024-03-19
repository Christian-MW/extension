

let flagMWC = new observable(2);
let posMWC = -1; 
let searchsC = [];
let searchsCUpdate = [];
let spreadsheet_id = "";
let _filtersMeltC={
    search:"",
    dateStart:1696143600000,
    dateEnd:1699599599999,
    locations:[],
    languaje:[],
    sourcetypes:[]
}

flagMWC.onChange(function(v){
    console.log("");console.log("");
    console.log("value changed to: " + v);  
    if(v < 2){
        if(v == 0){ 
            //Procesar la busqueda
            posMWC++;
            if(posMWC < searchsC.length ){
                //procesando la Búsqueda searchsC[posMWC]
                document.getElementById(option+"lbState").innerHTML = "Procesando "+(posMWC+1)+" de " +searchsC.length + " búsqueda(s)";
                document.getElementById(option+"description").innerHTML ="Búsqueda "+searchsC[posMWC].NOMBRE;
                searchsCUpdate.push({ name: searchsC[posMWC].NOMBRE, search: searchsC[posMWC].BUSQUEDA,
                mentions: 0,authors: 0,views: 0,impressions: 0});

                flagMWC.setValue(1);
                chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
           
                    _filtersMeltC.search = searchsC[posMWC].BUSQUEDA;
                    _filtersMeltC.dateStart = new Date(parseInt(searchsC[posMWC].FECHA_INICIO.split("/")[2]),parseInt(searchsC[posMWC].FECHA_INICIO.split("/")[1])-1, parseInt(searchsC[posMWC].FECHA_INICIO.split("/")[0]) , 1, 0, 0, 0).getTime();
                    _filtersMeltC.dateEnd = new Date(parseInt(searchsC[posMWC].FECHA_FIN.split("/")[2]),parseInt(searchsC[posMWC].FECHA_FIN.split("/")[1])-1, parseInt(searchsC[posMWC].FECHA_FIN.split("/")[0]) , 23, 59, 59, 0).getTime();
                    try {
                        _filtersMeltC.languaje=[];
                        let langs = searchsC[posMWC].IDIOMA.split(',');
                        for (let l = 0; l < langs.length; l++) {
                            Object.keys(DataFiltersMelt.languaje).forEach(function(item){
                                let v = removeSpecialCharacters(DataFiltersMelt.languaje[item]);
                                let vl = removeSpecialCharacters(langs[l]);
                                if( v.toLowerCase().trim().replaceAll(" ","") == vl.toLowerCase().trim().replaceAll(" ","")){                                     
                                    _filtersMeltC.languaje.push(item.toLowerCase());
                                }                    
                            });          
                        }
                        
                    } catch (error) {
                        console.log(error);
                    }
                    try {
                        _filtersMeltC.locations=[];
                        let locs = searchsC[posMWC].UBICACIÓN.split(',');
                        for (let l = 0; l < locs.length; l++) {
                            Object.keys(DataFiltersMelt.location).forEach(function(item){
                                let v = removeSpecialCharacters(DataFiltersMelt.location[item]);
                                if(v.toLowerCase().trim().replaceAll(" ","") == removeSpecialCharacters(locs[l]).toLowerCase().trim().replaceAll(" ","")){
                                     
                                    _filtersMeltC.locations.push(item.toLowerCase());
                              }                    
                            });          
                        }
                        
                    } catch (error) {
                        console.log(error);
                    }
                    try {
                        _filtersMeltC.sourcetypes=[];
                        let sourcs = searchsC[posMWC]["FUENTE(SOURCE TYPE)"].split(',');
                        for (let l = 0; l < sourcs.length; l++) {
                            Object.keys(DataFiltersMelt.sourcetype).forEach(function(item){
                                if(removeSpecialCharacters(DataFiltersMelt.sourcetype[item]).toLowerCase().trim().replaceAll(" ","") == removeSpecialCharacters(sourcs[l]).toLowerCase().trim().replaceAll(" ","")){
                                     _filtersMeltC.sourcetypes.push(item.toLowerCase());
                              }                    
                            });          
                        }
                        
                    } catch (error) {
                        console.log(error);
                    }
                    
                    goToPagemwc(xpathUrl["ms_link_serach"][0], tabs[0].id); 
                    
                });
                
            }
            else{
                //no hay más búsquedas por procesar
                alert("Las búsquedas han sido procesadas, el resultado se puede ver en el archivo sheet procesado.");
                flagMWC.setValue(0);
                clearMwc();                
            }
        }
    }
});

function saveResultSearch(){
    document.getElementById(option+"description").innerHTML ="Guardando la información en el google sheet";
    let searchsCUpdateTemp = [searchsCUpdate[posMWC]];
                let rq = {
                    spreadsheet_id: spreadsheet_id,
                    objectResult: searchsCUpdateTemp
                }
                
                let urlApiSheet = xpathUrl["api_java_sheet"][0];
                let endponit = xpathUrl["sheet_mwc"][0];
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
                        SendMessage("Meltwater búsquedas",urlApiSheet+endponit,"",JSON.stringify(resp));                               
                    }
                    flagMWC.setValue(0);
                    //clearMwc();
                })                
                .catch(function(error){
                    console.log(error);          
                    //document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las búsquedas";
                    //alert("Problemas al actualizar las búsquedas");
                    //clearMwc();
                    SendMessage("Meltwater búsquedas",urlApiSheet+endponit,"",(error));
                    flagMWC.setValue(0);
                });
}
async function goToPagemwc(url,tab_id) {
    return new Promise(function(resolve, reject) {
        // update current tab with new url
        chrome.tabs.update({url: url});
        console.log("goToPagemwc...");
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
                        files: ['script/jquery.min.js'],

                    }, function () { 
                    resolve; }                
                );  

                dataApisMelt.tokenAuthMelt = xpathUrl["tokenAuthMelt"][0];
                dataApisMelt.mw_api_search = xpathUrl["mw_api_search"][0];
                dataApisMelt.mw_api_grapql = xpathUrl["mw_api_grapql"][0];
                dataApisMelt.mw_api_runes = xpathUrl["mw_api_runes"][0];
                dataApisMelt.mw_api_users = xpathUrl["mw_api_users"][0];
                dataApisMelt.XClientName = xpathUrl["XClientName"]; 
                PARAMETERS_API_MELT.includeUsers = false;
                chrome.scripting.executeScript({
                    target: {tabId: tab_id},
                    func: meltInject,
                    args:[
                        JSON.stringify(dataApisMelt),
                        JSON.stringify(_filtersMeltC),
                        JSON.stringify(PARAMETERS_API_MELT)
                    ]
                }, 
                function () { 
                    resolve; 
                });
                // fired when content script sends a message
                //chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
                chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
                    try{

                        console.log("getDOMInfo...");
                        console.log("Finalizando el timer por respuesta del script");
                        // remove onMessage event as it may get duplicated
                        chrome.runtime.onMessage.removeListener(getDOMInfo);
                        // save data from message to a JSON file and download                        
                        //console.log("save data from message to a JSON file and download..");
                        if(message==""){
                            //No se encontro información
                            alert("Hay un problema con el api de Melt intenta mas tarde");
                            clearMwc();
                        }else{                        
                            let _json_data = JSON.parse(message);                             
                            //console.log("Respuesta de la funcion injectada");
                            //console.log(message);
                            console.log("Obteniendo el dato de la descarga");
                            resultReadFile =""; 
                            let rt = getTotals(_json_data.searchResponse);
                            searchsCUpdate[posMWC].mentions = rt.m;
                            searchsCUpdate[posMWC].authors = rt.a;
                            searchsCUpdate[posMWC].views = rt.v;
                            searchsCUpdate[posMWC].reach = rt.r;
                            searchsCUpdate[posMWC].impressions = rt.i;
                            searchsCUpdate[posMWC].downloads = {};
                            let downloads=[];
                            if(searchsC[posMWC].DESCARGAS.includes("*")){
                                downloads = ["i","a","v","m"];
                            }else{
                                downloads = searchsC[posMWC].DESCARGAS.toLowerCase().replaceAll(" ","").split(",");
                            }
                            
                            if(downloads.length > 0){
                                let codeDownloads = {i:'impressions',a:'authors',r:'reach',v:'views',m:'mentions'};
                                           
                                for (let index = 0; index < downloads.length; index++) {
                                    try {
                                        if(downloads[0].length > 0 ){ 
                                            let cd = codeDownloads[downloads[index]];
                                            let cdv = rt[downloads[index]+"d"];
                                            searchsCUpdate[posMWC].downloads[cd] = cdv; 
                                        }                                           
                                    } catch (error) {
                                        console.log(error);
                                    }                                        
                                }                                    
                                
                            }

                            //revisamos si hay algun otra Búsqueda por procesar
                            //flagMWC.setValue(0);
                            saveResultSearch();
                        }
                    }catch(err){
                        console.log(err);
                        flagMWC.setValue(0);
                    }
                });
            }
        });
    });
}
;
$("#mwcstart").click(function(event){
    console.log("Iniciando proceso del modulo")
    console.time();
    
    searchsC = [];
    searchsCUpdate=[];
    posMWC = -1;
    spreadsheet_id = "";

    document.getElementById(option+"lbState").innerHTML = "";
    document.getElementById(option+"description").innerHTML ="";
    
    let url = $("#urlSheetmwc").val();
    if(url != "" && url.startsWith("https://docs.google.com/spreadsheets/d/")){
        url = url.replace("https://docs.google.com/spreadsheets/d/","");
        url = url.split('/')[0];
        $(".mwc-contairner-process").show();

        document.getElementById(option+"lbState").innerHTML = "Procesando...";
        document.getElementById(option+"description").innerHTML = "Obteniendo las búsquedas...";

        urlApiSheet = xpathUrl["api_java_sheet"][0];
        $("#mwcstart").hide();
        spreadsheet_id = url;

        reqMeltSearch.columns = xpathUrl["mwc_columnsbase"].join();
        reqMeltSearch.range = xpathUrl["mwc_sheetname"][0];
        reqMeltSearch.spreadsheet_id = url;

        let endponit = xpathUrl["get_sheet"][0];
        fetch(urlApiSheet+endponit, {
            method: 'POST',
            body: JSON.stringify(reqMeltSearch),
            headers: { 'Content-Type': 'application/json',  }
        })
        .then((resp) => resp.json())
        .then(function(resp){ 
            console.log(resp);
            try {
                if(resp.code == 200){     
                    document.getElementById(option+"description").innerHTML = "Búsquedas obtenidas";
                    searchsC = mwcconvertData(resp.objectResult);
                    flagMWC.setValue(0);
                }else if(resp.code == 409){
                    document.getElementById(option+"LinkProcess").innerHTML = "El archivo sheet tiene inconsitencia en la información";
                    alert("El archivo sheet tiene inconsitencia en la información");
                    clearMwc();
                }else if(resp.code == 500){
                    document.getElementById(option+"LinkProcess").innerHTML = "No existe hoja "+xpathUrl["mwc_sheetname"][0];
                    alert("No existe hoja "+xpathUrl["mwc_sheetname"][0]);
                    clearMwc();
                }
            } catch (error) {
                document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las búsquedas";
                alert("Problemas al obtener las búsquedas");
                clearMwc();
                SendMessage("Meltwater búsquedas",urlApiSheet+endponit,"",JSON.stringify(resp));
            }
        })
        .catch(function(error){
            console.log(error);          
            document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las búsquedas";
            alert("Problemas al obtener las búsquedas");
            clearMwc();
        });

    listControlsExecuted.push({control:"BTN-START",module:mapOption[option.replace("-","")]});
    saveLog();
    }else{
        document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google sheets";
            alert("Ingresa una url valida de google sheets");
    }

})

function mwcconvertData(objectResult){
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

  function clearMwc(){
    document.getElementById(option+"lbState").innerHTML = "";
    document.getElementById(option+"description").innerHTML ="";    
    $("#urlSheetmwc").val("");
    $("#mwcstart").show();

    posMWC = -1; 
    searchsC = [];
    searchsCUpdate = [];
    spreadsheet_id = "";
    _filtersMeltC={
        search:"",
        dateStart:1696143600000,
        dateEnd:1699599599999,
        locations:[],
        languaje:[]
    }

}