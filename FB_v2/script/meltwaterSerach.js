loadSheet("MeltwterSearch");
//let searchs=[];

let searchs = [];
    
let ctrlsToFind = [];  
let ctrlLocationFilter = [];  
let ctrlLanguajeFilter = [];  
let dataFilters ={};
let ctrlsFilterDate = [];

console.log("Consultando los controlsToFind");

let textRefres = (Math.random() + 1).toString(36).substring(7);
console.log(xpathUrl["mws_filters"][0]);
fetch(xpathUrl["mws_filters"][0]+"?refresh="+textRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        dataFilters=resp;
        console.log("dataFilters obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["ctrlLanguajeFilter"][0]);
textRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlLanguajeFilter"][0]+"?refresh="+textRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        ctrlLanguajeFilter=resp;
        console.log("ctrlLanguajeFilter obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});


console.log(xpathUrl["ctrlLocationFilter"][0]);
textRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlLocationFilter"][0]+"?refresh="+textRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        ctrlLocationFilter=resp;
        console.log("ctrlLocationFilter obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["controlsToFind"][0]);
textRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["controlsToFind"][0]+"?refresh="+textRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        ctrlsToFind=resp;
        console.log("controlsToFind obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["ctrlsFilterDate"][0]);
textRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlsFilterDate"][0]+"?refresh="+textRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        ctrlsFilterDate=resp;
        console.log("ctrlsFilterDate obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

let reqMeltSearch = {
    columns:"",
    range:"",
    spreadsheet_id:""
  }

  let objSearch ={};
  let objSearchResult ={ search:""}
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
                    reqMeltSearch.range = xpathUrl["ms_sheetname_update"].join();
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

    function mwsconvertData(objectResult){
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
              mwsconvertData(resp.objectResult);
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

                chrome.scripting.executeScript({
                    target: {tabId: tab_id},
                    func: injectScript,
                    args: [JSON.stringify(searchs[pos]),
                        JSON.stringify(ctrlsToFind),
                        JSON.stringify(ctrlLanguajeFilter),
                        JSON.stringify(ctrlLocationFilter),
                        JSON.stringify(dataFilters),
                        JSON.stringify(ctrlsFilterDate)                        
                    ],
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
                            
                            if(pathFilnameGlobal != lastpathFilnameGlobal){
                                json_data.valuesFile=processFileMS();
                                lastpathFilnameGlobal = pathFilnameGlobal;
                            }
                            else
                                json_data.valuesFile={};

                            getAlcanceToMWS(json_data);                                                        
                        }, 3000);
                                            
                    }catch(err){
                         console.log(err);
                    }
                });

            }
        });
    });
}

function getAlcanceToMWS(json_data){
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
        let dataSerch = searchs[pos];
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
                listSearchResult.push(json_data);
                flagSearch.setValue(0);
            }
            catch(error){
                console.log(error);
                json_data.dataAlcance=[];
                listSearchResult.push(json_data);
                flagSearch.setValue(0);
            }
        })
        .catch(function(error){
            console.log(error);
            json_data.dataAlcance=[];
            listSearchResult.push(json_data);
            flagSearch.setValue(0);
        });
        
    }catch(error){
        console.log(error);
        json_data.dataAlcance=[];
        listSearchResult.push(json_data);
        flagSearch.setValue(0);
    }
}

