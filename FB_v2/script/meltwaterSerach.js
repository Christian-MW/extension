loadSheet("MeltwterSearch");
//let searchs=[];

let searchs = [
    {"NOMBRE":'Rendichicas','FECHAINICIO':'10/01/2022','FECHAFIN':'10/08/2022','BUSQUEDA':'("Rendichicas" OR #Rendichicas OR @RendiChicasGas) AND NOT ("https://t.co/W2K00OiwUf" OR "quisiera vivir abrazada de las rendichicas" OR "2 moods en el gc" OR "HOME EN HONOR" OR from:starlightofhobi OR "bts" OR from:lovserhsk OR from:Canarybangtan OR "qué hacía antes de rendichicas" OR from:starlightofhobi OR "free rendichicas" OR "rendichicas best gc" OR "disband" OR "morras de rendichicas" OR from:aritzell OR from:eversincehobi OR "What if we kissed" OR "para qué ir hasta los ángeles a la pink wall cuando puedo ir a un rendichicas" OR "me quiero casar" OR "ODA" OR "t olvidas de las" OR "minions" OR @starlightofhobi OR from:starlightofhobi OR @goldrushjm OR from:goldrushjm OR "prueba de la dictadura" OR "unique" OR "diamond" OR "bities" OR "mas perfect" OR @jimenavmin OR from:jimenavmin OR "concert" OR @kookieslys OR from:kookieslys OR @lovserhsk OR from:lovserhsk OR "Tammy" OR @rendichica OR from:rendichica OR "discography" OR @moonlightskjn OR from:w0nderxhttp OR @w0nderxhttp OR "BTS" OR #BTS OR "girlband" OR @mulberryxmin OR from:mulberryxmin OR @eversincehobi OR from:eversincehobi OR @beomgyusivy OR from:beomgyusivy OR from:goldrushjm OR @goldrushjm OR @moonlightskjn OR from:moonlightskjn)'},
    {"NOMBRE":'Chevron (filtro MX/Español)','FECHAINICIO':'10/01/2022','FECHAFIN':'10/08/2022','BUSQUEDA':'("Chevron Havoline México" OR "Chevron Havoline" OR #ChevronMx OR #ChevronHavoline OR "Chevron" OR #Chevron OR @HavolineMx OR #HavolineLoTiene) AND NOT ("Toros de Tijuana" OR "estadio" OR #YoCreoEnToros OR "juego" OR "beisbol" OR #SerieDelRey OR from:TorosDeTijuana OR from:septimaentrada_ OR from:LigaMexBeis OR "@TorosDeTijuana" OR "toros" OR "LMB" OR "Ecuador" OR "PetroPiar" OR "Alberto Baldonado" OR "Stevie Wilkerson" OR "YPF" OR "Pablo Fajardo" OR #JugadorDestacado OR "Barrick Gold")'}
    ];
    
let ctrlsToFind = [
       {
          "step":2,
          "name":"",
          "tagName":"flux-button",
          "className":"",
          "id":"",
          "attr":"data-test-id=update-results",
          "text":"",
          "html":"",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"btn_start_search",
                "tagName":"button",
                "className":"button dense hasLabel type-outline tint-primary",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"click",
             }
          ]
       },
       {
          "step":4,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Mentions Trend",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"btn_download_mentions_trend",
                "tagName":"flux-list-item",
                "className":"",
                "id":"",
                "attr":"ng-click=$ctrl.clickEvent(item.click)",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"click"
             }
          ]
       },
       {
          "step":1,
          "name":"text_search",
          "tagName":"div",
          "className":"cm-activeLine cm-line",
          "id":"",
          "attr":"",
          "text":"",
          "html":"",
          "finded":null,
          "chil":[],
          "action":"setText",
       },
       {
          "step":3,
          "name":"",
          "tagName":"md-tab-item",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Analytics",
          "finded":null,
          "action":"click",
          "chil":[]
       },
       {
          "step":5,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Total Mentions",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"totalmentions",
                "tagName":"span",
                "className":"mw-label-formatted-number__value",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"getText"
             }
          ]
       },
       {
          "step":6,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Mentions/Day Average",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"mentionsdayaverage",
                "tagName":"span",
                "className":"mw-label-formatted-number__value",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"getText"
             }
          ]
       },
       {
          "step":7,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Total Engagement",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"totalengagement",
                "tagName":"span",
                "className":"mw-label-formatted-number__value",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"getText"
             }
          ]
       },   
    ];  

