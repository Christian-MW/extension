console.log("Load file meltwaterMedition.js");
console.log(window.location.href);
let msearchs = {NOMBRE:"",BUSQUEDA:"",FILTRO:"", FECHA_FIN:"",FECHA_INICIO:"", CATEGORIA:"Viral",QUIEN_POSICIONO:"Opinión Pública",NIVEL:"Nacional"};
let mwmunexploredVersion = "1"
let mctrlsToFind = [];  
let mctrlLocationFilter = [];  
let mctrlLanguajeFilter = [];  
let mdataFilters ={};
let mctrlsFilterDate = [];

console.log("Consultando los controlsToFind");

let mtextRefres = (Math.random() + 1).toString(36).substring(7);
console.log(xpathUrl["mws_filters"][0]);
fetch(xpathUrl["mws_filters"][0]+"?refresh="+mtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try { 
        console.log("Response mdataFilters");
        console.log(resp);
        console.log(Object.keys(resp));
        console.log(Object.keys(resp.location));
        mdataFilters=resp;

         Object.keys(resp.location).forEach(tag => {
            console.log("en el ciclo de location");
            console.log(resp.location[tag]);
            $('#locationmwm').append("<option value='"+tag+"'> "+resp.location[tag]+"</option>")
        });

        
        $("#locationmwm").change(function(e, chosen) {
            $a = $("<div/>", {
            text: chosen.selected
            }).append(
            $("<span/>", {
                text: "X",
                on: {
                click: function() {
                    $(this).parent().remove();
                }
                }
            }))

        });

         
        Object.keys(resp.languaje).forEach(tag => {
            $('#languajemwm').append("<option value='"+tag+"'> "+resp.languaje[tag]+"</option>")
        });

        $(".chosen-select-width").chosen({
            width: "100%"
        });
        $("#languajemwm").change(function(e, chosen) {
            $a = $("<div/>", {
            text: chosen.selected
            }).append(
            $("<span/>", {
                text: "X",
                on: {
                click: function() {
                    $(this).parent().remove();
                }
                }
            }))

        });


        console.log("mdataFilters obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["ctrlLanguajeFilter"][0]);
mtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlLanguajeFilter"][0]+"?refresh="+mtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        mctrlLanguajeFilter=resp;
        console.log("mctrlLanguajeFilter obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});


console.log(xpathUrl["ctrlLocationFilter"][0]);
mtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlLocationFilter"][0]+"?refresh="+mtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        mctrlLocationFilter=resp;
        console.log("mctrlLocationFilter obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["controlsToFindMeditions"][0]);
mtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["controlsToFindMeditions"][0]+"?refresh="+mtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        mctrlsToFind=resp;
        console.log("controlsToFindMeditions obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

console.log(xpathUrl["ctrlsFilterDate"][0]);
mtextRefres = (Math.random() + 1).toString(36).substring(7);
fetch(xpathUrl["ctrlsFilterDate"][0]+"?refresh="+mtextRefres, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  }
})
.then((resp) => resp.json())
.then(function(resp){ 
    try {
        console.log(resp);
        mctrlsFilterDate=resp;
        console.log("mctrlsFilterDate obtenidos!!!");
    } catch (error) {
        console.log(error);  
    }
})
.catch(function(error){
console.log(error);   
});

let reqMeltSearchmwm = {
    columns:"",
    range:"",
    spreadsheet_id:""
  }
  

  let objSearchM ={};
  let objSearchMResult ={ search:""}
  let listSearchMResult =[];
  let lastpathFilnameGlobalM ="";
  let flagSearchM = new observable(2);
  flagSearchM.onChange(function(v){
        console.log("");console.log("");
        console.log("presentation meltwater");
        console.log("value changed to: " + v);  
        if(v < 2){
            if(v == 0){ 
                //Procesar la busqueda
                pos++;
                //console.log("pos: "+pos+" < msearchs.length: "+msearchs.length);
                if(pos < 1 ){
                    flagSearchM.setValue(-1);
                    console.log("Iniciando la búsqueda: "+msearchs.NOMBRE);
                    document.getElementById(option+"description").innerHTML = "Procesando la búsqueda "+msearchs.NOMBRE;
                    objSearchM.text_search = msearchs.BUSQUEDA;
                    objSearchMResult.search = msearchs.NOMBRE;
                    
                    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
           
                        goToPagemwm(xpathUrl["ms_link_serach"][0], tabs[0].id,xpathUrl["ms_max_authors"][0]); 
                        
                    });
                    
                }
                else{  
                    //Búsquedas procesadas 
                    console.log("Búsquedas procesadas !!!");                    
                    reqMeltSearchmwm.objectResult = listSearchMResult; 
                    console.log(reqMeltSearchmwm);
                    let dataAlcance = reqMeltSearchmwm.objectResult[0].dataAlcance;
                    let tw=0;
                    let fb=0;
                    let total =0;
                    for (let index = 0; index < dataAlcance.length; index++) {
                        if(dataAlcance[index].Medicion=="Publicaciones"){
                            tw=dataAlcance[index].Twitter;
                            fb=dataAlcance[index].Facebook;                            
                        }
                        if(dataAlcance[index].Medicion=="Alcance"){
                            total = parseInt(dataAlcance[index].Twitter.replaceAll(",",""))+parseInt(dataAlcance[index].Facebook.replaceAll(",",""));                            
                        }
                    }
                    let strSH = "";
                    let sh =reqMeltSearchmwm.objectResult[0].authors;
                    for (let index = 0; index < sh.length; index++) {
                        if(strSH ==""){
                            strSH += sh[index].nombre;
                        }else{
                            strSH += ", "+sh[index].nombre;
                        }
                    }
                    if(sh.length >= xpathUrl["ms_max_authors"][0]){
                        if(strSH != "")
                            strSH += ", entre otros."
                    }

                    let html_text='<html><head><title>Mediciones</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head><body style="overflow-x:hidden;margin:0px;font-family:arial"><div class="row" style="background:#f2f2f2"><div class="col-2 col-md-2"><img src="https://mwgroup.agency/wp-content/uploads/2022/07/Logotipo-2-1024x1024.png" style="width:100px"/></div><div class="col-10 col-md-8 text-center" style="padding-top:24px"><span style="font-size:26px;color:#004169"><b>{{title}}</b></span></div><div class="col-12 col-md-2"></div></div><br /><div class="container"><div class="row"><div class="col-12 col-md-6"><b>Alcance Potencial en Twitter y Facebook:</b> {{alcance}} </div><div class="col-12 col-md-3"><b>Post en Twitter:</b> {{twitter}} </div><div class="col-12 col-md-3"><b>Post en Facebook:</b> {{Facebook}} </div></div><br/><div class="row"><div class="col-12"><b>Algunos medios que han retomado la noticia son </b><br><p style="padding-right:20px">{{sh}}</p></div></div><br/><div class="row"><div class="col-12"> {{grafica}} </div></div></div><br><br><script>;let sv=document.getElementsByTagName("svg")[0];console.log(sv);sv.setAttribute("width",sv.parentNode.offsetWidth);sv.setAttribute("height",sv.parentNode.offsetHeight);</script></body><footer style="background:#004169;color:#FFFF;bottom:0;width:100%;height:6rem"><div style="display:flex;padding:20px"><div style="width:50%;font-size:18px;padding-left:20px"> Copyright © 2023. All rights reserved. </div><div style="width:50%;font-size:18px;text-align:right;padding-right:20px"><ul style="list-style-type:none;display:inline"><li style="color:#ffffff;display:inline"><a href="https://twitter.com/MWGroup_Mx"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" style="color:white"><path d="M22.23,5.924c-0.736,0.326-1.527,0.547-2.357,0.646c0.847-0.508,1.498-1.312,1.804-2.27 c-0.793,0.47-1.671,0.812-2.606,0.996C18.324,4.498,17.257,4,16.077,4c-2.266,0-4.103,1.837-4.103,4.103 c0,0.322,0.036,0.635,0.106,0.935C8.67,8.867,5.647,7.234,3.623,4.751C3.27,5.357,3.067,6.062,3.067,6.814 c0,1.424,0.724,2.679,1.825,3.415c-0.673-0.021-1.305-0.206-1.859-0.513c0,0.017,0,0.034,0,0.052c0,1.988,1.414,3.647,3.292,4.023 c-0.344,0.094-0.707,0.144-1.081,0.144c-0.264,0-0.521-0.026-0.772-0.074c0.522,1.63,2.038,2.816,3.833,2.85 c-1.404,1.1-3.174,1.756-5.096,1.756c-0.331,0-0.658-0.019-0.979-0.057c1.816,1.164,3.973,1.843,6.29,1.843 c7.547,0,11.675-6.252,11.675-11.675c0-0.178-0.004-0.355-0.012-0.531C20.985,7.47,21.68,6.747,22.23,5.924z"></path></svg></a></li><li style="color:#ffffff;display:inline"><a href="https://www.linkedin.com/company/mw-groupmx/"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" style="color:white"><path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path></svg></a></li></ul></div></div></footer></html>';
                        html_text = html_text.replace("{{grafica}}",reqMeltSearchmwm.objectResult[0].graficamentionstrend)
                        .replace("{{title}}",msearchs.NOMBRE)
                        .replace("{{busqueda}}",msearchs.BUSQUEDA)
                        .replace("{{twitter}}",tw)
                        .replace("{{Facebook}}",fb)
                        .replace("{{indexadas}}",reqMeltSearchmwm.objectResult[0].dataChart.News)
                        .replace("{{alcance}}",total.toLocaleString('en-US', {maximumFractionDigits:2}))
                        .replace("{{sh}}",strSH);
                        saveFile(msearchs.NOMBRE.replaceAll(" ","_")+".html","data:attachment/text",html_text);

                    alert("El resultado lo puedes revisar abriendo el archivo html que se acaba de descargar con nombre: "+msearchs.NOMBRE.replaceAll(" ","_")+".html");
                    clearmwm();
                            
                }
            }            
        }     
    });



  $("#mwmstart").click(function(event){

    let fileOK = false;
    if(mwmunexploredVersion == "2"){
        if($('#mwm-file-selector-carp')[0].files.length > 0)
            fileOK = true;
    }else{
        fileOK = true;
    }

    if(!fileOK){
        alert("Para la versión 2 de alcance es necesario que cargue el archivo de entrenamiento");
    }else{
    
        let title = $("#titlemwm").val();
        let s = $("#searchmwm").val();
        let lo =document.getElementById("locationmwm").value;
        let la = document.getElementById("languajemwm").value;
        for (let optLa of document.getElementById('languajemwm').options)
        {
            if (optLa.selected) {
                console.log(optLa);
                if(msearchs.FILTRO==""){
                    msearchs.FILTRO=optLa.value;
                }else{
                    msearchs.FILTRO += "-"+optLa.value;
                }
                
            }
        }
        for (let optLo of document.getElementById('locationmwm').options)
        {
            if (optLo.selected) {
                console.log(optLo);
                if(msearchs.FILTRO==""){
                    msearchs.FILTRO=optLo.value;
                }else{
                    msearchs.FILTRO += "-"+optLo.value;
                }
                
            }
        }
        let ff = $("#dtEndmwm").val();
        let fi = $("#dtStartmwm").val();
        let dateIsOK = true;
        if(fi!= "" || ff!= ""){
            if(fi== "" || ff== ""){
                //ambas fechas deben estar indicadas 
                dateIsOK = false;
            }else{
                let formatDate = ff.split('-');
                ff = formatDate[2]+"/"+formatDate[1]+"/"+formatDate[0];

                formatDate = fi.split('-');
                fi = formatDate[2]+"/"+formatDate[1]+"/"+formatDate[0];
            }
        }

        if(dateIsOK){
        
            if(title != "" && s!= ""){
                
                $(".rmw-contairner-process").show();
                document.getElementById(option+"lbState").innerHTML = "Procesando...";
                document.getElementById(option+"description").innerHTML = "Obteniendo las búsquedas...";
                
                $("#mwmstart").hide();
    
                try {
        
                    document.getElementById(option+"description").innerHTML = "Búsquedas obtenidas";         
                    msearchs.BUSQUEDA=s;

                    msearchs.FECHA_FIN=ff;
                    msearchs.FECHA_INICIO=fi;

                    msearchs.NOMBRE=title;
                    console.log(msearchs);
                    flagSearchM.setValue(0);               

                } catch (error) {
                document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las publicaciones";
                alert("Problemas al obtener las publicaciones");
                clearmwm();
                }		

            }else{ 
                document.getElementById(option+"LinkProcess").innerHTML = "El título y la búsqueda son obligatorios";
                alert("Ingresa un título y una búsqueda");
                clearmwm();
            }

        }else{ 
            document.getElementById(option+"LinkProcess").innerHTML = "Ambas fechas deben indicarse";
            alert("La fecha de inicio debe ser menor o igual a la fecha de fin");
            clearmwm();
        }
    }
  });


async function goToPagemwm(url,tab_id,max_authors) {
    return new Promise(function(resolve, reject) {
        
        // update current tab with new url
        chrome.tabs.update({url: url});
        console.log("goToPagemwm...");
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
                    func: injectScriptMWM,
                    args: [JSON.stringify(msearchs),
                        JSON.stringify(mctrlsToFind),
                        JSON.stringify(mctrlLanguajeFilter),
                        JSON.stringify(mctrlLocationFilter),
                        JSON.stringify(mdataFilters),
                        JSON.stringify(mctrlsFilterDate),
                        max_authors                        
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
                        
                        
                        //getFiles();
                        setTimeout(function(){ 
                            console.log("Termino la espera!!!");
                            /*
                            if(pathFilnameGlobal != lastpathFilnameGlobal){
                                json_data.valuesFile=processFileMWM();
                                lastpathFilnameGlobal = pathFilnameGlobal;
                            }
                            else
                                json_data.valuesFile={};
                            */
                            getAlcanceToMWM(json_data);                                                        
                        }, 3000);
                        
                                            
                    }catch(err){
                         console.log(err);
                    }
                });

            }
        });
    });
}

