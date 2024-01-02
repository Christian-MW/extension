let rsearchs = [];
    
let rctrlsToFind = [];  
let rctrlLocationFilter = [];  
let rctrlLanguajeFilter = [];  
let rdataFilters ={};
let rctrlsFilterDate = [];
let slide_id = "";

console.log("Consultando los controlsToFind");

let rtextRefres = (Math.random() + 1).toString(36).substring(7);
console.log(xpathUrl["mws_filters"][0]);
fetch(xpathUrl["mws_filters"][0]+"?refresh="+rtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        rdataFilters=resp;
        console.log("rdataFilters obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["ctrlLanguajeFilter"][0]);
rtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlLanguajeFilter"][0]+"?refresh="+rtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        rctrlLanguajeFilter=resp;
        console.log("rctrlLanguajeFilter obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});


console.log(xpathUrl["ctrlLocationFilter"][0]);
rtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlLocationFilter"][0]+"?refresh="+rtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        rctrlLocationFilter=resp;
        console.log("rctrlLocationFilter obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["controlsToFind"][0]);
rtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["controlsToFind"][0]+"?refresh="+rtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        rctrlsToFind=resp;
        console.log("controlsToFind obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["ctrlsFilterDate"][0]);
rtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlsFilterDate"][0]+"?refresh="+rtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        rctrlsFilterDate=resp;
        console.log("rctrlsFilterDate obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

let reqMeltSearchrmw = {
    columns:"",
    range:"",
    spreadsheet_id:""
  }
  

  let robjSearch ={};
  let robjSearchResult ={ search:""}
  let rlistSearchResult =[];
  let rlastpathFilnameGlobal ="";
  let rflagSearch = new observable(2);
  rflagSearch.onChange(function(v){
        console.log("");console.log("");
        console.log("presentation meltwater");
        console.log("value changed to: " + v);  
        if(v < 2){
            if(v == 0){ 
                //Procesar la busqueda
                pos++;
                console.log("pos: "+pos+" < rsearchs.length: "+rsearchs.length);
                if(pos < rsearchs.length ){
                    rflagSearch.setValue(-1);
                    console.log("Iniciando la búsqueda: "+rsearchs[pos].NOMBRE);
                    document.getElementById(option+"description").innerHTML = "Procesando la búsqueda "+rsearchs[pos].NOMBRE;
                    robjSearch.text_search = rsearchs[pos].BUSQUEDA;
                    robjSearchResult.search = rsearchs[pos].NOMBRE;
                    
                    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
           
                        goToPageRmw(xpathUrl["ms_link_serach"][0], tabs[0].id,xpathUrl["ms_max_authors"][0]); 
                        
                    });
                    
                }
                else{  
                    //Búsquedas procesadas 
                    
                    reqMeltSearchrmw.objectResult = rlistSearchResult;
					reqMeltSearchrmw.slide_id = slide_id;
                    let endponit = xpathUrl["rmw_update_sheet"][0];
                    reqMeltSearchrmw.range = xpathUrl["ms_sheetname_update"].join();
                    console.log(reqMeltSearchrmw);   
                    console.log(JSON.stringify(reqMeltSearchrmw));  
                    document.getElementById(option+"description").innerHTML = "Actualizando el archivo google sheet y presentation ";
                    fetch(urlApiSheet+endponit, {
                        method: 'POST',
                        body: JSON.stringify(reqMeltSearchrmw),
                        headers: { 'Content-Type': 'application/json',  }
                    })
                    .then((response) => response.json())
                    .then(function(response){
                        if(response.code == 200){
                        alert("Las publicaciones se encuentran actualizadas en el google sheet y el google presentation");
                        }else if(response.code == 500){
                        alert("Algo salio mal en la actualización del google sheet");
                        }
                        clearRmw(); 
                    })             
                    .catch(function(error){
                        console.log(error);                          
                        alert("Problemas al actualizar las publicaciones");
                        clearRmw(); 
                    });
                            
                }
            }            
        }     
    });

    function rmwconvertData(objectResult){
        rsearchs=[];
        let columns = objectResult[0];
      
        for (let r = 1; r < objectResult.length; r++) {
          let row = objectResult[r];
          let obj = {};
      
          for (let index = 0; index < columns.length; index++) {
            obj[columns[index].toUpperCase()] = row[index];    
          }
          rsearchs.push(obj);
      
        }
      
      }

  $("#rmwstart").click(function(event){
    listControlsExecuted=[];
    let url = $("#urlSheetrmw").val();
	let urlPresentation = $("#urlPresentationrmw").val();
	if(urlPresentation != "" && urlPresentation.startsWith("https://docs.google.com/presentation/d/")){
		urlPresentation = urlPresentation.replace("https://docs.google.com/presentation/d/","");
        slide_id = urlPresentation.split('/')[0];
		
		if(url != "" && url.startsWith("https://docs.google.com/spreadsheets/d/")){
			url = url.replace("https://docs.google.com/spreadsheets/d/","");
			url = url.split('/')[0];
			$(".rmw-contairner-process").show();
			document.getElementById(option+"lbState").innerHTML = "Procesando...";
			document.getElementById(option+"description").innerHTML = "Obteniendo las búsquedas...";
			urlApiSheet = xpathUrl["api_java_sheet"][0];
			$("#rmwstart").hide();
            listControlsExecuted.push({control:"BTN-START",module:"REPORTES MELTWATER"});
            saveLog();
			reqMeltSearchrmw.columns = xpathUrl["ms_columnsbase"].join();
			reqMeltSearchrmw.range = xpathUrl["rm_sheetname"][0];
			reqMeltSearchrmw.spreadsheet_id = url;

			let endponit = xpathUrl["get_sheet"][0];
			fetch(urlApiSheet+endponit, {
			  method: 'POST',
			  body: JSON.stringify(reqMeltSearchrmw),
			  headers: { 'Content-Type': 'application/json',  }
		   })
		   .then((resp) => resp.json())
		   .then(function(resp){ 
			console.log(resp);
			  try {

				if(resp.code == 200){     
				document.getElementById(option+"description").innerHTML = "Búsquedas obtenidas";         
				  rmwconvertData(resp.objectResult);
				  console.log(rsearchs.length);
				  rflagSearch.setValue(0);

				}else if(resp.code == 409){
				  document.getElementById(option+"LinkProcess").innerHTML = "El archivo sheet tiene inconsitencia en la información";
				  alert("El archivo sheet tiene inconsitencia en la información");
				  clearRmw();
				}else if(resp.code == 500){
				  document.getElementById(option+"LinkProcess").innerHTML = "No existe hoja "+xpathUrl["rm_sheetname"][0];
				  alert("No existe hoja "+xpathUrl["rm_sheetname"][0]);
				  clearRmw();
				}

			  } catch (error) {
				document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las publicaciones";
				alert("Problemas al obtener las publicaciones");
				clearRmw();
			  }

			})
		   .catch(function(error){
			  console.log(error);          
			  document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las publicaciones";
			  alert("Problemas al obtener las publicaciones");
			  clearRmw();
		   });


			

			}else{ 
				document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google sheets";
				alert("Ingresa una url valida de google sheets");
				clearRmw();
			}
		}else{ 
			document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google presentation";
			alert("Ingresa una url valida de google presentation");
			clearRmw();
		  }
  });


async function goToPageRmw(url,tab_id,max_authors) {
    return new Promise(function(resolve, reject) {
        
        // update current tab with new url
        chrome.tabs.update({url: url});
        console.log("goToPageRmw...");
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
                     resolve(); }
                    
                );  

                
                dataApisMelt.tokenAuthMelt = xpathUrl["tokenAuthMelt"][0];
                dataApisMelt.mw_api_search = xpathUrl["mw_api_search"][0];
                dataApisMelt.mw_api_grapql = xpathUrl["mw_api_grapql"][0];
                dataApisMelt.mw_api_runes = xpathUrl["mw_api_runes"][0];
                dataApisMelt.mw_api_users = xpathUrl["mw_api_users"][0];
                dataApisMelt.XClientName = xpathUrl["XClientName"];

                _filters.dateStart = new Date(parseInt(rsearchs[pos].FECHA_INICIO.split("/")[2]),parseInt(rsearchs[pos].FECHA_INICIO.split("/")[1])-1, parseInt(rsearchs[pos].FECHA_INICIO.split("/")[0]) , 1, 0, 0, 0).getTime();
                _filters.dateEnd = new Date(parseInt(rsearchs[pos].FECHA_FIN.split("/")[2]),parseInt(rsearchs[pos].FECHA_FIN.split("/")[1])-1, parseInt(rsearchs[pos].FECHA_FIN.split("/")[0]) , 23, 59, 59, 0).getTime();
                _filters.search = rsearchs[pos].BUSQUEDA;
                _filters.languaje = [];
                _filters.locations = [];
                try{
                    _filters.locations.push(rsearchs[pos].FILTRO.split("-")[0].toLowerCase());
                }catch(error){

                }
                try{
                    _filters.languaje.push(rsearchs[pos].FILTRO.split("-")[1].toLowerCase());
                }catch(error){

                }

                chrome.scripting.executeScript({
                    target: {tabId: tab_id},
                    
                    func: meltInject,
                    args:[
                        JSON.stringify(dataApisMelt),
                        JSON.stringify(_filters)
                    ]
                    /*
                    func: injectScriptRMW,
                    args: [JSON.stringify(rsearchs[pos]),
                        JSON.stringify(rctrlsToFind),
                        JSON.stringify(rctrlLanguajeFilter),
                        JSON.stringify(rctrlLocationFilter),
                        JSON.stringify(rdataFilters),
                        JSON.stringify(rctrlsFilterDate),
                        max_authors                        
                    ],
                    */
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
                        let _json_data = JSON.parse(message);  
                        console.log("Respuesta de la funcion injectada");
                        console.log(_json_data);
                        console.log("Obteniendo el dato de la descarga");
                        resultReadFile ="";   
                        //_json_data.usersResponse
                        //_json_data.searchResponse
                        let rt = getTotals(_json_data.searchResponse);
                        let json_data ={
                            "search": rsearchs[pos].NOMBRE,
                            "usuarios": rt.a.toString(),
                            "menciones": rt.m.toString(),
                            "impresiones": rt.i.toString(),
                            "alcance": rt.v.toString(),
                            "valuesFile": getValuesFile(_json_data.searchResponse["AF-mentionsStatsTrendBySource"].compoundWidgetData["AF-latestActivityBySource"]),
                            "authors": getAuthors(_json_data.usersResponse),
                            "dataAlcance":[]
                        }     
                        
                        getAlcanceToRMW(json_data);    
                        /*                                                    
                        //readTextFile();
                        //getFiles()
                        
                        setTimeout(function(){ 
                            console.log("Termino la espera!!!");

                            
                            if(pathFilnameGlobal != rlastpathFilnameGlobal){
                                json_data.valuesFile=processFileRMW();                                
                                rlastpathFilnameGlobal = pathFilnameGlobal;
                            }
                            else
                                json_data.valuesFile={};

                            

                            getAlcanceToRMW(json_data);                                                        
                        }, 3000);
                                   */         
                    }catch(err){
                         console.log(err);
                    }
                });

            }
        });
    });
}