let reqMeltSearch = {
    columns:"",
    range:"",
    spreadsheet_id:""
  }

  let objSearch ={};
  let objSearchResult ={ search:"", totalmentions:"", mentionsdayaverage:"", totalengagement:"" }
  let listSearchResult =[];
  let lastpathFilnameGlobal ="";
  let flagSearch = new observable(2);
  flagSearch.onChange(function(v){
        console.log("");console.log("");
        console.log("value changed to: " + v);  
        if(v < 2){
            if(v == 0){ 
                //Procesar la busqueda
                pos++;
                console.log("pos: "+pos+" < searchs.length: "+searchs.length);
                if(pos < searchs.length ){
                    flagSearch.setValue(-1);
                    console.log("Iniciando la búsqueda: "+searchs[pos].NOMBRE);
                    document.getElementById(option+"description").innerHTML = "Procesando la búsqueda "+searchs[pos].NOMBRE;
                    objSearch.text_search = searchs[pos].BUSQUEDA;
                    objSearchResult.search = searchs[pos].NOMBRE;
                    
                    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
           
                        goToPageMws(xpathUrl["ms_link_serach"][0], tabs[0].id); 
                        
                    });
                    
                }
                else{  
                    //Búsquedas procesadas 
                    
                    reqMeltSearch.objectResult = listSearchResult;
                    let endponit = xpathUrl["mws_update_sheet"][0];
                    reqMeltSearch.range = xpathUrl["ms_sheetname_update"][0];
                    console.log(reqMeltSearch);   
                    console.log(JSON.stringify(reqMeltSearch));  
                    fetch(urlApiSheet+endponit, {
                        method: 'POST',
                        body: JSON.stringify(reqMeltSearch),
                        headers: { 'Content-Type': 'application/json',  }
                    })
                    .then((response) => response.json())
                    .then(function(response){
                        if(response.code == 200){
                        alert("Las publicaciones se encuentran actualizadas en el google sheet");
                        }else if(response.code == 500){
                        alert("Algo salio mal en la actualización del google sheet");
                        }
                        clearMtbs(); 
                    })             
                    .catch(function(error){
                        console.log(error);                          
                        alert("Problemas al actualizar las publicaciones");
                        clearMtbs(); 
                    });
                            
                }
            }            
        }     
    });

    function convertData(objectResult){
        searchs=[];
        let columns = objectResult[0];
      
        for (let r = 1; r < objectResult.length; r++) {
          let row = objectResult[r];
          let obj = {};
      
          for (let index = 0; index < columns.length; index++) {
            obj[columns[index].toUpperCase()] = row[index];    
          }
          searchs.push(obj);
      
        }
      
      }

  $("#mwsstart").click(function(event){
    let url = $("#urlSheetmws").val();
    if(url != "" && url.startsWith("https://docs.google.com/spreadsheets/d/")){
        url = url.replace("https://docs.google.com/spreadsheets/d/","");
        url = url.split('/')[0];
        $(".mws-contairner-process").show();
        document.getElementById(option+"lbState").innerHTML = "Procesando...";
        document.getElementById(option+"description").innerHTML = "Obteniendo las búsquedas...";
        urlApiSheet = xpathUrl["api_java_sheet"][0];
        $("#mwsstart").hide();
        reqMeltSearch.columns = xpathUrl["ms_columnsbase"].join();
        reqMeltSearch.range = xpathUrl["ms_sheetname"][0];
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
              convertData(resp.objectResult);
              console.log(searchs.length);
              flagSearch.setValue(0);

            }else if(resp.code == 409){
              document.getElementById(option+"LinkProcess").innerHTML = "El archivo sheet tiene inconsitencia en la información";
              alert("El archivo sheet tiene inconsitencia en la información");
              clearMtbs();
            }else if(resp.code == 500){
              document.getElementById(option+"LinkProcess").innerHTML = "No existe hoja "+xpathUrl["sheetname"][0];
              alert("No existe hoja "+xpathUrl["sheetname"][0]);
              clearMtbs();
            }

          } catch (error) {
            document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las publicaciones";
            alert("Problemas al obtener las publicaciones");
            clearMtbs();
          }

        })
       .catch(function(error){
          console.log(error);          
          document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las publicaciones";
          alert("Problemas al obtener las publicaciones");
          clearMws();
       });


        

    }else{ 
        document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google sheets";
        alert("Ingresa una url valida de google sheets");
        clearMws();
      }
  });