function getAlcanceToMWM(json_data){
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
        let dataSerch = msearchs;
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
        let dateN = new Date();
        //dateN = dateN.addDays(-1);
        let dtstart = dataSerch.FECHA_INICIO;
        let d = new Date(dateN.getFullYear() , dateN.getMonth(),dateN.getDate(), "00", "00", "00");
        let epochEnd = Math.floor((d).getTime() / 1000);

        let dtend = dataSerch.FECHA_FIN;
        dateN = dateN.addDays(-6);
        //d = new Date(dtend.split('/')[2] , dtend.split('/')[1], dtend.split('/')[0], "00", "00", "00");
        d = new Date(dateN.getFullYear() , dateN.getMonth(),dateN.getDate(), "00", "00", "00");
        let epochStart = Math.floor((d).getTime() / 1000);

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
        if(mwmunexploredVersion == "2"){
            request.append('carp', $('#mwm-file-selector-carp')[0].files[0]);
        }

        url = urlBase+xpathUrl["api_alcance"][0];
        sendPost(url, request)
        .then(function(responseAlcance){
            try{
                let dataAlcance = [];
                for (let i = 0; i < responseAlcance.length; i++) {
                    if(typeof responseAlcance[i] == "object"){
                      for (let o = 0; o < responseAlcance[i].length; o++) {
                        let tt = 0;
                        if(mwmunexploredVersion=="2"){
                            tt = responseAlcance[i][o][1]+responseAlcance[i][o][2]+responseAlcance[i][o][3];

                            dataAlcance.push(
                                {
                                    Medicion:responseAlcance[i][o][0],
                                    Twitter:""+responseAlcance[i][o][1].toLocaleString('en-US', {maximumFractionDigits:2}),
                                    Facebook:""+responseAlcance[i][o][2].toLocaleString('en-US', {maximumFractionDigits:2}),
                                    Whatsapp:""+responseAlcance[i][o][3].toLocaleString('en-US', {maximumFractionDigits:2}),
                                    Totales:tt
                                }
                            );

                        }else{
                        
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
                      }
                      break;
                    }   
                  }
                json_data.dataAlcance=dataAlcance;
                listSearchMResult.push(json_data);
                flagSearchM.setValue(0);
            }
            catch(error){
                console.log(error);
                json_data.dataAlcance=[];
                listSearchMResult.push(json_data);
                flagSearchM.setValue(0);
            }
        })
        .catch(function(error){
            console.log(error);
            json_data.dataAlcance=[];
            listSearchMResult.push(json_data);
            flagSearchM.setValue(0);
        });
        
    }catch(error){
        console.log(error);
        json_data.dataAlcance=[];
        listSearchMResult.push(json_data);
        flagSearchM.setValue(0);
    }
}