function getAlcanceToRMW(json_data){
    try{
        console.log("Preparando data para consumir el api del alcance");
        let listCategory = ["Accidentes:0","Desastres naturales:1","Viral:2","Entretenimiento:3","Deportes:4","Política:5","Gobierno:6","Negocios7"];
        let listPosition = ["Bots y Trolls:0","Opinión Pública Informada:1","Opinión Pública:2","Activistas:3","Influencers:4","Líderes de Opinión:5","Medios:6"];
        let listLevel = ["Local:0","Regional:1","Nacional:2","Internacional:3","Mundial:4"];
        let hours = [];
        let min = 0, max = 24;

        for (var i = min; i<max; i++){

            for (var m = 0; m<=45; m++){
                let h = i+":"+((m== 0)?"00":m);
                let val = ((60*(i*60))+(m*60));
                hours.push(""+h+"="+val)
                m=m+14;
            }
        }

        let category=0,position=0,level = 0,hour=0;
        let dataSerch = rsearchs[pos];
        for (let index = 0; index < listCategory.length; index++) {
            try{
                let item = listCategory[index].toLowerCase().trim().split(":");
                if(item[0] == dataSerch.CATEGORIA.trim().toLowerCase())
                {
                    category = item[1];
                    break;
                }      
            }catch(error){console.log(error);}       
        }
        for (let index = 0; index < listPosition.length; index++) {
            try{
                let item = listPosition[index].toLowerCase().trim().split(":");
                if(item[0] == dataSerch.QUIEN_POSICIONO.trim().toLowerCase())
                {
                    position = item[1];
                    break;
                } 
            }catch(error){console.log(error);}            
        }
        for (let index = 0; index < listLevel.length; index++) {
            try{
                let item = listLevel[index].toLowerCase().trim().split(":");
                if(item[0] == dataSerch.NIVEL.trim().toLowerCase())
                {
                    level = item[1];
                    break;
                }   
            }catch(error){console.log(error);}            
        }
        for (let index = 0; index < hours.length; index++) {
            let item = hours[index].trim().split("=");
            try{
                if(item[0] == dataSerch.NIVEL.trim())
                {
                    level = item[1];
                    break;
                }  
            }catch(error){console.log(error);}          
        }
        let dtstart = dataSerch.FECHA_INICIO;
        let d = new Date(dtstart.split('/')[2] , dtstart.split('/')[1], dtstart.split('/')[0], "00", "00", "00");
        let epochStart = Math.floor((d).getTime() / 1000);

        let dtend = dataSerch.FECHA_FIN;
        d = new Date(dtend.split('/')[2] , dtend.split('/')[1], dtend.split('/')[0], "00", "00", "00");
        let epochEnd = Math.floor((d).getTime() / 1000);

        let request = new FormData();
        request.append('categoriaTema', category);
        request.append('posicionoTema', position);
        request.append('nivel', level);
        request.append('tema', "");
        request.append('numImpre', json_data.impresiones.replaceAll(",",""));
        request.append('numpubli', json_data.menciones.replaceAll(",",""));
        request.append('numUser', json_data.usuarios.replaceAll(",",""));
        request.append('numHrs', hour);
        request.append('datestart', epochStart);
        request.append('dateend', epochEnd);
        url = urlBase+xpathUrl["api_alcance"][0];
        sendPost(url, request)
        .then(function(responseAlcance){
            try{
                let dataAlcance = [];
                for (let i = 0; i < responseAlcance.length; i++) {
                    if(typeof responseAlcance[i] == "object"){
                      for (let o = 0; o < responseAlcance[i].length; o++) {
                        dataAlcance.push(
                            {
                                Medicion:responseAlcance[i][o][0].trim(),
                                Twitter:responseAlcance[i][o][1].trim(),
                                Facebook:responseAlcance[i][o][2].trim(),
                                Whatsapp:responseAlcance[i][o][4].trim(),
                                Totales:responseAlcance[i][o][3].trim()
                            }
                        );
                      }
                      break;
                    }   
                  }
                json_data.dataAlcance=dataAlcance;
                rlistSearchResult.push(json_data);
                rflagSearch.setValue(0);
            }
            catch(error){
                console.log(error);
                json_data.dataAlcance=[];
                rlistSearchResult.push(json_data);
                rflagSearch.setValue(0);
            }
        })
        .catch(function(error){
            console.log(error);
            json_data.dataAlcance=[];
            rlistSearchResult.push(json_data);
            rflagSearch.setValue(0);
        });
        
    }catch(error){
        console.log(error);
        json_data.dataAlcance=[];
        rlistSearchResult.push(json_data);
        rflagSearch.setValue(0);
    }
}

