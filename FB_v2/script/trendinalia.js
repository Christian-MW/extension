var urlTr = "http://www.trendinalia.com/twitter-trending-topics/mexico/mexico-{{date}}.html";

var urlsTrProcess=[];
var urlsTrProcessTemp=[];
var urlsTrList = [];
var pos = -1;
var minutesInSeg = 20;
var seg = -1; 
var fechatr = "";
var stringDate ="";



$("#dbUrl").html('<a href="'+urlDB+'">aquí</a>');  

var flagTr = new observableTr(2);
flagTr.onChange(function(v){
    console.log("");console.log("");
     console.log("value changed to: " + v);  
    if(v < 2){
         if(v == 0){ 
            pos++;
            console.log("pos: "+pos+" < urlsTrList.length: "+urlsTrList.length);
            if(pos < urlsTrList.length ){
                seg = 0;

                console.log("pos: " + pos +" de "+urls_list.length ); 
                chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
                    document.getElementById(option+"lbState").innerHTML = "Procesando " + (pos + 1) + " de " + urls_list.length;
                    document.getElementById(option+"LinkProcess").innerHTML = urls_list[pos];
                    flagTr.setValue(1);
                     goToPageTr(urlTr.replace("{{date}}",urlsTrList[pos]), pos+1, tabs[0].id);  
                });
            }
            else{  
                document.getElementById(option+"lbState").innerHTML = "";
                document.getElementById(option+"LinkProcess").innerHTML = "";
                console.log("Preparando para descargar");
                console.log("urlsTrProcess: "+urlsTrProcess);                
                console.log("urlsTrProcessTemp: "+urlsTrProcessTemp);
                if(stringDate !=""){
                    for (var i = 0; i < urlsTrProcessTemp.length; i++) {
                        urlsTrProcess = [...urlsTrProcess, ...urlsTrProcessTemp[i]];
                    }

                    console.log("clasificando...");
                    //clasificador();
                    urlsTrProcess = clasificador(urlsTrProcess, themsEval,1);

                    console.log("Listo para descargar");
                    wb = XLSX.utils.book_new();                    
                    addSheet("Tendencias", urlsTrProcess);

                    downloadBook("trendinalia_"+stringDate);

                    //download("trendinalia_"+stringDate+".csv",urlsTrProcess);
                    alert("Se han procesado las fechas ingesadas, el resultado lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory+"  \n Archivo: trendinalia_"+stringDate+".xlsx");
                }
                clearTrendinalia();                
            }
         }
         else if(v==1){
            console.log("Se esta procesando un link de trendinalia");                
         }
    }     
});

async function goToPageTr(url, url_index, tab_id) {
    return new Promise(function(resolve, reject) {
        // update current tab with new url
        chrome.tabs.update({url: url});
        console.log("goToPageTr...");
        // fired when tab is updated

        chrome.tabs.onUpdated.addListener(function openPage(tabID, changeInfo) {
            console.log(tabID);
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
                // execute content script
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab_id},
                        files: ['content_scripts/script_trendinalia.js'],

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
                    seg = -1;
                    // remove onMessage event as it may get duplicated
                    chrome.runtime.onMessage.removeListener(getDOMInfo);

                    // save data from message to a JSON file and download
                    
                    //console.log("save data from message to a JSON file and download..");
                    let json_data = JSON.parse(message);      
                        
                    //json_data.html= json_data.html.replace("\\n","").replace("\n","");

                    try{
                        let dt = "20"+urlsTrList[pos].substring(0,2)+"/"+urlsTrList[pos].substring(2,4)+"/"+urlsTrList[pos].substring(4,6);
                        for (var i = 0; i < json_data.length; i++) {
                            json_data[i].push(dt);
                        }
                        console.log("Agregando fila: "+pos);
                        console.log(urlsTrList[pos]+": "+dt);
                        urlsTrProcessTemp.push(json_data);
                        //urlsTrProcess = [...urlsTrProcess, ...json_data];
                        console.log("urlsTrProcessTemp");
                        console.log(urlsTrProcessTemp);
                    }catch(err){
                        console.log(err);
                    }
                    console.log("Liberando el proceso de flagTr....");
                    flagTr.setValue(0); 
                    console.log("flagTr liberado...");

                    
                    }catch(err){
                         console.log(err);
                    }
                });

            }
        });
    });
}

