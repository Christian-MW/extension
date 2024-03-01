dataApisMelt.tokenAuthMelt = xpathUrl["tokenAuthMelt"][0];
dataApisMelt.mw_api_search = xpathUrl["mw_api_search"][0];
dataApisMelt.mw_api_grapql = xpathUrl["mw_api_grapql"][0];
dataApisMelt.mw_api_runes = xpathUrl["mw_api_runes"][0];
dataApisMelt.mw_api_users = xpathUrl["mw_api_users"][0];
dataApisMelt.XClientName = xpathUrl["XClientName"];
dataApisMelt.apollographql_client_name = xpathUrl["apollographql-client-name"][0];
dataApisMelt.apollographql_client_version = xpathUrl["apollographql-client-version"][0];
dataApisMelt.x_request_id = xpathUrl["X-Request-Id"][0];

let rlistSearchResult =[];

let objectResult={
    search:"",
    usuarios:"",
	menciones:"",
	impresiones: "",
	alcance: "",
    valuesFile:{},
    authors:[],
    dataAlcance:[]
}

let requestApiShet = {
    spreadsheet_id:"",
    slide_id:"",
    objectResult:[],
    objectSearch:{},
    range:"",
    columns:""
}

let objectToInject={
    search:"",
    dateStart:0,//1696143600000
    dateEnd:0,//1699599599999    
    locations:[],
    languaje:[],
    sourceType:[]
}


function RM_getLanguajes(){
    objectToInject.languaje=[];
    const checks = document.querySelectorAll('.rmLanguajeBox');
    for (let i = 0; i < checks.length; i++) {
        if(checks[i].checked){
            if(checks[i].name != "" && checks[i].name != "ALL"){
                objectToInject.languaje.push(checks[i].name);            
            }              
        }   
    }
}
function RM_getLocations(){
    objectToInject.locations=[];
    const checks = document.querySelectorAll('.rmLocationBox');
    for (let i = 0; i < checks.length; i++) {
        if(checks[i].checked){
            if(checks[i].name != "" && checks[i].name != "ALL"){
                objectToInject.locations.push(checks[i].name);            
            }            
        }   
    }
}
function RM_getSourceType(){
    objectToInject.sourceType=[];
    const checks = document.querySelectorAll('.rmSourceTypeBox');
    for (let i = 0; i < checks.length; i++) {
        if(checks[i].checked){
            if(checks[i].name != "" && checks[i].name != "ALL"){
                objectToInject.sourceType.push(checks[i].name);            
            }
            
        }   
    }
}

function RM_generateMultiselectBoxes(idContainer, dataBoxes, classIdentifier,group){
    const containerBoxes = document.getElementById(idContainer);
    if(containerBoxes !== null && containerBoxes !== undefined){
        containerBoxes.innerHTML = "";
        //agregando el box todos
        containerBoxes.innerHTML +='<div><label for="'+group+'-all">  <input type="checkbox" id="'+group+'-all" name="ALL" class="'+classIdentifier+' badgebox rm-box-all" />Todos<span class="'+classIdentifier+'-check badge badge-check  badge-orange">&check;</span></label></div>';                                       
        for (let index = 0; index < dataBoxes.length; index++) {

            let key= dataBoxes[index].split('|')[0].trim();
            let value=dataBoxes[index].split('|')[1].trim();            
            containerBoxes.innerHTML +='<div><label for="'+group+'-'+key+'">  <input type="checkbox" id="'+group+'-'+key+'" name="'+key+'" class="'+classIdentifier+' badgebox" />'+value+'<span class="'+classIdentifier+'-check badge badge-check  badge-orange">&check;</span></label></div>';                                       
        }
    }

}

let expandedLanguajes = false;
let expandedLocations = false;
let expandedSources = false;
$("#rmShowLanguajes").click(function(e){     
    let checkboxes = document.getElementById("rmChecksLanguajes");
    if (!expandedLanguajes) {
      checkboxes.style.display = "block";
      expandedLanguajes = true;
    } else {
      checkboxes.style.display = "none";
      expandedLanguajes = false;
    }
});
$("#rmShowLocations").click(function(e){     
    let checkboxes = document.getElementById("rmChecksLocations");
    if (!expandedLocations) {
      checkboxes.style.display = "block";
      expandedLocations = true;
    } else {
      checkboxes.style.display = "none";
      expandedLocations = false;
    }
});
$("#rmShowSources").click(function(e){     
    let checkboxes = document.getElementById("rmChecksSources");
    if (!expandedSources) {
      checkboxes.style.display = "block";
      expandedSources = true;
    } else {
      checkboxes.style.display = "none";
      expandedSources = false;
    }
});