function processFileMS(){
    console.log("processFileMS");
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

function injectScript(_search, _ctrlsToFind, _ctrlLanguajeFilter, _ctrlLocationFilter, _dataFilters, _filterDate) {
    console.log("Funcion inyectada!!!");
    let months={"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June",
    "7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"};
    let filterDate ={thDate:""}
	
    let filterProcessed = -1;
	let search = JSON.parse(_search);
    let ctrlsToFind = [];
    let ctrlsXToFind = JSON.parse(_ctrlsToFind);
    let ctrlLanguajeFilter = JSON.parse(_ctrlLanguajeFilter);
    let ctrlLocationFilter = JSON.parse(_ctrlLocationFilter);
    let dataFilters = JSON.parse(_dataFilters);
    let ctrlsFilterDate = JSON.parse(_filterDate);

    console.log("Iniciando con datos de entrada");
    console.log("ctrlsXToFind: "+ctrlsXToFind.length);
    console.log(ctrlsXToFind);
    console.log("ctrlLanguajeFilter: "+ctrlLanguajeFilter.length);
    console.log(ctrlLanguajeFilter);
    console.log("ctrlLocationFilter: "+ctrlLocationFilter.length);
    console.log(ctrlLocationFilter);
    console.log("dataFilters: "+dataFilters);
    
    let retryFoundCtrl = 2;
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
    //let containerPather = document.querySelectorAll('mi-app-chrome-content');
    let containerPather = document.querySelectorAll('body');
    let result =[];
    let finishedSleep = false;

    let objSearch ={ text_search:"", startDate:"", endDate:"" }
    let objSearchResult ={ search:""}
    let listSearchResult =[];
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
    let flag = new observableS(-1);
    flag.onChange(function(v){
        console.log("");console.log("");
        console.log("value changed to: " + v);  
        if(v >= 0){
            if(v == 1){ 
                //Procesar un control
                //console.log("filterProcessed >= objSearch.filter.length");
                //console.log(filterProcessed+ " >= "+ objSearch.filter.length);
                //console.log("indexCtrl: "+indexCtrl);
                //console.log("pos: "+pos);
                
                if(objSearch.filter.length <= 0 && inFilters){
                    inFilterDate = true;
                    inFilters = false;
                    filterProcessed = 0;
                }

                if(inFilters && filterProcessed >= objSearch.filter.length){
                    console.log("Reiniciando los datos 1");
                    indexCtrl = -1;
                    pos = -1;
                    typeFilter=lastTypeFilter;
                }
                if(objSearch.filter.length > 0 && filterProcessed < objSearch.filter.length && inFilters){
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
                        
                        if(filterProcessed >= objSearch.filter.length){
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

                            console.log(objSearch.filter.length);
                            console.log(filterProcessed);
                            f =  getValueFilter();// objSearch.filter[filterProcessed];
                            console.log(f)
                            if(f !== undefined && dataFilters.languaje[f.trim()] !== undefined){
                                //filtro por lenguaje
                                lastTypeFilter = "languaje";
                                typeFilter = "languaje";
                                flag.setValue(-1);
                            
                                if(!isLoop) {
                                    indexCtrl++;                                    
                                }               
                                retryFind = 0; 
                                ctrlsToFind = ctrlLanguajeFilter;
                                processCtrls(ctrlsToFind, false);
                            }
                            else if(f !== undefined && dataFilters.location[f.trim()] !== undefined){
                                //Filtro por localidad
                                lastTypeFilter = "location";
                                typeFilter = "location";
                                flag.setValue(-1);
                            
                                if(!isLoop) {
                                    indexCtrl++;                                    
                                }               
                                retryFind = 0; 
                                ctrlsToFind = ctrlLocationFilter;
                                processCtrls(ctrlsToFind, false);
                            }else{
                                console.log("No se logro identificar que filtro aplicar para "+f);
                                flag.setValue(-1);
                                flag.setValue(1);
                            }
                        }
                    }                       
                    else{
                        if(filterProcessed >= objSearch.filter.length){
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
                                    if(pos >= ctrlLanguajeFilter.length ){
                                        typeFilter = "";
                                        flag.setValue(-1);
                                        flag.setValue(1);
                                    }else{
                                        flag.setValue(-1);
                                
                                        
                                        if(!isLoop) {
                                            indexCtrl++;                                    
                                        }               
                                        retryFind = 0; 
                                        ctrlsToFind = ctrlLanguajeFilter;
                                        processCtrls(ctrlsToFind, false);
                                    }
                            }
                            else if(typeFilter == "location"){
                                    if(pos >= ctrlLocationFilter.length ){
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
                                        ctrlsToFind = ctrlLocationFilter;
                                        processCtrls(ctrlsToFind, false);
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
                         for (let index = 0; index < ctrlsFilterDate.length; index++) {
                                if(ctrlsFilterDate[index].name=="select_dates" ){
                                    pos = index;
                                    indexCtrl = index;
                                    break;
                                }
                            }
                            stepFilterDate.step =-1;
                            flag.setValue(-1);
                            processCtrls(ctrlsToFind, false);
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
                       
                       ctrlsToFind = ctrlsFilterDate;
                       if(stepFilterDate.step ==1){
                            for (let index = 0; index < ctrlsFilterDate.length; index++) {
                                if(ctrlsFilterDate[index].name=="btn_custom" ){
                                    pos = index;
                                    indexCtrl = index;
                                    break;
                                }
                            }
                            stepFilterDate.step =2;
                            flag.setValue(-1);
                            processCtrls(ctrlsToFind, false);
                       }
                       else if(stepFilterDate.step ==2){

                            let typeDate = stepFilterDate.dates[stepFilterDate.date];
                            console.log("Trabajando con la fecha de "+typeDate);
                            let name = "show_calendar_from"
                            if(typeDate == "to")
                                name = "show_calendar_to"

                        for (let index = 0; index < ctrlsFilterDate.length; index++) {
                                                        
                            stepFilterDate.action = 2
                            if(ctrlsFilterDate[index].name==name ){
                                pos = index;
                                indexCtrl = index;
                                break;
                            }
                        }
                        stepFilterDate.step =3;
                        flag.setValue(-1);
                        processCtrls(ctrlsToFind, false);

                       }                       
                       else if(stepFilterDate.step ==3){
                        for (let index = 0; index < ctrlsFilterDate.length; index++) {
                            let typeDate = stepFilterDate.dates[stepFilterDate.date];
                                                           
                            if(ctrlsFilterDate[index].name== "title_calendar" ){
                                pos = index;
                                indexCtrl = index;
                                break;
                            }
                        }
                        stepFilterDate.step =4;
                        flag.setValue(-1);
                        processCtrls(ctrlsToFind, false);

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

                            for (let index = 0; index < ctrlsFilterDate.length; index++) {
                                
                                if(stepFilterDate.actions[stepFilterDate.action]=="back"){
                                    stepFilterDate.step =3;
                                    if(ctrlsFilterDate[index].name== "back_month" ){
                                        pos = index;
                                        indexCtrl = index;
                                        stepFilterDate.maxclick--;
                                        break;
                                    }
                                }
                                if(stepFilterDate.actions[stepFilterDate.action]=="next"){
                                    stepFilterDate.step =3;
                                    if(ctrlsFilterDate[index].name== "next_month" ){
                                        pos = index;
                                        indexCtrl = index;
                                        stepFilterDate.maxclick--;
                                        break;
                                    }
                                }
                                if(stepFilterDate.actions[stepFilterDate.action]=="equals"){
                                    stepFilterDate.step =5;
                                    if(ctrlsFilterDate[index].name== "select_day" ){
                                        pos = index;
                                        indexCtrl = index;
                                        ctrlsFilterDate[index].text=indDate.split("/")[0];
                                        break;
                                    }
                                }
                                                                
                            }

                            
                            flag.setValue(-1);
                            processCtrls(ctrlsToFind, false);
                            
                        }

                       }
                       else if(stepFilterDate.step == 5){
                            for (let index = 0; index < ctrlsFilterDate.length; index++) {
                                                                                        
                                if(ctrlsFilterDate[index].name=="close_calendar" ){
                                    pos = index;
                                    indexCtrl = index;
                                    break;
                                }
                            }
                            stepFilterDate.date++;
                            stepFilterDate.step =2;
                            flag.setValue(-1);
                            processCtrls(ctrlsToFind, false);
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
                    ctrlsToFind = ctrlsXToFind;
                    //console.log("pos: "+pos+" < ctrlsToFind.length: "+ctrlsToFind.length);
                    console.log(ctrlsToFind);
                    if(pos < ctrlsToFind.length ){
                        flag.setValue(-1);
                        
                        indexCtrl++;
                        retryFind = 3;
                        processCtrls(ctrlsToFind, false);
                        
                    }
                    else{  
                        //Controles procesadas
                        console.log("Finaliado!!!");
                        console.log(objSearchResult);
                        //console.log(JSON.stringify(objSearchResult));
                        chrome.runtime.sendMessage(null, JSON.stringify(objSearchResult));         
                    }
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

function getValueFilter(){
    let val = ""
    if(filterProcessed >= objSearch.filter.length){
        val = objSearch.filter[filterProcessed-1];
    }else{
        val = objSearch.filter[filterProcessed];
    }
    return val;
}

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
                                }

                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);									
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilter();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = dataFilters[lastTypeFilter][f];
                                                
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
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilter();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = dataFilters[lastTypeFilter][f];
                                                
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
                                    let f = getValueFilter();
                                    /*
                                    console.log(filterProcessed);
                                    console.log("el texto debe ser igual alfiltro en curso: "+f);
                                    console.log(children[c].innerText);
                                    */
                                    if(f !== undefined && typeFilter != ""){
                                        let ft = dataFilters[lastTypeFilter][f];
                                        
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
                                }
                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilter();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = dataFilters[lastTypeFilter][f];
                                                
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
                                        if(ctrlToFind.text == "{{filter}}"){
                                            let f = getValueFilter();
                                            /*
                                            console.log(filterProcessed);
                                            console.log("el texto debe ser igual alfiltro en curso: "+f);
                                            console.log(children[c].innerText);
                                            */
                                            if(f !== undefined && typeFilter != ""){
                                                let ft = dataFilters[lastTypeFilter][f];
                                                
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
                                    let f = getValueFilter();
                                    /*
                                    console.log(filterProcessed);
                                    console.log("el texto debe ser igual alfiltro en curso: "+f);
                                    console.log(children[c].innerText);
                                    */
                                    if(f !== undefined && typeFilter != ""){
                                        let ft = dataFilters[lastTypeFilter][f];
                                        
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
        console.log(_ctrlToFind);
        if(isChil){
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
                            find(_ctrlToFind.finded,ctrlToFind[f]);
                            ctrlToFind[f].finded = ctrl;
                        }else{
                            break;
                        }
                    }else{
                        //console.log("BUscando el primer hijo");
                        find(_ctrlToFind.finded,ctrlToFind[f]);
                        ctrlToFind[f].finded = ctrl;
                    }
                    
                    
                }
                else{
                    console.log("Buscando en el body el control");
                    console.log(ctrlToFind[f]);
                    find(containerPather[0],ctrlToFind[f]);
                    ctrlToFind[f].finded = ctrl;
                }
                
                if(isChil){
                    _ctrlToFind.chil = ctrlToFind;
                }
                else{
                    _ctrlToFind[indexCtrl] = ctrlToFind[0];
                    ctrlsToFind[indexCtrl] = ctrlToFind[0];
                }
                
                if(finded){
                    retryFind = -1;      
                    if(ctrlToFind[f].chil !== undefined && ctrlToFind[f].chil != null && ctrlToFind[f].chil.length > 0){
                        retryFind = 3;
                        processCtrls(ctrlToFind[f], true);
                    }else{
                        ctrlToFind[f].finded = ctrl;
                        action(ctrlToFind[f]);                        
                    }    
                }
                else{

                    retryFind--;
                    if(retryFind > 0 && !isLoop){
                        isLoop = false;
                        console.log("No se encontro el control haciendo un intento más!!!");
                        setTimeout(function(){ 
                            //flag.setValue(-1);
                            processCtrls(_ctrlToFind, isChil);                        
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
                    sleep(_ctrl);
                }
                else if(actions[a].trim() == "change"){
                    console.log("Accionando un change");
                    console.log(_ctrl);
                    $(_ctrl.finded).focus(function() { $(this).select(); } );
                    _ctrl.finded.addEventListener("change",function(){console.log("se realizo el change");});
                    sleep(_ctrl);
                }
                else if(actions[a].trim().startsWith("setText")){
                    console.log("Accionando un setText");
                    if(_ctrl.name.startsWith("filter")){
                        //es un filtro hay que obtener el o los valores correctos
                        let f = objSearch.filter[filterProcessed];
                        if(f !== undefined){
                            let ft = dataFilters[lastTypeFilter][f]
                            _ctrl.finded.value = ft;
                        }
                    }else{
                        _ctrl.finded.innerHTML = objSearch[_ctrl.name];
                    }
                    
                    flag.setValue(1);
                }	
                else if(actions[a].trim() == "getText"){
                    console.log("Accionando un getText");
                    let val = _ctrl.finded.innerText;
                    
                    if(inFilterDate){
                        stepFilterDate.title = _ctrl.finded.innerText;
                    }else{
                        objSearchResult[_ctrl.name]= _ctrl.finded.innerText;
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
                        objSearchResult[_ctrl.name] = attrs[prop[1]].value;
                    }
                    catch(error){
                        console.log(error);
                    }
                    flag.setValue(1);                    
                }
            
            }
        }else{
            console.log("No tiene accion que hacer!!");
        }		
    }
    let ctrlTime = {};
    function sleep(_ctrlTime){
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
	
		objSearch.text_search = search.BUSQUEDA;
        objSearch.search = search.NOMBRE;
        objSearch.date_start = search.FECHA_INICIO;
        objSearch.date_end = search.FECHA_FIN;
        objSearch.filter = [];
        try{
            objSearch.filter = search.FILTRO.trim().split("-");
        }catch(error){
            console.log("Se trabajara sin filtro de region y lenguaje!!!");
        }
        
        objSearchResult.search = search.NOMBRE;
        ctrlLanguajeFilter.sort((a, b) => a.step - b.step);
        ctrlLocationFilter.sort((a, b) => a.step - b.step);     
        ctrlsXToFind.sort((a, b) => a.step - b.step);
        flag.setValue(1);
    }, 5000);

  }