$("#trstart").click(function(event){
console.log("Iniciando trandinlania...");
$('#trstart').prop('disabled', true);
$('#dtTr').prop('disabled', true);

    thems=[];
    
    if(validateDts() && themsEval.length > 0){
        
    
        for (var s = 0; s < themsEval.length; s++) {
            
            let sh = themsEval[s];
            console.log("Obteniendo el contenido de la Hojo "+ sh.desc);
            let waitData = true;                

            let url = urlBySheet.replace('{{sheetName}}',sh.desc);
            console.log(url);
            $.ajax({
                 async: false,
                 type: 'GET',
                 url: url,
                 success: function(data) {
                    console.log(data);
                    console.log(JSON.parse(data.substr(47).slice(0,-2)));
                    getDataThems(JSON.parse(data.substr(47).slice(0,-2)),s);
                 }
            });

            
            console.log("SE ha procesado la hoja "+sh.desc);

        }
        console.log("themsEval ==> "+themsEval);
        
        
        //loadThems(data);


        urlsTrList =urlsTrList.sort();
        let rs = urlsTrList.filter((item,index)=>{
          return urlsTrList.indexOf(item) === index;
        })

        urlsTrList = rs;
        console.log(urlsTrList);
        $("#errorDtTr").hide();
         $("#errorDtTr").html("");

        chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
            if(urlsTrList.length > 0){
                dateTime = new Date().toLocaleString().substring(0,16).replace(",","");
                var date = new Date();
                stringDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

                console.log("Agregando los encabezados!!!");
                //var row =["#", "Tendencia", "Hora","Fecha","Clasificación"];
                var row =["#", "Tendencia", "Hora","Fecha"];
                urlsTrProcess.push(row);
                flagTr.setValue(0);
                
            }else{
                alert("No hay links para procesar!!!");
                clearTrendinalia();
            }

        });   

/*      }

      , function(data, status) {
        console.log(data);
        console.log(status);
        $('#trstart').prop('disabled', false);
        $('#dtTr').prop('disabled', false);
        if(data.status == 403){
            $("#errorDtTr").show();
            $("#errorDtTr").html("No se pudo acceder a la base de datos de los temas.");
        }else{
            console.log("NO hay temas cargados");
            $("#errorDtTr").show();
            $("#errorDtTr").html("No se encontraron temas para hacer la clasificación.");
        }
      }
      */
     
    }else{
        console.log("La información ingresada no cumple con las reglas. Verifica tu información.");
        $("#errorDtTr").show();
        $("#errorDtTr").html("La información ingresada no cumple con las reglas. Verifica tu información.");
        $('#trstart').prop('disabled', false);
        $('#dtTr').prop('disabled', false);
    }

});

$("#trcancel").click(function(event){
    // query the current tab to find its id
    clearTrendinalia();

});

function validateDts(){
    var isValid = true;
    urlsTrList = [];
    var dts = $('#dtTr').val();

    if(dts != null && dts!= ""){
        var dtsArr = dts.replaceAll(" ","").split(',');

        for (var i = 0; i < dtsArr.length; i++) {
            if(dtsArr[i].includes('-')){
                //Rango de fechas
                if(!getRangeDate(dtsArr[i])){
                    isValid = false;
                }
            }else{
                //fecha unica
                if(dtValidFormat(dtsArr[i])){
                    let unicDt = dtsArr[i].split('/');                    
                    urlsTrList.push(unicDt[0].trim().substring(2,4)+""+unicDt[1]+""+unicDt[2]);
                }else{
                    isValid = false;
                    console.log("Fecha: "+dtsArr[i]+" no valida");
                }
            }
            
        }

    }else{
        isValid = false;
    }

    return isValid;
}