function processFileRMW(){
    console.log("processFileRMW");
    console.log(resultReadFile.length);
    let prop = "";
    let obj ={};
    for (let index = 0; index < resultReadFile.length; index++) {
        let r = resultReadFile[index].replaceAll('"',"");
        if(!r.startsWith("Explore") && !r.startsWith("Date") && r!=""){
            
            if(r.match(/^\d/) && prop != "" ){
                //Escontenido de 
                obj[prop].push(resultReadFile[index].trim().replaceAll('"',""));
            }else{
                console.log("Agregando propiedad al objeto");
                console.log(r);
                prop = resultReadFile[index].trim();
                obj[prop] = [];
            }
        }
    }
    console.log(obj);
    return obj;
}

function clearRmw(){
    $("#rmwstart").show();
    $(".rmw-contairner-process").hide();
    $(".rmw-lbState").val("");
    $(".rmw-description").val("");
    reqMeltSearchrmw = {
        columns:"",
        range:"",
        spreadsheet_id:""
      }
      $("#urlSheetrmw").val(""); 	  
	  $("#urlPresentationrmw").val(""); 
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

function injectScriptRMW(_search, _rctrlsToFind, _rctrlLanguajeFilter, _rctrlLocationFilter, _rdataFilters, _filterDate,max_authors) {
    console.log("Funcion inyectada!!!");
    let months={"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June",
    "7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"};
    let filterDate ={thDate:""}
	
    let filterProcessed = -1;
	let search = JSON.parse(_search);
    let rctrlsToFind = [];
    let ctrlsXToFind = JSON.parse(_rctrlsToFind);
    let rctrlLanguajeFilter = JSON.parse(_rctrlLanguajeFilter);
    let rctrlLocationFilter = JSON.parse(_rctrlLocationFilter);
    let rdataFilters = JSON.parse(_rdataFilters);
    let rctrlsFilterDate = JSON.parse(_filterDate);

    console.log("Iniciando con datos de entrada");
    console.log("search: ");
    console.log(search);
    console.log("ctrlsXToFind: "+ctrlsXToFind.length);
    console.log(ctrlsXToFind);
    console.log("rctrlLanguajeFilter: "+rctrlLanguajeFilter.length);
    console.log(rctrlLanguajeFilter);
    console.log("rctrlLocationFilter: "+rctrlLocationFilter.length);
    console.log(rctrlLocationFilter);
    console.log("rdataFilters: ");
    console.log(rdataFilters);
    console.log("rctrlsFilterDate: ");
    console.log(rctrlsFilterDate);
    
    
    htmlFather ="";
    isInHtmlFather ="";
    author = {"nombre":"","cuenta":"","imagen":""}
    authors=[];
    let retryFoundCtrl = 2;
    function observableRMW(v){
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
    //let containerPather = document.querySelectorAll('mi-app-chrome-content');
    let containerPather = document.querySelectorAll('body');
    let result =[];
    let finishedSleep = false;

    let robjSearch ={ text_search:"", startDate:"", endDate:"" }
    let robjSearchResult ={ search:""}
    let rlistSearchResult =[];
    let typeFilter = "";
    let pos = -1; 
    let indexCtrl = -1;
    let retryFind = 3;
    let inFilters = true;
    let inFilterDate = false;
    let isLoop = false;
    let lastTypeFilter ="";
    let stepFilterDate={
        dates:["from","to"], 
        actions:["next","back","equals"],
        date:0,
        action:2, 
        finish:false,
        step:1,
        title:"",
        maxclick:24
    };
    let flag = new observableRMW(-1);
    flag.onChange(function(v){
        console.log("");console.log("");
        console.log("value changed to: " + v);  
        if(v >= 0){
            if(v == 1){ 
                //Procesar un control
                //console.log("filterProcessed >= robjSearch.filter.length");
                //console.log(filterProcessed+ " >= "+ robjSearch.filter.length);
                //console.log("indexCtrl: "+indexCtrl);
                //console.log("pos: "+pos);
                
                if(robjSearch.filter.length <= 0 && inFilters){
                    inFilterDate = true;
                    inFilters = false;
                    filterProcessed = 0;
                }

                if(inFilters && filterProcessed >= robjSearch.filter.length){
                    console.log("Reiniciando los datos 1");
                    indexCtrl = -1;
                    pos = -1;
                    typeFilter=lastTypeFilter;
                }
                if(robjSearch.filter.length > 0 && filterProcessed < robjSearch.filter.length && inFilters){
                    //Proceso para aplicar los filtros
                    retryFind = 0;
                    if(!isLoop)
                        pos++;
                    let f = "";
                    if(typeFilter==""){
                        pos = -1; 
                        indexCtrl = -1;
                        if(!isLoop)
                            filterProcessed++; 
                        
                        if(filterProcessed >= robjSearch.filter.length){
                            indexCtrl = -1;
                            pos = -1;
                            isLoop = false;                              
                            inFilters = false; 
                            inFilterDate = true;
                            console.log("Actualizando el observer en unos segundos mas....");
                            setTimeout(function(){ 
                                console.log("Actualizando el observer 1");
                                flag.setValue(-1);
                                flag.setValue(1);                       
                            }, 5000);       

                        }else{

                            console.log(robjSearch.filter.length);
                            console.log(filterProcessed);
                            f =  getValueFilterRMW();// robjSearch.filter[filterProcessed];
                            console.log(f)
                            if(f !== undefined && rdataFilters.languaje[f.trim()] !== undefined){
                                //filtro por lenguaje
                                lastTypeFilter = "languaje";
                                typeFilter = "languaje";
                                flag.setValue(-1);
                            
                                if(!isLoop) {
                                    indexCtrl++;                                    
                                }               
                                retryFind = 0; 
                                rctrlsToFind = rctrlLanguajeFilter;
                                processCtrlsRMW(rctrlsToFind, false);
                            }
                            else if(f !== undefined && rdataFilters.location[f.trim()] !== undefined){
                                //Filtro por localidad
                                lastTypeFilter = "location";
                                typeFilter = "location";
                                flag.setValue(-1);
                            
                                if(!isLoop) {
                                    indexCtrl++;                                    
                                }               
                                retryFind = 0; 
                                rctrlsToFind = rctrlLocationFilter;
                                processCtrlsRMW(rctrlsToFind, false);
                            }else{
                                console.log("No se logro identificar que filtro aplicar para "+f);
                                flag.setValue(-1);
                                flag.setValue(1);
                            }
                        }
                    }                       
                    else{
                        if(filterProcessed >= robjSearch.filter.length){
                            indexCtrl = -1;
                            pos = -1;
                            isLoop = false;
                            inFilters = false; 
                            inFilterDate = true;
                            console.log("Actualizando el observer en unos segundos mas....");
                            setTimeout(function(){ 
                                console.log("Actualizando el observer 2");
                                flag.setValue(-1);
                                flag.setValue(1);                       
                            }, 5000);
                            
                                      

                        }else{
  
                            if(typeFilter == "languaje"){
                                    if(pos >= rctrlLanguajeFilter.length ){
                                        typeFilter = "";
                                        flag.setValue(-1);
                                        flag.setValue(1);
                                    }else{
                                        flag.setValue(-1);
                                
                                        
                                        if(!isLoop) {
                                            indexCtrl++;                                    
                                        }               
                                        retryFind = 0; 
                                        rctrlsToFind = rctrlLanguajeFilter;
                                        processCtrlsRMW(rctrlsToFind, false);
                                    }
                            }
                            else if(typeFilter == "location"){
                                    if(pos >= rctrlLocationFilter.length ){
                                        typeFilter = "";
                                        console.log("Filtro: "+f+" aplicado.....");
                                        flag.setValue(-1);
                                        flag.setValue(1);

                                    }
                                    else{
                                        flag.setValue(-1);   
                                        
                                        if(!isLoop) {
                                            indexCtrl++;                                    
                                        }               
                                        retryFind = 0; 
                                        rctrlsToFind = rctrlLocationFilter;
                                        processCtrlsRMW(rctrlsToFind, false);
                                    }
                            }
                        }
                    }
                   
                }
                else if(inFilterDate){
                    
                   let action = stepFilterDate.action;
                   if(stepFilterDate.finish){
                        console.log("Ya esta como finalizado");
                        action++;
                        stepFilterDate.action++;
                        stepFilterDate.finish = false;
                        stepFilterDate.date++;
                        indexCtrl=-1;
                        pos = -1;

                   }
                   console.log("Validando stepFilterDate.date >= stepFilterDate.dates.length");
                   console.log(stepFilterDate.date +">="+ stepFilterDate.dates.length)
                   if(stepFilterDate.date > stepFilterDate.dates.length || stepFilterDate.maxclick <= 0){                        
                        //Se ha terminado de procesar los filtros
                        inFilterDate = false;
                        console.log("Actualizando el observer por finalizar los filtros de fecha");
                         for (let index = 0; index < rctrlsFilterDate.length; index++) {
                                if(rctrlsFilterDate[index].name=="select_dates" ){
                                    pos = index;
                                    indexCtrl = index;
                                    break;
                                }
                            }
                            stepFilterDate.step =-1;
                            flag.setValue(-1);
                            processCtrlsRMW(rctrlsToFind, false);
                   }else{
                        /*
                        1.- Abilitar el modo custom  btn_custom
                        2.- Mostrar el calendario show_calendar_from
                        3.- Obtener el titulo del calendario title_calendar
                        4.- Validar si el titulo es correcto este esta formados por el mes y el año 
                        5.- Identificar si hay que avanzar o retroceder  next_month o back_month
                        6.- Selecionar el día select_day
                        7.- Repetir los mismos pasos para la siguiente fecha from or to
                        8.- Seleccionar el boton ok para definir las fechas seleccionadas
                        */
                        if(stepFilterDate.date == stepFilterDate.dates.length){
                            stepFilterDate.date = 1;
                            stepFilterDate.finish = true;
                        }
                       pos=-1;
                       indexCtrl=-1;
                       
                       rctrlsToFind = rctrlsFilterDate;
                       if(stepFilterDate.step ==1){
                            for (let index = 0; index < rctrlsFilterDate.length; index++) {
                                if(rctrlsFilterDate[index].name=="btn_custom" ){
                                    pos = index;
                                    indexCtrl = index;
                                    break;
                                }
                            }
                            stepFilterDate.step =2;
                            flag.setValue(-1);
                            processCtrlsRMW(rctrlsToFind, false);
                       }
                       else if(stepFilterDate.step ==2){

                            let typeDate = stepFilterDate.dates[stepFilterDate.date];
                            console.log("Trabajando con la fecha de "+typeDate);
                            let name = "show_calendar_from"
                            if(typeDate == "to")
                                name = "show_calendar_to"

                        for (let index = 0; index < rctrlsFilterDate.length; index++) {
                                                        
                            stepFilterDate.action = 2
                            if(rctrlsFilterDate[index].name==name ){
                                pos = index;
                                indexCtrl = index;
                                break;
                            }
                        }
                        stepFilterDate.step =3;
                        flag.setValue(-1);
                        processCtrlsRMW(rctrlsToFind, false);

                       }                       
                       else if(stepFilterDate.step ==3){
                        for (let index = 0; index < rctrlsFilterDate.length; index++) {
                            let typeDate = stepFilterDate.dates[stepFilterDate.date];
                                                           
                            if(rctrlsFilterDate[index].name== "title_calendar" ){
                                pos = index;
                                indexCtrl = index;
                                break;
                            }
                        }
                        stepFilterDate.step =4;
                        flag.setValue(-1);
                        processCtrlsRMW(rctrlsToFind, false);

                       }                      
                       else if(stepFilterDate.step ==4){
                        /*
                        4.- Validar si el titulo es correcto este esta formados por el mes y el año 
                        5.- Identificar si hay que avanzar o retroceder  next_month o back_month
                        6.- Selecionar el día select_day
                        */
                        console.log("Aplicando el paso 4, 5 y 6");
                        console.log(stepFilterDate.title);
                        if(stepFilterDate.title == "" || search.FECHA_INICIO == "" || search.FECHA_INICIO === undefined
                        || search.FECHA_FIN == "" || search.FECHA_FIN === undefined){
                            alert("No se logro obtener la fecha el proceso no puede continuar :(");
                        }else{

                            let indDate = search.FECHA_INICIO;
                            let typeDate = stepFilterDate.dates[stepFilterDate.date];
                            if(typeDate == "to")
                                indDate = search.FECHA_FIN
                            
                            let titleInCurse = stepFilterDate.title.trim().split(" ");
                            let _titleUser = [months[indDate.split("/")[1]],indDate.split("/")[2]];
                            console.log("Obteniendo la diferencia de años");
                            console.log(titleInCurse[1]+" - "+_titleUser[1]);
                            let difYears = parseInt(titleInCurse[1])-_titleUser[1];
                            //["next","back","equals"]
                            if(difYears == 0){
                                console.log("El año es el correcto!!! se verificara el mes...");
                                //No hay diferencias de años verificamos el mes
                                let intMonts = ["1","2","3","4","5","6","7","8","9","10","11","12"];
                                let intMonth = 1;
                                let intMonthUser = 1;
                                for (let index = 0; index < intMonts.length; index++) {
                                    console.log("Verificando el mes months[intMonts[index]] == titleInCurse[0]");
                                    console.log(months[intMonts[index]] +"=="+ titleInCurse[0]);
                                    if(months[intMonts[index]] == titleInCurse[0]){
                                        intMonth = index+1;
                                    }
                                    if(intMonts[index] == indDate.split("/")[1]){
                                        intMonthUser = index+1;
                                    }
                                }
                                console.log("Obteniendo la diferencia de meses");
                                console.log(intMonthUser +"-"+intMonth);
                                let difMont = intMonthUser-intMonth;
                                if(difMont == 0){
                                    //el mes es el correcto solo queda seleccionar el día
                                    stepFilterDate.action=2;
                                }
                                else if(difMont > 0){
                                    //hay que adelantar para igualar el mes
                                    stepFilterDate.action=0;
                                }else{
                                    //Hay que retroceder para igualar el mes
                                    stepFilterDate.action=1;
                                    
                                }
                                

                            }else if(difYears > 0){
                                //hay que retroceder para igualar el año
                                stepFilterDate.action=1;
                            }else{
                                //hay que adelantar para igualar el año
                                stepFilterDate.action=0;
                            }

                            for (let index = 0; index < rctrlsFilterDate.length; index++) {
                                
                                if(stepFilterDate.actions[stepFilterDate.action]=="back"){
                                    stepFilterDate.step =3;
                                    if(rctrlsFilterDate[index].name== "back_month" ){
                                        pos = index;
                                        indexCtrl = index;
                                        stepFilterDate.maxclick--;
                                        break;
                                    }
                                }
                                if(stepFilterDate.actions[stepFilterDate.action]=="next"){
                                    stepFilterDate.step =3;
                                    if(rctrlsFilterDate[index].name== "next_month" ){
                                        pos = index;
                                        indexCtrl = index;
                                        stepFilterDate.maxclick--;
                                        break;
                                    }
                                }
                                if(stepFilterDate.actions[stepFilterDate.action]=="equals"){
                                    stepFilterDate.step =5;
                                    if(rctrlsFilterDate[index].name== "select_day" ){
                                        pos = index;
                                        indexCtrl = index;
                                        rctrlsFilterDate[index].text=indDate.split("/")[0];
                                        break;
                                    }
                                }
                                                                
                            }

                            
                            flag.setValue(-1);
                            processCtrlsRMW(rctrlsToFind, false);
                            
                        }

                       }
                       else if(stepFilterDate.step == 5){
                            for (let index = 0; index < rctrlsFilterDate.length; index++) {
                                                                                        
                                if(rctrlsFilterDate[index].name=="close_calendar" ){
                                    pos = index;
                                    indexCtrl = index;
                                    break;
                                }
                            }
                            stepFilterDate.date++;
                            stepFilterDate.step =2;
                            flag.setValue(-1);
                            processCtrlsRMW(rctrlsToFind, false);
                       }

                   }
                }
                else{     
                    console.log("Iniciando con la extracción");
                    //console.log("indexCtrl: "+indexCtrl +" Pos: "+pos);
                    //console.log(stepFilterDate.title);
                    if(stepFilterDate.title != ""){
                        pos=-1;
                        indexCtrl =-1;
                        stepFilterDate.title="";
                    }
                    //Proceso para la extracción  
                    inFilters = false;      
                    inFilterDate = false;     
                    pos++;
                    rctrlsToFind = ctrlsXToFind;
                    //console.log("pos: "+pos+" < rctrlsToFind.length: "+rctrlsToFind.length);
                    console.log(rctrlsToFind);
                    if(pos < rctrlsToFind.length ){
                        flag.setValue(-1);
                        
                        indexCtrl++;
                        retryFind = 3;
                        processCtrlsRMW(rctrlsToFind, false);
                        
                    }
                    else{  
                        //Controles procesadas
                        console.log("Finaliado!!!");
                        console.log(robjSearchResult);
                        //Agregando los autores
                        robjSearchResult.authors = authors;
                        //console.log(JSON.stringify(robjSearchResult));
                        chrome.runtime.sendMessage(null, JSON.stringify(robjSearchResult));         
                    }
                }   
            }else if(v == 3){
                retryFind--;
                if(retryFind > 0){
                    setTimeout(function(){ 
                        flag.setValue(-1);
                        processCtrlsRMW(rctrlsToFind, false);                        
                    }, 3000);
                }else{
                    flag.setValue(-1);
                    flag.setValue(1);
                }

                
            }
            
        }     
    });

    function getValueFilterRMW(){
        let val = ""
        if(filterProcessed >= robjSearch.filter.length){
            val = robjSearch.filter[filterProcessed-1];
        }else{
            val = robjSearch.filter[filterProcessed];
        }
        return val;
    }

    function findRMW(Pather, ctrlToFind) {
        //////console.log(Pather);
        if (Pather != null) {
            let shadow = Pather.shadowRoot;
            let children = [];
            
            if (!finded) {
                if (shadow != null) {
                    children = shadow.children;
                    ////////console.log("Hijos en Shadow");
                    for (let c = 0; c < children.length; c++) {
                        if (finded) {
                            //console.log("Volvio a entrar aunque ya se haya aplicado un break anteriormente!!!");
                            continue;
                        }
                        if (ctrlToFind.tagName.toLowerCase() == children[c].localName) {                                                    
                            
                            if (ctrlToFind.id != "") {
                                if (ctrlToFind.id == children[c].id) {

                                    console.log("Encontrado!!!");
                                    finded = true;
                                    ctrl = children[c];
                                }
                            } 
                            else if (ctrlToFind.className != "") {
                                if(ctrlToFind.className.startsWith("not-include")){
                                    console.log("Validando el not include en el className");
                                    let classNotInclude = ctrlToFind.className.replace("not-include","");
                                    if (children[c].className.includes(classNotInclude)) {
                                        console.log("El dia encontrado no pertenece al mes en curso");	
                                        finded = false;
                                    }else{
                                        console.log("Encontrado!!!");	
                                        finded = true;
                                        ctrl = children[c];
                                    }
                                }else
                                if (ctrlToFind.className == children[c].className) {
                                    if (ctrlToFind.attr != "") {
                                        let attr = children[c].attributes;
                                        let prop = ctrlToFind.attr.split('=');
                                        for (let a = 0; a < attr.length; a++) {
                                            ////////console.log("attr[a]: "+attr[a]);
                                            if(prop.length == 1){
                                                if (attr[prop[0]] !== undefined) {
                                                    console.log("Encontrado!!!");	
                                                    finded = true;
                                                    ctrl = children[c];
                                                }
                                            }else{                                                    
                                                if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                                    console.log("Encontrado!!!");	
                                                    finded = true;
                                                    ctrl = children[c];
                                                }
                                            }
                                        }
                                    } 
                                    else {

                                        console.log("Encontrado!!!");	
                                        finded = true;
                                        ctrl = children[c];
                                    }
                                }

                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);									
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilterRMW();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = rdataFilters[lastTypeFilter][f];
                                                
                                                if (ft != children[c].innerText) {
                                                    console.log("NO coincide el texto");
                                                    finded = false;
                                                    ctrl = null;
                                                }else{
                                                    console.log("Si se encontro: "+ft)
                                                }
                                            }
                                        }else{
                                            if (ctrlToFind.text != children[c].innerText) {
                                                console.log("NO coincide el texto");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        }
                                    } 
                                    else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.html)) {
                                            console.log("NO cointine el html");
                                            finded = false;
                                            ctrl = null;
                                        }else{
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }
                                }
																		
                                
                            } 
                            else if (ctrlToFind.attr != "") {
                                let attr = children[c].attributes;
                                let prop = ctrlToFind.attr.split('=');
                                for (let a = 0; a < attr.length; a++) {
                                    ////////console.log("attr[a]: "+attr[a]);
                                    if(prop.length == 1){
                                        if (attr[prop[0]] !== undefined) {
                                            console.log("Encontrado!!!");	
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }else{
                                        if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                            console.log("Encontrado!!!");	
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }
                                }
                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilterRMW();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = rdataFilters[lastTypeFilter][f];
                                                
                                                if (ft != children[c].innerText) {
                                                    console.log("NO coincide el texto2");
                                                    finded = false;
                                                    ctrl = null;
                                                }else{
                                                    console.log("Si se encontro: "+ft)
                                                }
                                            }
                                        }else{
                                            if (ctrlToFind.text != children[c].innerText) {
                                                console.log("NO coincide el texto 2");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        }
                                    } 
                                    else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.html)) {
                                            console.log("NO contiene el html 2");
                                            finded = false;
                                            ctrl = null;
                                        }else{
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }
                                }
								

                            } 
                            else if (ctrlToFind.text != "") {
                                ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                ////////console.log("children[c].innerText: "+children[c].innerText);
                                if(ctrlToFind.text == "{{filter}}"){
                                    let f = getValueFilterRMW();
                                    /*
                                    console.log(filterProcessed);
                                    console.log("el texto debe ser igual alfiltro en curso: "+f);
                                    console.log(children[c].innerText);
                                    */
                                    if(f !== undefined && typeFilter != ""){
                                        let ft = rdataFilters[lastTypeFilter][f];
                                        
                                        if (ft == children[c].innerText) {
                                            finded = true;
                                            ctrl = children[c];
                                            console.log("Si se encontro: "+ft)
                                        }
                                    }
                                }else{
                                    if (ctrlToFind.text == children[c].innerText) {
                                        finded = true;
                                        ctrl = children[c];
                                    }
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
							//actionRMW(ctrlToFind);
                            break;
                        } 
                        else {
                            //////console.log("Buscando en los Hijos del Pather");
                            findRMW(children[c], ctrlToFind);
                        }
                    }
                }

                if (!finded) {

                    children = Pather.children;
                    //////console.log("Hijos en Pather");
                    for (let c = 0; c < children.length; c++) {
                        if (finded) {
                            //console.log("Volvio a entrar aunque ya se haya aplicado un break anteriormente!!!");
                            continue;
                        }
                        if (ctrlToFind.tagName.toLowerCase() == children[c].localName) {
                                                                                                    
                            if (ctrlToFind.id != "") {
                                if (ctrlToFind.id == children[c].id) {

                                    console.log("Encontrado!!!");
                                    finded = true;
                                    ctrl = children[c];
                                }
                            } 
                            else if (ctrlToFind.className != "") {
                                if(ctrlToFind.className.startsWith("not-include")){
                                    console.log("Validando el not include en el className 2");
                                    let classNotInclude = ctrlToFind.className.replace("not-include","");
                                    if (children[c].className.includes(classNotInclude)) {
                                        console.log("El dia encontrado no pertenece al mes en curso");
                                        console.log(children);	
                                        finded = false;
                                    }else{
                                        console.log("Encontrado!!!");	
                                        finded = true;
                                        ctrl = children[c];
                                    }
                                }
                                else if (ctrlToFind.className == children[c].className) {
                                    if (ctrlToFind.attr != "") {
                                        let attr = children[c].attributes;
                                        let prop = ctrlToFind.attr.split('=');
                                        for (let a = 0; a < attr.length; a++) {
                                            ////////console.log(typeof(attr["data-test-id"]));
                                            ////////console.log(attr[prop[0]]);
                                            if(prop.length == 1){
                                                if (attr[prop[0]] !== undefined) {
                                                    console.log("Encontrado!!!");	
                                                    finded = true;
                                                    ctrl = children[c];
                                                }
                                            }else{
                                                if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                                    console.log("Encontrado!!!");	
                                                    finded = true;
                                                    ctrl = children[c];
                                                }
                                            }
                                        }
                                    } 
                                    else {

                                        console.log("Encontrado!!!");
                                        finded = true;
                                        ctrl = children[c];
                                    }
                                }
                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilterRMW();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = rdataFilters[lastTypeFilter][f];
                                                
                                                if (ft != children[c].innerText) {
                                                    console.log("NO coincide el texto 4");
                                                    finded = false;
                                                    ctrl = null;
                                                }else{
                                                    console.log("Si se encontro: "+ft)
                                                }
                                            }
                                        }else{
                                            if (ctrlToFind.text != children[c].innerText) {
                                                console.log("NO coincide el texto 4");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        }
                                    } 
                                    else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.html)) {                                            
                                            //console.log("NO contiene el html 3 "+ctrlToFind.html);
                                            //console.log(children[c].innerText);
                                            //console.log(children[c].innerHTML);
                                            finded = false;
                                            ctrl = null;
                                        }else{
                                            //console.log("Html encontrado "+ctrlToFind.html);                                            
                                            //console.log(children[c].innerHTML);
                                            finded = true;
                                            ctrl = children[c];
                                            ctrlToFind.finded = children[c];
                                            
                                        }
                                    }
                                }

                                
                            } 
                            else if (ctrlToFind.attr != "") {
                                let attr = children[c].attributes;
                                let prop = ctrlToFind.attr.split('=');
                                for (let a = 0; a < attr.length; a++) {
                                    if(prop.length == 1){
                                        if (attr[prop[0]] !== undefined) {
                                            console.log("Encontrado!!!");	
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }else{
                                        if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                            console.log("Encontrado!!!");	
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }
                                }

                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilterRMW();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = rdataFilters[lastTypeFilter][f];
                                                
                                                if (ft != children[c].innerText) {
                                                    console.log("NO coincide el texto 5");
                                                    finded = false;
                                                    ctrl = null;
                                                }else{
                                                    console.log("Si se encontro: "+ft)
                                                }
                                            }
                                        }else{
                                            if(children[c].tagName=="td")
                                            {
                                                console.log("Texto del TD");
                                                console.log(children[c].innerText)
                                            }
                                            if (ctrlToFind.text != children[c].innerText) {
                                                console.log("NO coincide el texto 5");
                                                finded = false;
                                                ctrl = null;
                                            }
                                        }
                                    } 
                                    else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.html)) {
                                            console.log("NO contiene el html 4");
                                            finded = false;
                                            ctrl = null;
                                        }else{
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }
                                }
                            } else if (ctrlToFind.text != "") {
                                ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                ////////console.log("children[c].innerText: "+children[c].innerText);
                                if(ctrlToFind.text == "{{filter}}"){
                                    let f = getValueFilterRMW();
                                    /*
                                    console.log(filterProcessed);
                                    console.log("el texto debe ser igual alfiltro en curso: "+f);
                                    console.log(children[c].innerText);
                                    */
                                    if(f !== undefined && typeFilter != ""){
                                        let ft = rdataFilters[lastTypeFilter][f];
                                        
                                        if (ft == children[c].innerText) {
                                            finded = true;
                                            ctrl = children[c];
                                            console.log("Si se encontro: "+ft)
                                        }
                                    }
                                }else{
                                    if (ctrlToFind.text == children[c].innerText) {
                                        finded = true;
                                        ctrl = children[c];
                                    }
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
                            console.log("Encontrado en el hijo");							
							ctrlToFind.finded = children[c];
							//actionRMW(ctrlToFind);
                            break;
                        } else {                           
                            //console.log("Buscando en los Hijos del Pather");
                            findRMW(children[c], ctrlToFind);
                        }
                    }
                }
            
            }

        }

    }

    function processCtrlsRMW(_ctrlToFind, isChil){
        let ctrlToFind = [];
        console.log(_ctrlToFind);
        if(isChil){
            if(_ctrlToFind.name == "htmlFather"){
                isInHtmlFather = true;
                actionRMW(_ctrlToFind);
            }
            console.log("Buscando el hijo");
            ctrlToFind = _ctrlToFind.chil;		
        }
        else{
            console.log("indexCtrl: "+indexCtrl);
            ctrlToFind.push(_ctrlToFind[indexCtrl]);
        }

        if(ctrlToFind[0] === undefined){
            console.log("El control no esta definido!!!!");
            finded = false;
            ctrl = null;
            console.log("flag: "+flag.getValue());
            flag.setValue(1);
        }else{

            ctrlToFind.sort((a, b) => a.step - b.step);
            console.log("Procesando el control");
            console.log(ctrlToFind);
            
            for(let f = 0; f<ctrlToFind.length; f++){
                finded = false;
                ctrl = null;
                
                if(isChil){
                    //console.log("Buscando en el padre el control");
                    //console.log(_ctrlToFind.finded);
                    if(f > 0){
                        //console.log("BUscando el siguiente hijo");
                        if(ctrlToFind.length > 1 && (ctrlToFind[f-1].finded != null && ctrlToFind[f-1].finded !== undefined )){
                            findRMW(_ctrlToFind.finded,ctrlToFind[f]);
                            ctrlToFind[f].finded = ctrl;
                        }else{
                            break;
                        }
                    }else{
                        //console.log("BUscando el primer hijo");
                        findRMW(_ctrlToFind.finded,ctrlToFind[f]);
                        ctrlToFind[f].finded = ctrl;
                    }
                    
                    
                }
                else{
                    console.log("Buscando en el body el control");
                    console.log(ctrlToFind[f]);
                    findRMW(containerPather[0],ctrlToFind[f]);
                    ctrlToFind[f].finded = ctrl;
                }
                
                if(isChil){
                    _ctrlToFind.chil = ctrlToFind;
                }
                else{
                    _ctrlToFind[indexCtrl] = ctrlToFind[0];
                    rctrlsToFind[indexCtrl] = ctrlToFind[0];
                }
                
                if(finded){
                    retryFind = -1;      
                    if(ctrlToFind[f].chil !== undefined && ctrlToFind[f].chil != null && ctrlToFind[f].chil.length > 0){
                        retryFind = 3;
                        processCtrlsRMW(ctrlToFind[f], true);
                    }else{
                        ctrlToFind[f].finded = ctrl;
                        actionRMW(ctrlToFind[f]);                        
                    }    
                }
                else{

                    retryFind--;
                    if(retryFind > 0 && !isLoop){
                        isLoop = false;
                        console.log("No se encontro el control haciendo un intento más!!!");
                        setTimeout(function(){ 
                            //flag.setValue(-1);
                            processCtrlsRMW(_ctrlToFind, isChil);                        
                        }, 3000);
                    }else{
                        console.log("No se logro encontrar el control del paso: "+ctrlToFind[f].step);
                        if(ctrlToFind[f].isLoop !== undefined && ctrlToFind[f].isLoop){
                            isLoop = false;
                        }
                        
                        flag.setValue(-1);
                        flag.setValue(1);
                        
                    }
                        //console.log("No se logro encontrar el control del paso: "+ctrlToFind[f].step);
                        //flag.setValue(3);
                }
                
            }   
            
        }
    }

    function actionRMW(_ctrlA){ 
        
        console.log("iniciando accion para el control");   
		console.log(_ctrlA);		
        let _ctrl = {};
        if(_ctrlA.chil != null && _ctrlA.chil.length > 0 && _ctrlA.action!= "loop"){
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
                    sleepRMW(_ctrl);
                }
                else if(actions[a].trim() == "change"){
                    console.log("Accionando un change");
                    console.log(_ctrl);
                    $(_ctrl.finded).focus(function() { $(this).select(); } );
                    _ctrl.finded.addEventListener("change",function(){console.log("se realizo el change");});
                    sleepRMW(_ctrl);
                }
                else if(actions[a].trim().startsWith("setText")){
                    console.log("Accionando un setText");
                    if(_ctrl.name.startsWith("filter")){
                        //es un filtro hay que obtener el o los valores correctos
                        let f = robjSearch.filter[filterProcessed];
                        if(f !== undefined){
                            let ft = rdataFilters[lastTypeFilter][f]
                            _ctrl.finded.value = ft;
                        }
                    }else{
                        _ctrl.finded.innerHTML = robjSearch[_ctrl.name];
                    }
                    
                    flag.setValue(1);
                }	
                else if(actions[a].trim() == "getText"){
                    console.log("Accionando un getText");
                    let val = _ctrl.finded.innerText;
                    
                    if(inFilterDate){
                        stepFilterDate.title = _ctrl.finded.innerText;
                    }else{
                        robjSearchResult[_ctrl.name]= _ctrl.finded.innerText;
                    }
                    
                
                    console.log("Resuktado del getText: "+_ctrl.finded.innerText)
                    flag.setValue(1);
                }   	
                else if(actions[a].trim() == "getHtml"){
                    console.log("Accionando un getHtml");
                    let val = _ctrl.finded.innerHTML;
                    console.log(val);
                    console.log("OK")
                    flag.setValue(1);
                }               	
                else if(actions[a].trim().startsWith("getAttribute")){
                    console.log("Accionando un getAttibute");
                    try{
                        let attrs = _ctrl.finded.attributes;
                        let prop = actions[a].trim().split('>');
                        console.log("Obteniendo el valor de la propiedad "+prop[1]);
                        robjSearchResult[_ctrl.name] = attrs[prop[1]].value;
                    }
                    catch(error){
                        console.log(error);
                    }
                    flag.setValue(1);                    
                }
                else if(actions[a].trim()=="loop"){
                    console.log("Accionando un loop");
                    authors = [];
                    for (let ch = 0; ch < _ctrl.chil.length; ch++) {                       
                            
                        try{
                            let query = "";
                            if(_ctrl.chil[ch].tagName!="")
                                query = _ctrl.chil[ch].tagName;
                            
                            if(_ctrl.chil[ch].className!="")
                                query += "."+_ctrl.chil[ch].className.trim().replaceAll(" ",".");

                            _ctrl.chil[ch].finded = _ctrl.finded.querySelectorAll(query);
                        }catch(error){
                            console.log(error)
                        }                         
                    }

                    for (let index = 0; index < max_authors; index++) {
                        let au =  {"nombre":"","cuenta":"","imagen":""}
                        for (let ch = 0; ch < _ctrl.chil.length; ch++) {    

                            try{
                                let ct = _ctrl.chil[ch].finded[index] ;

                                if(_ctrl.chil[ch].action == "getText"){
                                    let val = ct.innerText;                        
                                    au[_ctrl.chil[ch].name]= val;                                    
                                }
                                else if(_ctrl.chil[ch].action.startsWith("getAttribute")){
                                    try{
                                        let attrs = ct.attributes;
                                        let prop = _ctrl.chil[ch].action.trim().split('>');
                                        console.log("Obteniendo el valor de la propiedad "+prop[1]);
                                        au[_ctrl.chil[ch].name] = attrs[prop[1]].value;
                                    }
                                    catch(error){
                                        console.log(error);
                                    }
                                } 
                            }catch(error){
                                console.log(error);
                            }
                        }
                        authors.push(au);
                    }
                }
            
            }
        }else{
            console.log("No tiene accion que hacer!!");
        }		
    }

    let ctrlTime = {};
    function sleepRMW(_ctrlTime){
        ctrlTime = _ctrlTime;
        let second = ctrlTime.await;
        let tm = second/1000;
        finishedSleep = false;
        setTimeout(function(){ 
            console.log("Tiempo cumplido!!!");
            if(ctrlTime.isLoop !== undefined && ctrlTime.isLoop){
                isLoop = true;
            }
            flag.setValue(-1);
            flag.setValue(1);
        }, second);
    }


    setTimeout(function(){ 
        console.log("Starting....");
    console.log("search: "+search);
    console.log("ctrlsXToFind: "+ctrlsXToFind.length);
	
		robjSearch.text_search = search.BUSQUEDA;
        robjSearch.search = search.NOMBRE;
        robjSearch.date_start = search.FECHA_INICIO;
        robjSearch.date_end = search.FECHA_FIN;
        robjSearch.filter = [];
        try{
            robjSearch.filter = search.FILTRO.trim().split("-");
        }catch(error){
            console.log("Se trabajara sin filtro de region y lenguaje!!!");
        }
        
        robjSearchResult.search = search.NOMBRE;
        rctrlLanguajeFilter.sort((a, b) => a.step - b.step);
        rctrlLocationFilter.sort((a, b) => a.step - b.step);     
        ctrlsXToFind.sort((a, b) => a.step - b.step);
        flag.setValue(1);
    }, 5000);

  }