async function goToPageMws(url,tab_id) {
    return new Promise(function(resolve, reject) {
        
        // update current tab with new url
        chrome.tabs.update({url: url});
        console.log("goToPageMws...");
        // fired when tab is updated
        
        chrome.tabs.onUpdated.addListener(function openPage(tabID, changeInfo) {
            console.log(tabID);
            console.log(tab_id);
            // tab has finished loading, validate whether it is the same tab
            if(tab_id == tabID && changeInfo.status === 'complete') {
                console.log("Carga completa!!!");
                // remove tab onUpdate event as it may get duplicated
                chrome.tabs.onUpdated.removeListener(openPage);
                
                chrome.scripting.executeScript({
                    target: {tabId: tab_id},
                    func: injectScript,
                    args: [JSON.stringify(searchs[pos]),JSON.stringify(ctrlsToFind)],
                  }, 
                  function () { 
                    resolve(); 
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
                        let json_data = JSON.parse(message);  
                        console.log("Respuesta de la funcion injectada");
                        console.log(message);
                        console.log("Obteniendo el dato de la descarga");
                        resultReadFile ="";                        
                        //readTextFile();
                        getFiles()
                        setTimeout(function(){ 
                            console.log("Termino la espera!!!");
                            if(pathFilnameGlobal != lastpathFilnameGlobal)
                                json_data.valuesFile=resultReadFile;
                            else
                                json_data.valuesFile="";

                            listSearchResult.push(json_data);
                            flagSearch.setValue(0);
                        }, 10000);
                        
                    
                    }catch(err){
                         console.log(err);
                    }
                });

            }
        });
    });
}

function clearMws(){
    $("#mwsstart").show();
    $(".mtbs-contairner-process").hide();
    $(".mtbs-lbState").val("");
    $(".mtbs-description").val("");
    reqMeltSearch = {
        columns:"",
        range:"",
        spreadsheet_id:""
      }
      $("#urlSheetmws").val(""); 
}

/*
*
*
*
*
*
*
**Datos de funciones inyectadas a la página
*
*
*
*

*/