function dtValidFormat(dateStr){
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    const regexR = /^\d{4}\/\d{2}\/\d{2}-\d{4}\/\d{2}\/\d{2}$/;

    if (dateStr.replaceAll(" ","").trim().match(regex) !== null || dateStr.replaceAll(" ","").trim().match(regexR) !== null) {    
        console.log("Fecha valida");
        return true;
    }else{
        console.log("Fecha no validad");
        return false;
    }
}

function getRangeDate(dt){
    let isValid = true;

    if(dtValidFormat(dt)){

        let dts = dt.split('-');
    
        let startDt = new Date(dts[0]);
        let endDt = new Date(dts[1]);

        if(new Date(dts[0]) > new Date(dts[1])){
            startDt = new Date(dts[1]);
            endDt = new Date(dts[0]);
        }


        let dtContinue = true;
        do{
            let dt = startDt.toISOString().split('T')[0].replaceAll("-","/");
            let unicDt = dt.split('/');                    
            urlsTrList.push(unicDt[0].trim().substring(2,4)+""+unicDt[1]+""+unicDt[2]);
            startDt.setDate(startDt.getDate()+1);
        }while(startDt <= endDt);

    }else{
        console.log("Rango de fecha: "+dt+" no valida");
        isValid = false;
    }


    return isValid;
}


function clearTrendinalia(){
  console.log("Reiniciando variables.....");
  $('#trstart').prop('disabled', false);
  $('#dtTr').prop('disabled', false);
  thems =[];
  urlsTrProcess=[];
  urlsTrList = [];
  urlsTrProcessTemp=[];
  flagTr.setValue(2); 
  pos = -1;
  minutesInSeg = 20;
  seg = -1; 
  fechatr = "";
  stringDate ="";

  try{
    //Limpiar campos de alcance
    document.getElementById("errorDtTr").value ="";
    document.getElementById("dtTr").value ="";    
    document.getElementById("formTrendinalia").value="";
  }
  catch(error){
    console.log(error);
  }

  switchBlock("extencion");
  
}








$(document).on(('click','change'), function(e) { 
    var container = $(".tr-evaluation-check");
    if (!$(e.target).closest(container).length) {
      const checks = document.querySelectorAll('.badgebox');
      for (let i = 0; i < checks.length; i++) {
        try{         


            if(checks[i].checked){
                let add = true;
                for (var s = 0; s < themsEval.length; s++) {
                  if(themsEval[s].desc == checks[i].id.split("-")[1]){
                    add = false;
                    break;
                  }
                }

                if(add){
                    for (var l = 0; l < arrThems.length; l++) {
                        if(arrThems[l].desc == checks[i].id.split("-")[1]){
                            themsEval.push(arrThems[l]);
                                break;
                        }
                    }
                }

            }else{
                let remove =0;
                for (var s = 0; s < themsEval.length; s++) {
                  if(themsEval[s].desc == checks[i].id){
                    themsEval.splice(s, 1); 
                    break;   
                  }
                }

            }          
                    
        }catch(error){

        }
      }

    }
});

var shExist ="VERDADERO";
var shDontExist ="FALSO";



function validateInclude(_them,_item, index){
let _i = index;
console.log("_i: "+_i);
let coincidencia = false;

if(_them.length >= _i +_item.length){

  if(_them.length == _item.length){
    if(clearText(_them.join(' ')) == clearText(_item.join(' '))){
      coincidencia = true;
    }
  }
  else{
    let construct = "";
    for(var w = 0; w < _them.length; w++){
        if(w >= _i && w < _i+_item.length){
        construct+= " "+_them[w];
      }
    }
    console.log("Texto formado: "+construct);
    if(clearText(construct.trim()) ==  clearText(_item.join(' '))){
        coincidencia = true;
    }else{
        _i++;
        coincidencia = validateInclude(_them, _item, _i);
    }

  }

}


return coincidencia;

}