jQuery(document).ready(function() {
    //Cargando los lenguajes
    RM_generateMultiselectBoxes("rmChecksLanguajes", dataFiltersMelt.languaje, "rmLanguajeBox","lang");
    //Cargando las ubicaciones
    RM_generateMultiselectBoxes("rmChecksLocations", dataFiltersMelt.location, "rmLocationBox","loc");
    //Cargando las ubicaciones
    RM_generateMultiselectBoxes("rmChecksSources", dataFiltersMelt.sourceType, "rmSourceTypeBox","sour");

    $(".rm-box-all").change(function(e){  
        let isSelected = $(this).is(':checked');
        console.log(e)
        let className = e.target.className;
        className = className.replace("rm-box-all","").replace("badgebox","").replaceAll(" ","");
        let checkboxes = $("."+className);
        $("."+className).not('.rm-box-all').each(function() {
            if (isSelected) {
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false);
            }
        })

        
    });

});

let level="";
let position="";
let category="";
let epochStart="";
let epochEnd="";
let s ="";
let t ="";
let listCategory = ["Accidentes:0","Desastres naturales:1","Viral:2","Entretenimiento:3","Deportes:4","Política:5","Gobierno:6","Negocios7"];
let listPosition = ["Bots y Trolls:0","Opinión Pública Informada:1","Opinión Pública:2","Activistas:3","Influencers:4","Líderes de Opinión:5","Medios:6"];
let listLevel = ["Local:0","Regional:1","Nacional:2","Internacional:3","Mundial:4"];

$("#rmwstart").click(function(){
    //validar campos necesarios
    t = document.getElementById("rmTheme").value;
    s = document.getElementById("rmSearch").value;
    RM_getLanguajes();
    RM_getLocations();
    RM_getSourceType();
    category=document.getElementById("rmCategory").value;
    position=document.getElementById("rmPosition").value;
    level=document.getElementById("rmLevel").value;

    let dtstart = document.getElementById("rmDtStart").value;//2023-12-07
    epochStart = new Date(dtstart.split('-')[0] , parseInt(dtstart.split('-')[1])-1, dtstart.split('-')[2], 1, 0, 0, 0).getTime();
    
    let dtend = document.getElementById("rmDtEnd").value;
    epochEnd = new Date(dtend.split('-')[0] , parseInt(dtend.split('-')[1]-1), dtend.split('-')[2], 23, 59, 59, 0).getTime();
    
    let urlSheetrmw = document.getElementById("urlSheetrmw").value;
    let urlPresentationrmw = document.getElementById("urlPresentationrmw").value;

    if(t!="" && s!="" && category!="" && position!="" && level!="" && dtstart!="" && dtend!="" && urlSheetrmw!="" && urlPresentationrmw!=""){

        if(urlPresentationrmw.startsWith("https://docs.google.com/presentation/d/") && urlSheetrmw.startsWith("https://docs.google.com/spreadsheets/d/")){
            urlPresentationrmw = urlPresentationrmw.replace("https://docs.google.com/presentation/d/","").split('/')[0];            
            urlSheetrmw = urlSheetrmw.replace("https://docs.google.com/spreadsheets/d/","").split('/')[0];
        
            let categoryString = RM_GetValueFilter(listCategory, category);
            let levelString = RM_GetValueFilter(listLevel, level);
            let positionString = RM_GetValueFilter(listPosition, position);

            requestApiShet.objectSearch=[
                {comlumnName:"Tema",value:t},
                {comlumnName:"Búsqueda",value:s},
                {comlumnName:"Fecha inicio",value:dtstart},
                {comlumnName:"Fecha fin",value:dtend},  
                {comlumnName:"Idiomas",value:objectToInject.languaje},
                {comlumnName:"Ubicaciones",value:objectToInject.locations},
                {comlumnName:"Fuentes",value:objectToInject.sourceType},          
                {comlumnName:"Categoría",value:categoryString},
                {comlumnName:"Posición",value:positionString},
                {comlumnName:"Nivel",value:levelString}
            ];
            requestApiShet.slide_id=urlPresentationrmw;
            requestApiShet.spreadsheet_id=urlSheetrmw;
            
            objectToInject.search=s;
            objectToInject.dateStart=epochStart;//1696143600000
            objectToInject.dateEnd=epochEnd;//1699599599999            
            

            console.log("objectToInject")
            console.log(objectToInject)
            
            console.log("requestApiShet")
            console.log(requestApiShet)
            
            console.log("dataApisMelt")
            console.log(dataApisMelt)

            chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {           
                goToPageRmw(xpathUrl["ms_link_serach"][0], tabs[0].id,xpathUrl["ms_max_authors"][0]); 
                
            });
        }
        else{
            alert("Ingresa una url valida de google sheets y presentation");
        }

    }else{
        alert("Todos los campos son necesarios")
    }

    
});