function processFileMWM(){
    console.log("processFileMWM");
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

function clearmwm(){
    $("#mwmstart").show();
    $(".rmw-contairner-process").hide();
    $(".rmw-lbState").val("");
    $(".rmw-description").val("");
    reqMeltSearchmwm = {
        columns:"",
        range:"",
        spreadsheet_id:""
      }
      $("#titlemwm").val(""); 	  
	  $("#searchmwm").val(""); 

      if(mwmunexploredVersion =="2"){      
        $('#mwm-container-carp').html('<label for="mwm-file-selector-carp">Carp:</label><input type="file" id="mwm-file-selector-carp" name="mwm-file-selector-carp" class="form-control-file border" accept=".csv" required>');        
      }else{
        $('#mwm-container-carp').html('');
      }
}


$(".mwmUnexploredV").click(function(e){ 
    mwmunexploredVersion = e.currentTarget.defaultValue;
    if(mwmunexploredVersion =="2"){
        $('#mwm-container-carp').html('<label for="mwm-file-selector-carp">Carp:</label><input type="file" id="mwm-file-selector-carp" name="mwm-file-selector-carp" class="form-control-file border" accept=".csv" required> <br><br>');        
    }
    if(mwmunexploredVersion =="1"){
        $('#mwm-container-carp').html('');
    }

    
    getVersionUnexploredApiBase(mwmunexploredVersion);

  });

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

function injectScriptMWM(_search, _mctrlsToFind, _mctrlLanguajeFilter, _mctrlLocationFilter, _mdataFilters, _filterDate,max_authors) {
    console.log("Funcion inyectada!!!");
    let months={"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June",
    "07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"};
    let filterDate ={thDate:""}
	
    let filterProcessed = -1;
	let search = JSON.parse(_search);
    let mctrlsToFind = [];
    let ctrlsXToFind = JSON.parse(_mctrlsToFind);
    let mctrlLanguajeFilter = JSON.parse(_mctrlLanguajeFilter);
    let mctrlLocationFilter = JSON.parse(_mctrlLocationFilter);
    let mdataFilters = JSON.parse(_mdataFilters);
    let mctrlsFilterDate = JSON.parse(_filterDate);

    console.log("Iniciando con datos de entrada");
    console.log("JSON search: ");
    console.log(search);
    console.log("ctrlsXToFind: "+ctrlsXToFind.length);
    console.log(ctrlsXToFind);
    console.log("mctrlLanguajeFilter: "+mctrlLanguajeFilter.length);
    console.log(mctrlLanguajeFilter);
    console.log("mctrlLocationFilter: "+mctrlLocationFilter.length);
    console.log(mctrlLocationFilter);
    console.log("mdataFilters: "+mdataFilters);
    
    htmlFather ="";
    isInHtmlFather ="";
    author = {"nombre":"","cuenta":"","imagen":""}
    authors=[];
	dataChart={};
    let retryFoundCtrl = 2;
    function observableMWM(v){
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

    let objSearchM ={ text_search:"", startDate:"", endDate:"" }
    let objSearchMResult ={ search:""}
    let listSearchMResult =[];
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
    let flag = new observableMWM(-1);
    flag.onChange(function(v){
        console.log("");console.log("");
        console.log("value changed to: " + v);  
        if(v >= 0){
            if(v == 1){ 
                //Procesar un control
                //console.log("filterProcessed >= objSearchM.filter.length");
                //console.log(filterProcessed+ " >= "+ objSearchM.filter.length);
                //console.log("indexCtrl: "+indexCtrl);
                //console.log("pos: "+pos);
                
                if(objSearchM.filter.length <= 0 && inFilters){
                    inFilterDate = true;
                    inFilters = false;
                    filterProcessed = 0;
                }

                if(inFilters && filterProcessed >= objSearchM.filter.length){
                    console.log("Reiniciando los datos 1");
                    indexCtrl = -1;
                    pos = -1;
                    typeFilter=lastTypeFilter;
                }
                if(objSearchM.filter.length > 0 && filterProcessed < objSearchM.filter.length && inFilters){
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
                        
                        if(filterProcessed >= objSearchM.filter.length){
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

                            console.log(objSearchM.filter.length);
                            console.log(filterProcessed);
                            f =  getValueFilterRMW();// objSearchM.filter[filterProcessed];
                            console.log(f)
                            if(f !== undefined && mdataFilters.languaje[f.trim()] !== undefined){
                                //filtro por lenguaje
                                lastTypeFilter = "languaje";
                                typeFilter = "languaje";
                                flag.setValue(-1);
                            
                                if(!isLoop) {
                                    indexCtrl++;                                    
                                }               
                                retryFind = 0; 
                                mctrlsToFind = mctrlLanguajeFilter;
                                processCtrlsRMW(mctrlsToFind, false);
                            }
                            else if(f !== undefined && mdataFilters.location[f.trim()] !== undefined){
                                //Filtro por localidad
                                lastTypeFilter = "location";
                                typeFilter = "location";
                                flag.setValue(-1);
                            
                                if(!isLoop) {
                                    indexCtrl++;                                    
                                }               
                                retryFind = 0; 
                                mctrlsToFind = mctrlLocationFilter;
                                processCtrlsRMW(mctrlsToFind, false);
                            }else{
                                console.log("No se logro identificar que filtro aplicar para "+f);
                                flag.setValue(-1);
                                flag.setValue(1);
                            }
                        }
                    }                       
                    else{
                        if(filterProcessed >= objSearchM.filter.length){
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
                                    if(pos >= mctrlLanguajeFilter.length ){
                                        typeFilter = "";
                                        flag.setValue(-1);
                                        flag.setValue(1);
                                    }else{
                                        flag.setValue(-1);
                                
                                        
                                        if(!isLoop) {
                                            indexCtrl++;                                    
                                        }               
                                        retryFind = 0; 
                                        mctrlsToFind = mctrlLanguajeFilter;
                                        processCtrlsRMW(mctrlsToFind, false);
                                    }
                            }
                            else if(typeFilter == "location"){
                                    if(pos >= mctrlLocationFilter.length ){
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
                                        mctrlsToFind = mctrlLocationFilter;
                                        processCtrlsRMW(mctrlsToFind, false);
                                    }
                            }
                        }
                    }
                   
                }   
                
                else if(inFilterDate && (search.FECHA_INICIO == "" || search.FECHA_INICIO === undefined
                || search.FECHA_FIN == "" || search.FECHA_FIN === undefined)){
                    inFilterDate = false;
                    stepFilterDate.step =-1;
                    flag.setValue(-1);
                    processCtrlsRMW(mctrlsToFind, false);
                }
                else if(inFilterDate && (search.FECHA_INICIO != "" && search.FECHA_INICIO !== undefined
                && search.FECHA_FIN != "" && search.FECHA_FIN !== undefined)){
                    console.log("Entrando al filtro de las fechas!!!!!");
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
                          for (let index = 0; index < mctrlsFilterDate.length; index++) {
                                 if(mctrlsFilterDate[index].name=="select_dates" ){
                                     pos = index;
                                     indexCtrl = index;
                                     break;
                                 }
                             }
                             stepFilterDate.step =-1;
                             flag.setValue(-1);
                             processCtrlsRMW(mctrlsToFind, false);
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
                        
                        mctrlsToFind = mctrlsFilterDate;
                        if(stepFilterDate.step ==1){
                             for (let index = 0; index < mctrlsFilterDate.length; index++) {
                                 if(mctrlsFilterDate[index].name=="btn_custom" ){
                                     pos = index;
                                     indexCtrl = index;
                                     break;
                                 }
                             }
                             stepFilterDate.step =2;
                             flag.setValue(-1);
                             processCtrlsRMW(mctrlsToFind, false);
                        }
                        else if(stepFilterDate.step ==2){
 
                             let typeDate = stepFilterDate.dates[stepFilterDate.date];
                             console.log("Trabajando con la fecha de "+typeDate);
                             let name = "show_calendar_from"
                             if(typeDate == "to")
                                 name = "show_calendar_to"
 
                         for (let index = 0; index < mctrlsFilterDate.length; index++) {
                                                         
                             stepFilterDate.action = 2
                             if(mctrlsFilterDate[index].name==name ){
                                 pos = index;
                                 indexCtrl = index;
                                 break;
                             }
                         }
                         stepFilterDate.step =3;
                         flag.setValue(-1);
                         processCtrlsRMW(mctrlsToFind, false);
 
                        }                       
                        else if(stepFilterDate.step ==3){
                         for (let index = 0; index < mctrlsFilterDate.length; index++) {
                             let typeDate = stepFilterDate.dates[stepFilterDate.date];
                                                            
                             if(mctrlsFilterDate[index].name== "title_calendar" ){
                                 pos = index;
                                 indexCtrl = index;
                                 break;
                             }
                         }
                         stepFilterDate.step =4;
                         flag.setValue(-1);
                         processCtrlsRMW(mctrlsToFind, false);
 
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
                             alert("No se logro obtener la fecha el proceso no puede continuar :( "+search.FECHA_INICIO);
                             inFilterDate = false;
                             flag.setValue(-1);
                             flag.setValue(1);
                         }else{
 
                             let indDate = search.FECHA_INICIO;
                             let typeDate = stepFilterDate.dates[stepFilterDate.date];
                             if(typeDate == "to")
                                 indDate = search.FECHA_FIN
                             
                             let titleInCurse = stepFilterDate.title.trim().split(" ");
                             console.log("indDate: "+ indDate);
                             let _titleUser  = [months[indDate.split("/")[1]],indDate.split("/")[2]];
                             if(indDate.split("/")[1].length == 1)
                             {
                                _titleUser = [months["0"+indDate.split("/")[1]],indDate.split("/")[2]];
                             }
                             
                             console.log("_titleUser: "+_titleUser);
                             console.log("Obteniendo la diferencia de años");
                             console.log(titleInCurse[1]+" - "+_titleUser[1]);
                             let difYears = parseInt(titleInCurse[1])-_titleUser[1];
                             //["next","back","equals"]
                             if(difYears == 0){
                                 console.log("El año es el correcto!!! se verificara el mes...");
                                 //No hay diferencias de años verificamos el mes
                                 let intMonts = ["01","02","03","04","05","06","07","08","09","10","11","12"];
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
                                     console.log("el mes es el correcto solo queda seleccionar el día");
                                     stepFilterDate.action=2;
                                 }
                                 else if(difMont > 0){
                                     //hay que adelantar para igualar el mes
                                     console.log("hay que adelantar para igualar el mes");
                                     stepFilterDate.action=0;
                                 }else{
                                     //Hay que retroceder para igualar el mes
                                     console.log("hay que retroceder para igualar el mes");
                                     stepFilterDate.action=1;
                                     
                                 }
                                 
 
                             }else if(difYears > 0){
                                 //hay que retroceder para igualar el año
                                 stepFilterDate.action=1;
                             }else{
                                 //hay que adelantar para igualar el año
                                 stepFilterDate.action=0;
                             }
 
                             for (let index = 0; index < mctrlsFilterDate.length; index++) {
                                 
                                 if(stepFilterDate.actions[stepFilterDate.action]=="back"){
                                     stepFilterDate.step =3;
                                     if(mctrlsFilterDate[index].name== "back_month" ){
                                         pos = index;
                                         indexCtrl = index;
                                         stepFilterDate.maxclick--;
                                         break;
                                     }
                                 }
                                 if(stepFilterDate.actions[stepFilterDate.action]=="next"){
                                     stepFilterDate.step =3;
                                     if(mctrlsFilterDate[index].name== "next_month" ){
                                         pos = index;
                                         indexCtrl = index;
                                         stepFilterDate.maxclick--;
                                         break;
                                     }
                                 }
                                 if(stepFilterDate.actions[stepFilterDate.action]=="equals"){
                                     stepFilterDate.step =5;
                                     if(mctrlsFilterDate[index].name== "select_day" ){
                                         pos = index;
                                         indexCtrl = index;
                                         console.log("indDate.split('/')[0] "+indDate.split("/")[0]);
                                         if(indDate.split("/")[0].startsWith("0")){
                                            console.log("El dia inicia con cero");
                                            console.log('indDate.split("/")[0].replace("0","")'+ indDate.split("/")[0].replace("0",""));
                                            mctrlsFilterDate[index].text=indDate.split("/")[0].replace("0","");
                                         }else{
                                            console.log("El dia no inicia con cero");
                                            mctrlsFilterDate[index].text=indDate.split("/")[0];
                                         }
                                         console.log("mctrlsFilterDate[index].text "+mctrlsFilterDate[index].text);
                                         
                                         break;
                                     }
                                 }
                                                                 
                             }
 
                             
                             flag.setValue(-1);
                             processCtrlsRMW(mctrlsToFind, false);
                             
                         }
 
                        }
                        else if(stepFilterDate.step == 5){
                             for (let index = 0; index < mctrlsFilterDate.length; index++) {
                                                                                         
                                 if(mctrlsFilterDate[index].name=="close_calendar" ){
                                     pos = index;
                                     indexCtrl = index;
                                     break;
                                 }
                             }
                             stepFilterDate.date++;
                             stepFilterDate.step =2;
                             flag.setValue(-1);
                             processCtrlsRMW(mctrlsToFind, false);
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
                    mctrlsToFind = ctrlsXToFind;
                    //console.log("pos: "+pos+" < mctrlsToFind.length: "+mctrlsToFind.length);
                    console.log(mctrlsToFind);
                    if(pos < mctrlsToFind.length ){
                        flag.setValue(-1);
                        
                        indexCtrl++;
                        retryFind = 3;
                        processCtrlsRMW(mctrlsToFind, false);
                        
                    }
                    else{  
                        //Controles procesadas
                        console.log("Finaliado!!!");
                        console.log(objSearchMResult);
                        //Agregando los autores
                        objSearchMResult.dataChart = dataChart;
                        objSearchMResult.authors = authors;
                        //console.log(JSON.stringify(objSearchMResult));
                        chrome.runtime.sendMessage(null, JSON.stringify(objSearchMResult));         
                    }
                }   
            }else if(v == 3){
                retryFind--;
                if(retryFind > 0){
                    setTimeout(function(){ 
                        flag.setValue(-1);
                        processCtrlsRMW(mctrlsToFind, false);                        
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
        if(filterProcessed >= objSearchM.filter.length){
            val = objSearchM.filter[filterProcessed-1];
        }else{
            val = objSearchM.filter[filterProcessed];
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
                                                let ft = mdataFilters[lastTypeFilter][f];
                                                
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
                                                let ft = mdataFilters[lastTypeFilter][f];
                                                
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
                                        let ft = mdataFilters[lastTypeFilter][f];
                                        
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
							//actionMWM(ctrlToFind);
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
                                                let ft = mdataFilters[lastTypeFilter][f];
                                                
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
                                                let ft = mdataFilters[lastTypeFilter][f];
                                                
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
                                        let ft = mdataFilters[lastTypeFilter][f];
                                        
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
							//actionMWM(ctrlToFind);
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
            if(_ctrlToFind.name == "htmlFather" || _ctrlToFind.action == "loopLabels"){
                isInHtmlFather = true;
                actionMWM(_ctrlToFind);
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
                    mctrlsToFind[indexCtrl] = ctrlToFind[0];
                }
                
                if(finded){
                    retryFind = -1;      
                    if(ctrlToFind[f].chil !== undefined && ctrlToFind[f].chil != null && ctrlToFind[f].chil.length > 0){
                        retryFind = 3;
                        processCtrlsRMW(ctrlToFind[f], true);
                    }else{
                        ctrlToFind[f].finded = ctrl;
                        actionMWM(ctrlToFind[f]);                        
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

    function actionMWM(_ctrlA){ 
        
        console.log("iniciando accion para el control");   
		console.log(_ctrlA);		
        let _ctrl = {};
        if(_ctrlA.chil != null && _ctrlA.chil.length > 0 && !_ctrlA.action.startsWith("loop")){
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
                        let f = objSearchM.filter[filterProcessed];
                        if(f !== undefined){
                            let ft = mdataFilters[lastTypeFilter][f]
                            _ctrl.finded.value = ft;
                        }
                    }else{
                        _ctrl.finded.innerHTML = objSearchM[_ctrl.name];
                    }
                    
                    flag.setValue(1);
                }	
                else if(actions[a].trim() == "getText"){
                    console.log("Accionando un getText");
                    let val = _ctrl.finded.innerText;
                    if(inFilterDate){
                        stepFilterDate.title = _ctrl.finded.innerText;
                    }else{ 
                        objSearchMResult[_ctrl.name]= _ctrl.finded.innerText;
                    }
                    
                    
                    console.log("Resuktado del getText: "+_ctrl.finded.innerText)
                    flag.setValue(1);
                }   	
                else if(actions[a].trim() == "getHtml"){
                    console.log("Accionando un getHtml");
                    let val = _ctrl.finded.innerHTML;
                    objSearchMResult[_ctrl.name]= _ctrl.finded.innerHTML;
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
                        console.log(attrs[prop[1]].value);
                        objSearchMResult[_ctrl.name] = attrs[prop[1]].value;
                    }
                    catch(error){
                        console.log(error);
                    }
                    flag.setValue(1);                    
                }
                else if(actions[a].trim()=="loopLabels"){
                    console.log("Accionando un loopLabels");
                    labels = [];
					
					try{
						let query = "";
						 
						if(_ctrl.chil[0].tagName!="")
							query = _ctrl.chil[0].tagName;
						
						if(_ctrl.chil[0].className!="")
							query += "."+_ctrl.chil[0].className.trim().replaceAll(" ",".");
						
						if(_ctrl.chil[0].attr!=""){
							query += "[";
							let attrs = _ctrl.chil[0].attr.split(",");
							for (let a = 0; a < attrs.length; a++) {
								if(a == 0)
									query += attrs[a].replaceAll("=","='")+"'"
								else
									query += " "+attrs[a].replaceAll("=","='")+"'"
							}
							
							query += "]";
						}

						_ctrl.chil[0].finded = _ctrl.finded.querySelectorAll(query);
						dataChart ={};
						
						for (let t = 0; t < _ctrl.chil[0].finded.length; t++) {
							let html = _ctrl.chil[0].finded[t].innerHTML;
							console.log(html);
							//let re = match(/ain/gi);
							let arrStr = html.match(/[(?<=\>)|(?<=\">)](.+?)[(?=\<)]/gi);
							let key=html.match(/(?<=\>)(.+?)(?=\<)/gi);
							let value=html.match(/(?<=\">)(.+?)(?=\<)/gi);
							dataChart[key[0]]=value[0];							
						}
					 
					}catch(error){
						console.log(error)
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
	
		objSearchM.text_search = search.BUSQUEDA;
        objSearchM.search = search.NOMBRE;
        objSearchM.date_start = search.FECHA_INICIO;
        objSearchM.date_end = search.FECHA_FIN;
        objSearchM.filter = [];
        try{
            objSearchM.filter = search.FILTRO.trim().split("-");
        }catch(error){
            console.log("Se trabajara sin filtro de region y lenguaje!!!");
        }
        
        objSearchMResult.search = search.NOMBRE;
        mctrlLanguajeFilter.sort((a, b) => a.step - b.step);
        mctrlLocationFilter.sort((a, b) => a.step - b.step);     
        ctrlsXToFind.sort((a, b) => a.step - b.step);
        flag.setValue(1);
    }, 5000);

  }