function injectScript(_search, _ctrlsToFind) {
    console.log("Funcion inyectada!!!");
	
	let search = JSON.parse(_search);
    let ctrlsToFind = JSON.parse(_ctrlsToFind);
    
    function observableS(v){
        this.value = v;
        
        this.valueChangedCallback = null;
        
        this.setValue = function(v){
            if(this.value != v){
                this.value = v;
                this.raiseChangedEvent(v);
            }
        };

        this.getValue = function(){
            return this.value;
        };
        
        this.onChange = function(callback){
            this.valueChangedCallback = callback;
        };
        
        this.raiseChangedEvent = function(v){
            if(this.valueChangedCallback){
                this.valueChangedCallback(v);
            }   
        };
    }

    let ctrl;
    let finded = false;
    let containerPather = document.querySelectorAll('mi-app-chrome-content');
    let result =[];
    let finishedSleep = false;

    let objSearch ={ text_search:"", startDate:"", endDate:"" }
    let objSearchResult ={ search:"", totalmentions:"", mentionsdayaverage:"", totalengagement:"" }
    let listSearchResult =[];

    let pos = -1; 
    let indexCtrl = -1;
    let retryFind = 3;
    let flag = new observableS(-1);
    flag.onChange(function(v){
        console.log("");console.log("");
        console.log("value changed to: " + v);  
        if(v >= 0){
            if(v == 1){ 
                //Procesar un control
                pos++;
                console.log("pos: "+pos+" < ctrlsToFind.length: "+ctrlsToFind.length);
                if(pos < ctrlsToFind.length ){
                    flag.setValue(-1);
                    
                    indexCtrl++;
                    processCtrls(ctrlsToFind, false);
                    
                }
                else{  
                    //Controles procesadas
                    console.log("Finaliado!!!");
                    console.log(objSearchResult);
                    console.log(JSON.stringify(objSearchResult));
                    chrome.runtime.sendMessage(null, JSON.stringify(objSearchResult));         
                }
            }else if(v == 3){
                retryFind--;
                if(retryFind > 0){
                    setTimeout(function(){ 
                        flag.setValue(-1);
                        processCtrls(ctrlsToFind, false);                        
                    }, 3000);
                }else{
                    flag.setValue(-1);
                    flag.setValue(1);
                }

                
            }
            
        }     
    });



    function find(Pather, ctrlToFind) {
        //////console.log(Pather);
        if (Pather != null) {
            let shadow = Pather.shadowRoot;
            let children = [];

            if (!finded) {
                if (shadow != null) {
                    children = shadow.children;
                    ////////console.log("Hijos en Shadow");
                    for (let c = 0; c < children.length; c++) {

                        if (ctrlToFind.tagName.toLowerCase() == children[c].localName) {
                                                    
                            if (ctrlToFind.id != "") {
                                if (ctrlToFind.id == children[c].id) {

                                    console.log("Encontrado!!!");
                                    finded = true;
                                    ctrl = children[c];
                                }
                            } 
                            else if (ctrlToFind.className != "") {
                                if (ctrlToFind.className == children[c].className) {
                                    if (ctrlToFind.attr != "") {
                                        let attr = children[c].attributes;
                                        let prop = ctrlToFind.attr.split('=');
                                        for (let a = 0; a < attr.length; a++) {
                                            ////////console.log("attr[a]: "+attr[a]);
                                            if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                                console.log("Encontrado!!!");	
                                                finded = true;
                                                ctrl = children[c];
                                            }
                                        }
                                    } 
                                    else {

                                        console.log("Encontrado!!!");	
                                        finded = true;
                                        ctrl = children[c];
                                    }

                                    if (finded) {
                                        if (ctrlToFind.text != "") {
                                            ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                            ////////console.log("children[c].innerText: "+children[c].innerText);									
                                            if (ctrlToFind.text != children[c].innerText) {
                                                console.log("NO coincide el texto");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        } 
                                        else if (ctrlToFind.html != "") {
                                            //////console.log("children[c].innerText: "+children[c].innerHTML);
                                            if (!children[c].innerHTML.includes(ctrlToFind.html)) {
                                                console.log("NO cointine el html");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        }
                                    }
																		
                                }
                            } 
                            else if (ctrlToFind.attr != "") {
                                let attr = children[c].attributes;
                                let prop = ctrlToFind.attr.split('=');
                                for (let a = 0; a < attr.length; a++) {
                                    ////////console.log("attr[a]: "+attr[a]);
                                    if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                        console.log("Encontrado!!!");	
                                        finded = true;
                                        ctrl = children[c];
                                    }
                                }
                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);
                                        if (ctrlToFind.text != children[c].innerText) {
                                            console.log("NO coincide el texto 2");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    } 
                                    else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.html)) {
                                            console.log("NO contiene el html 2");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    }
                                }
								

                            } 
                            else if (ctrlToFind.text != "") {
                                ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                ////////console.log("children[c].innerText: "+children[c].innerText);
                                if (ctrlToFind.text == children[c].innerText) {
                                    finded = true;
                                    ctrl = children[c];
                                }
                            } 
                            else if (ctrlToFind.html != "") {
                                //////console.log("children[c].innerText: "+children[c].innerHTML);
                                if (children[c].innerHTML.includes(ctrlToFind.html)) {
                                    finded = true;
                                    ctrl = children[c];
                                }
                            }
                        }

                        if (finded) {
                            console.log("Encontrado!!!");		
							ctrlToFind.finded = children[c];
							//action(ctrlToFind);
                            break;
                        } 
                        else {
                            //////console.log("Buscando en los Hijos del Pather");
                            find(children[c], ctrlToFind);
                        }
                    }
                }

                if (!finded) {

                    children = Pather.children;
                    //////console.log("Hijos en Pather");
                    for (let c = 0; c < children.length; c++) {

                        if (ctrlToFind.tagName.toLowerCase() == children[c].localName) {
                                                                                                    
                            if (ctrlToFind.id != "") {
                                if (ctrlToFind.id == children[c].id) {

                                    console.log("Encontrado!!!");
                                    finded = true;
                                    ctrl = children[c];
                                }
                            } 
                            else if (ctrlToFind.className != "") {
                                if (ctrlToFind.className == children[c].className) {
                                    if (ctrlToFind.attr != "") {
                                        let attr = children[c].attributes;
                                        let prop = ctrlToFind.attr.split('=');
                                        for (let a = 0; a < attr.length; a++) {
                                            ////////console.log(typeof(attr["data-test-id"]));
                                            ////////console.log(attr[prop[0]]);
                                            if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                                console.log("Encontrado!!!");	
                                                finded = true;
                                                ctrl = children[c];
                                            }
                                        }
                                    } 
                                    else {

                                        console.log("Encontrado!!!");
                                        finded = true;
                                        ctrl = children[c];
                                    }

                                    if (finded) {
                                        if (ctrlToFind.text != "") {
                                            ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                            ////////console.log("children[c].innerText: "+children[c].innerText);
                                            if (ctrlToFind.text != children[c].innerText) {
                                                console.log("NO coincide el texto 3");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        } 
                                        else if (ctrlToFind.html != "") {
                                            //////console.log("children[c].innerText: "+children[c].innerHTML);
                                            if (!children[c].innerHTML.includes(ctrlToFind.html)) {
                                                console.log("NO contiene el html 3");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        }
                                    }

                                }
                            } 
                            else if (ctrlToFind.attr != "") {
                                let attr = children[c].attributes;
                                let prop = ctrlToFind.attr.split('=');
                                for (let a = 0; a < attr.length; a++) {
                                    if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                        console.log("Encontrado!!!");	
                                        finded = true;
                                        ctrl = children[c];
                                    }
                                }

                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);
                                        if (ctrlToFind.text != children[c].innerText) {
                                            console.log("NO coincide el texto 4");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    } 
                                    else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.html)) {
                                            console.log("NO contiene el html 4");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    }
                                }
                            } else if (ctrlToFind.text != "") {
                                ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                ////////console.log("children[c].innerText: "+children[c].innerText);
                                if (ctrlToFind.text == children[c].innerText) {
                                    finded = true;
                                    ctrl = children[c];
                                }
                            } 
                            else if (ctrlToFind.html != "") {
                                if (children[c].innerHTML.includes(ctrlToFind.html)) {
                                    finded = true;
                                    ctrl = children[c];
                                }
                            }
                        }

                        if (finded) {								
							ctrlToFind.finded = children[c];
							//action(ctrlToFind);
                            break;
                        } else {
                            //console.log("Buscando en los Hijos del Pather");
                            find(children[c], ctrlToFind);
                        }
                    }
                }
            
            }

        }

    }

    function processCtrls(_ctrlToFind, isChil){
        let ctrlToFind = [];
        if(isChil){
            ctrlToFind = _ctrlToFind.chil;		
        }
        else{
            ctrlToFind.push(_ctrlToFind[indexCtrl]);
        }
        
        ctrlToFind.sort((a, b) => a.step - b.step);
        console.log("Procesando el control");
		console.log(ctrlToFind);
        
        for(let f = 0; f<ctrlToFind.length; f++){
            finded = false;
            ctrl = null;
            
            if(isChil){
                console.log("Buscando en el padre el control");
                console.log(ctrlToFind[f]);
                if(f > 0){
					console.log("BUscando el siguiente hijo");
                    if(ctrlToFind.length > 1 && (ctrlToFind[f-1].finded != null && ctrlToFind[f-1].finded !== undefined )){
                        find(_ctrlToFind.finded,ctrlToFind[f]);
                    }else{
                        break;
                    }
                }else{
					console.log("BUscando el primer hijo");
                    find(_ctrlToFind.finded,ctrlToFind[f]);
                }
                
                ctrlToFind[f].finded = ctrl;
            }
            else{
                console.log("Buscando en el body el control");
                console.log(ctrlToFind[f]);
                find(containerPather[0],ctrlToFind[f]);
                ctrlToFind[f].finded = ctrl;
            }
            
            
            if(finded){
                                
                if(ctrlToFind[f].chil !== undefined && ctrlToFind[f].chil != null && ctrlToFind[f].chil.length > 0){
					
                    processCtrls(ctrlToFind[f], true);
                }else{
					action(ctrlToFind[f]);
				}
            }
            else{
                console.log("No se logro encontrar el control del paso: "+ctrlToFind[f].step);
                flag.setValue(3);
            }
            
        }
        
        if(isChil){
            _ctrlToFind.chil = ctrlToFind;
        }
        else{
            _ctrlToFind[indexCtrl] = ctrlToFind[0];
            ctrlsToFind[indexCtrl] = ctrlToFind[0];
        }
        
    }

    function action(_ctrlA){ 
        
        console.log("iniciando accion para el control");   
		console.log(_ctrlA);		
        let _ctrl = {};
        if(_ctrlA.chil != null && _ctrlA.chil.length > 0){
            _ctrl = _ctrlA.chil[0];
        }else{
            _ctrl = _ctrlA; 
        }

        if(_ctrl.action != "" && _ctrl.action !== undefined){
            let actions = _ctrl.action.split(',');
            
            for(let a = 0; a< actions.length; a++){
            
                if(actions[a].trim() == "click"){
                    console.log("Accionando un click");
                    console.log(_ctrl);
                    _ctrl.finded.click();
                    sleep(10000);
                }
                else if(actions[a].trim() == "setText"){
                    console.log("Accionando un setText");
                    _ctrl.finded.innerHTML = objSearch[_ctrl.name];
                    flag.setValue(1);
                }	
                else if(actions[a].trim() == "change"){
                    console.log("Accionando un change");
                    
                }	
                else if(actions[a].trim() == "getText"){
                    console.log("Accionando un getText");
                    objSearchResult[_ctrl.name]= _ctrl.finded.innerText;
                    flag.setValue(1);
                }
            
            }
        }else{
            console.log("No tiene accion que hacer!!");
        }		
    }

    function sleep(second){
        let tm = second/1000;
        finishedSleep = false;
        setTimeout(function(){ 
            console.log("Tiempo cumplido!!!");
            flag.setValue(1);
        }, second);
    }

    setTimeout(function(){ 
        console.log("Starting....");
    console.log("search: "+search);
    console.log("ctrlsToFind: "+ctrlsToFind.length);
	
		objSearch.text_search = search.BUSQUEDA;
        objSearchResult.search = search.NOMBRE;
                    
        ctrlsToFind.sort((a, b) => a.step - b.step);
        flag.setValue(1);
    }, 10000);

  }