async function goToPageRmw(url,tab_id,max_authors) {
    return new Promise(function(resolve, reject) {
        
        // update current tab with new url
        chrome.tabs.update({url: url});
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
                     resolve(); 
                    }
                    
                );  
                PARAMETERS_API_MELT.includeUsers= true;
                chrome.scripting.executeScript({
                    target: {tabId: tab_id},
                    
                    func: meltInject,
                    args:[
                        JSON.stringify(dataApisMelt),
                        JSON.stringify(objectToInject),
                        JSON.stringify(PARAMETERS_API_MELT)
                    ]
                  }, 
                  function () { 
                    resolve(); 
                });

                chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
                    try{
                        console.log("Finalizando el timer por respuesta del script");
                        // remove onMessage event as it may get duplicated
                        chrome.runtime.onMessage.removeListener(getDOMInfo);
                        let _json_data = JSON.parse(message);  
                        console.log("Respuesta de la funcion injectada");
                        console.log(_json_data);
                        console.log("Obteniendo el dato de la descarga");
                        resultReadFile ="";   
                        //_json_data.usersResponse
                        //_json_data.searchResponse
                        let rt = getTotals(_json_data.searchResponse);
                        let json_data ={
                            "search": t,
                            "usuarios": rt.a.toString(),
                            "menciones": rt.m.toString(),
                            "impresiones": rt.i.toString(),
                            "alcance": rt.v.toString(),
                            "valuesFile": getValuesFile(_json_data.searchResponse["AF-mentionsStatsTrendBySource"].compoundWidgetData["AF-latestActivityBySource"]),
                            "authors": getAuthors(_json_data.usersResponse),
                            "dataAlcance":[]
                        }     
                        
                        getAlcanceToRMW(json_data);    
                    }catch(err){
                        console.log(err);
                        alert("Problemas al obtener la información de Meltwater");
                        RM_Clear();
                   }
                });
            }
        })
    })
}

let indexAuthorInProces = 0;
let rm_flagImageAuthor = new observable(2);
rm_flagImageAuthor.onChange(function(v){
    let totalAuthors = requestApiShet.objectResult[0].authors.length;
    if(totalAuthors == 0 || indexAuthorInProces >= totalAuthors){
        //authores procesados enviar resultado al sheet
        document.getElementById(option+"description").innerHTML = "Actualizando el archivo google sheet y presentation ";
        //let endponit = xpathUrl["rmw_update_sheet"][0];
        let endponit = xpathUrl["sheet_slide_medition"][0];        
        let urlApiSheet = xpathUrl["api_java_sheet"][0];

        fetch(urlApiSheet+endponit, {
            method: 'POST',
            body: JSON.stringify(requestApiShet),
            headers: { 'Content-Type': 'application/json',  }
        })
        .then((response) => response.json())
        .then(function(response){
            if(response.code == 200){
            alert("Las publicaciones se encuentran actualizadas en el google sheet y el google presentation");
            }else if(response.code == 500){
            alert("Algo salio mal en la actualización del google sheet");
            }
            RM_Clear(); 
        })             
        .catch(function(error){
            console.log(error);                          
            alert("Problemas al actualizar las publicaciones");
            RM_Clear(); 
        });
    }else{
        if(v == 0){
            //Reseteando la bandera 
            rm_flagImageAuthor.setValue(1);
            
            //procesando imagen
            let imagen = requestApiShet.objectResult[0].authors[indexAuthorInProces].imagen;
            if(imagen == null || imagen==""){
                //requiere obtener la imagen de twitter
                chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
                    let cuenta = requestApiShet.objectResult[0].authors[indexAuthorInProces].cuenta;
                   console.log("Obteniendo la imagen de "+cuenta);
                    goToTwitterRmw("https://twitter.com/"+cuenta, tabs[0].id); 
                    
                });
            }else{
                //la imagen ya existe pasamos al siguiente author
                indexAuthorInProces ++;
                rm_flagImageAuthor.setValue(0);
            }

            
        }        
    }
    
});



//https://twitter.com/aristeguionline
function FunctionTwitterInject(){
    console.time();
    console.log("Funcion inyectada!!!")
        
    let retry = 3
    setTimeout(function(){
        getIMG();
    },5000);

    function getIMG(){
        let imgUrl = "";
        if(retry>0){
            setTimeout(function(){
                console.log("Procesando imagenes")
                console.timeEnd();
                
                let image = document.getElementsByTagName('img');
                console.log(image);
                console.log(image.length);
                for (let i = 0; i < image.length; i++){
                    try {
                        console.log(image[i].src);
                        if(image[i].src.trim().toLowerCase().endsWith("400x400.jpg") || 
                            image[i].src.trim().toLowerCase().endsWith("400x400.png")){   
                            imgUrl = image[i].src.replaceAll("'","");
                            break;
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    
                }
                if(imgUrl == "" || imgUrl == null){
                    retry --;
                    getIMG();
                }else{
                    chrome.runtime.sendMessage(null, imgUrl);
                }
        
            },1000);
        }else{
            chrome.runtime.sendMessage(null, imgUrl);
        }
        
    }
    
}

async function goToTwitterRmw(url,tab_id) {
    return new Promise(function(resolve, reject) {
        
        // update current tab with new url
        chrome.tabs.update({url: url});
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
                     resolve(); 
                    }
                    
                );  
                chrome.scripting.executeScript({
                    target: {tabId: tab_id},                    
                    func: FunctionTwitterInject,
                    args:[]
                  }, 
                  function () { 
                    resolve(); 
                });

                chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
                    try{
                        console.log("Finalizando el timer por respuesta del script");
                        // remove onMessage event as it may get duplicated
                        chrome.runtime.onMessage.removeListener(getDOMInfo);
                        
                        console.log("Respuesta de la funcion injectada");
                        console.log(message);
                        console.log("Obteniendo el dato de la descarga");

                        requestApiShet.objectResult[0].authors[indexAuthorInProces].imagen = message;
                        rm_flagImageAuthor.setValue(0);  

                    }catch(err){
                        console.log(err);
                        rm_flagImageAuthor.setValue(0);
                   }
                });
            }
        })
    })
}


function RM_GetValueFilter(data, val){
    let value = "";
    for (let index = 0; index < data.length; index++) {
        let v = data[index].split(':');
        if(v[1] == val){
            value = v[0];
            break
        }
        
    }
    return value;
}

function getAlcanceToRMW(json_data){
    try{
        console.log("Preparando data para consumir el api del alcance");
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

        let hour=0;
      
        let request = new FormData();
        request.append('categoriaTema', category);
        request.append('posicionoTema', position);
        request.append('nivel', level);
        request.append('tema', "");
        request.append('numImpre', json_data.impresiones.replaceAll(",",""));
        request.append('numpubli', json_data.menciones.replaceAll(",",""));
        request.append('numUser', json_data.usuarios.replaceAll(",",""));
        request.append('numHrs', hour);
        request.append('datestart', Math.floor(epochStart / 1000));
        request.append('dateend', Math.floor(epochEnd / 1000));
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
                requestApiShet.objectResult = rlistSearchResult;

                rm_flagImageAuthor.setValue(0);

                console.log("rlistSearchResult OK");
                console.log(rlistSearchResult);
            }
            catch(error){
                console.log(error);
                json_data.dataAlcance=[];
                rlistSearchResult.push(json_data);
                
            }
        })
        .catch(function(error){
            console.log(error);
            json_data.dataAlcance=[];
            rlistSearchResult.push(json_data);
            
        });
        
    }catch(error){
        console.log(error);
        json_data.dataAlcance=[];
        rlistSearchResult.push(json_data);
    }
    console.log("rlistSearchResult");
    console.log(rlistSearchResult);
}

function RM_ClearCheckboxes(){ 
    let boxesAll = $(".rm-box-all").each(function() {
        console.log("RM_ClearCheckboxes");
        console.log(this);
        let isSelected = false;

        let className = this.target.className;
        className = className.replace("rm-box-all","").replace("badgebox","").replaceAll(" ","");
        let checkboxes = $("."+className);
        $("."+className).each(function() {
            $(this).prop('checked', false);
        })

    });
     


    
}
function RM_Clear(){
    rlistSearchResult =[];

    objectResult={
        search:"",
        usuarios:"",
        menciones:"",
        impresiones: "",
        alcance: "",
        valuesFile:{},
        authors:[],
        dataAlcance:[]
    }
    
    requestApiShet = {
        spreadsheet_id:"",
        slide_id:"",
        objectResult:[],
        objectSearch:{}
    }
    
    objectToInject={
        search:"",
        dateStart:0,//1696143600000
        dateEnd:0,//1699599599999    
        locations:[],
        languaje:[],
        sourceType:[]
    }

    expandedLanguajes = false;
    expandedLocations = false;
    expandedSources = false;

    level="";
    position="";
    category="";
    epochStart="";
    epochEnd="";
    s ="";
    t ="";
    indexAuthorInProces = 0;

    document.getElementById("rmTheme").value = "";
    document.getElementById("rmSearch").value = "";
    document.getElementById("rmCategory").value = "";
    document.getElementById("rmPosition").value = "";
    document.getElementById("rmLevel").value = "";
    
    document.getElementById("rmDtStart").value = "";
    document.getElementById("rmDtEnd").value = "";
    document.getElementById("urlSheetrmw").value ="";
    document.getElementById("urlPresentationrmw").value ="";
    RM_ClearCheckboxes();
}