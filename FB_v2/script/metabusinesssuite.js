'use strict';
let urlsMtbsList =[];
jsonFile=[];
pos = -1;
minutesInSeg = 250;
seg = -1; 
fechatr = "";
stringDate ="";
let communities=[];
let currentComunidad = "";
let urlMetaBusiness ="";
let urlComunidad = "https://www.facebook.com/{{comunidad}}";
let urlApiSheet = "";
let reqGetLinks = {
  columns:"",
  range:"",
  spreadsheet_id:""
}
let datetime ="";

let flagmtbs = new observable(3);

flagmtbs.onChange(function(v){
  console.log("");console.log("");
   console.log("value changed to: " + v);  
  if(v < 3){
    if(v == 0){ 
      pos++;
      console.log("pos: "+pos+" < urlsMtbsList.length: "+urlsMtbsList.length);
      if(pos < communities.length ){
          seg = 0;

          console.log("pos: " + pos +" de "+communities.length ); 
          chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
              document.getElementById(option+"lbState").innerHTML = "Procesando " + (pos + 1) + " de " + communities.length+" comunidades";
              document.getElementById(option+"LinkProcess").innerHTML = communities[pos];
              flagmtbs.setValue(1);
              currentComunidad = communities[pos];
              //goToPageMt(urlComunidad.replace("{{comunidad}}",communities[pos]), tabs[0].id);  
              console.log("xpathUrl[comunidad]: "+xpathUrl[communities[pos]]);

              if(xpathUrl[communities[pos]] === undefined || xpathUrl[communities[pos]] == null ||
                xpathUrl[communities[pos]] == ""){
                  //La counidad no se encuentra registrada en el archivo de urls                  
                flagmtbs.setValue(0); 
              }else{
                goToPageMt(xpathUrl[communities[pos]][0], tabs[0].id);  
              }
          });
      }
      else{  
          document.getElementById(option+"lbState").innerHTML = "";
          document.getElementById(option+"LinkProcess").innerHTML = "";
          console.log("Preparando para descargar");
          console.log("urlsTrProcess: "+urlsTrProcess);                
          console.log("urlsTrProcessTemp: "+urlsTrProcessTemp);
          let date = new Date();
          
          stringDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

          if(stringDate !=""){
            
            let columns =[];

            if(getIsActiveMetaLink() != "local"){
              
              let colP =["ALCANCE"+datetime,"INTERACCIONES"+datetime,"REACCIONES"+datetime,"COMENTARIOS"+datetime,"COMPARTIDOS"+datetime];
              columns = xpathUrl["columnsbase"].concat(colP);

            }else{              
              //esta variable viene de el modulo de FB popup.js
              if(includeAlcanceMTB){
                columns =["LINK","POST","COMUNIDAD","ALCANCE","REACCIONES","COMENTARIOS","COMPARTIDOS"];  
              }else{
                columns =["LINK","POST","COMUNIDAD","ALCANCE","INTERACCIONES","REACCIONES","COMENTARIOS","COMPARTIDOS"];
              }
              
            }

            let data =[];  
            

            //agregando columnas
            data.push(columns);

            for (let index = 0; index < jsonFile.length; index++) {
                let row = jsonFile[index];
                let dataR = [];

                for (var key in columns) {
                  if(row[columns[key]] === undefined){
                    dataR.push("");
                  }else{
                    dataR.push(row[columns[key]]);
                  }                    
                }

                data.push(dataR);
                
            } 

            if(getIsActiveMetaLink() == "local"){
              console.log("Listo para descargar");
              wb = XLSX.utils.book_new();                    
              addSheet("Alcance", data);

              downloadBook("Alcance_"+stringDate);

              //download("trendinalia_"+stringDate+".csv",urlsTrProcess);
              alert("Se han procesado las publicaciones, el resultado lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory+"  \n Archivo: Alcance_"+stringDate+".xlsx");
              clearMtbs(); 
            }else{

              
              document.getElementById(option+"lbState").innerHTML = "Actualizando las publicaciones";
              document.getElementById(option+"LinkProcess").innerHTML = "Actualizando....";
              
              reqGetLinks.objectResult = jsonFile;
              console.log(JSON.stringify(reqGetLinks));
              
              let endponit = xpathUrl["update_sheet"][0];
              fetch(urlApiSheet+endponit, {
                method: 'POST',
                body: JSON.stringify(reqGetLinks),
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
    }
    else if(v==1){
      console.log("Se esta procesando una comunidad");                
    }
    else if(v==-1){
      console.log("Se esta obteniendo el html de las publicaciones de la comunidad "+currentComunidad);                
    }
    else if(v==2){
      console.log("Obteniendo html de las publicaciones de la comunidad: "+currentComunidad);    
      seg = 0;

      chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
          document.getElementById(option+"lbState").innerHTML = "Procesando " + (pos + 1) + " de " + communities.length;
          document.getElementById(option+"LinkProcess").innerHTML = communities[pos];
          flagmtbs.setValue(-1);
          urlMetaBusiness.replace("https://business.facebook.com/latest/home?asset_id=","https://business.facebook.com/latest/posts/published_posts?asset_id=");
           
            goToPageMt(urlMetaBusiness, tabs[0].id);  
      });            
    }
  }     
});

async function goToPageMt(url, tab_id) {
  return new Promise(function(resolve, reject) {
      // update current tab with new url
      chrome.tabs.update({url: url});
      console.log("goToPageMt...");
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
                      files: ['content_scripts/script_metabusiness.js'],

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
                      
                        
                    //json_data.html= json_data.html.replace("\\n","").replace("\n","");

                    try{
                      if(flagmtbs.getValue() == 1){
                        /*urlMetaBusiness = message;                      
                        flagmtbs.setValue(2); */
                        let htmlPost = document.createElement("div");
                        htmlPost.innerHTML = message;   
                        processPost(htmlPost);
                      }
                      /*
                      else if(flagmtbs.getValue() == -1){
                        let htmlPost = document.createElement("div");
                        //console.log("save data from message to a JSON file and download..");
                        htmlPost.innerHTML = message;   
                        processPost(htmlPost);

                      }
                      */
                    }catch(err){
                        console.log(err);
                    }
                  
                  }catch(err){
                       console.log(err);
                  }
              });

          }
      });
  });
}

jQuery(document).ready(function() {
    document.getElementById('mtbs-file-selector').addEventListener('change', handleFileSelect, false);
});
var ExcelToJSON = function() {

    this.parseExcel = function(file) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          //jsonFile = XL_row_object;
          if(XL_row_object.length > 0){

            let columns = [];
            for (let i = 0; i < XL_row_object.length; i++) {
              let r = XL_row_object[i];
              let result = {};
              Object.keys(r).forEach( function(key) {
                let c = key.toUpperCase();
                result[c] = r[key];
              });
              jsonFile.push(result);
            }
            
            Object.keys(jsonFile[0]).forEach( function(key) {
              columns.push(key.toUpperCase());
                });
            var select = document.getElementById('columns');
  
            for (var i = 0; i<columns.length; i++){
                var opt = document.createElement('option');
                opt.value = columns[i];
                opt.innerHTML = columns[i];
                select.appendChild(opt);      
            }
 
            $("#mtbsstart").show();
          }else{$("#mtbsstart").hide();}
          console.log(jsonFile);
        })
      };

      reader.onerror = function(ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    };
  };

  function handleFileSelect(evt) {
    columns =[];
    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
  }


$("#mtbsstart").click(function(event){
  console.log("******************Comunidades cargadas ************************");
  console.log(xpathUrl);

  document.getElementById(option+"lbState").innerHTML = "";
  document.getElementById(option+"LinkProcess").innerHTML = "";
  urlApiSheet = xpathUrl["api_java_sheet"][0];
    console.log("Starting clstart");
    let col  = $("#columns").val();

    listControlsExecuted=[];
    

    if(getIsActiveMetaLink()== "local"){
      listControlsExecuted.push({control:"LOCAL",module:mapOption[option.replace("-","")]});
      listControlsExecuted.push({control:"BTN-START",module:mapOption[option.replace("-","")]});
      saveLog();
      intMetaProcess();
    }else{
      //Consumir 
      let url = $("#urlGoogleSheet").val();
      if(url != "" && url.startsWith("https://docs.google.com/spreadsheets/d/")){
        listControlsExecuted.push({control:"GOOGLE SHEET",module:mapOption[option.replace("-","")]});
        listControlsExecuted.push({control:"BTN-START",module:mapOption[option.replace("-","")]});
        saveLog();

        url = url.replace("https://docs.google.com/spreadsheets/d/","");
        url = url.split('/')[0];
        
        reqGetLinks.columns = xpathUrl["columnsbase"].join();
        reqGetLinks.range = xpathUrl["sheetname"][0];
        reqGetLinks.spreadsheet_id = url;

        document.getElementById(option+"lbState").innerHTML = "Obteniendo las publicaciones";
        document.getElementById(option+"LinkProcess").innerHTML = "Consultando al google sheet....";
        console.log(JSON.stringify(reqGetLinks));
        let endponit = xpathUrl["get_sheet"][0];
        fetch(urlApiSheet+endponit, {
          method: 'POST',
          body: JSON.stringify(reqGetLinks),
          headers: { 'Content-Type': 'application/json',  }
       })
       
      /*
       fetch("http://localhost/GoogleData/getData/sheet.json", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  }
     })
     */
       .then((resp) => resp.json())
       .then(function(resp){ 
        console.log(resp);
          try {

            if(resp.code == 200){
              let date = new Date();
              datetime = "_"+date.getDate()+"-"+(date.getMonth() + 1)+"-"+date.getFullYear().toString()+"_"+date.getHours()+":00";
              convertData(resp.objectResult);
              intMetaProcess();

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
          clearMtbs();
       });


      }else{ 
        document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google sheets";
        alert("Ingresa una url valida de google sheets");
        clearMtbs();
      }

    }
     
    
});

function intMetaProcess(){
  pos = -1;
  if(jsonFile.length > 0){  
    getCommunity();
    $(".mtbs-contairner-process").show();
    $("#mtbsstart").hide();
    flagmtbs.setValue(0);
  }
}

function getCommunity(){
  if(jsonFile.length>0){
    if(jsonFile[0].COMUNIDAD === undefined){
      //No existe la comunidad hay que crearlo
      let i = 0;
      jsonFile.forEach(element => {
        let c = element.LINK.replace("https://www.facebook.com/","").split('/')[0];
        jsonFile[i].COMUNIDAD = c;
          const found = communities.find(f => f == c);
          if(found === undefined){
              communities.push(element.LINK);
          }else{
              console.log("Y existe la comunidad");
          }
          i++;
      });
    }else{
      jsonFile.forEach(element => {
        
          const found = communities.find(f => f == element.COMUNIDAD);
          if(found === undefined){
              communities.push(element.COMUNIDAD);
          }else{
              console.log("Y existe la comunidad");
          }
      });
    }
  }
  
}

function processPost(htmlPost){
  
  let classdiv = xpathUrl["columns_by_publications"][0] //"_2e42 _2yi0 _2yia";
  let columnsOrRows = "C";
  let listaPublic = htmlPost.getElementsByClassName(classdiv);
  if(listaPublic.length <= 0){
    listaPublic = htmlPost.getElementsByClassName(xpathUrl["columns_in_table"][0]);
    columnsOrRows = "R";
  }

  //Ciclando las publicaciones
  for(var p = 0; p<jsonFile.length; p++){
      
      if(currentComunidad != jsonFile[p].COMUNIDAD || jsonFile[p].POST =="" || jsonFile[p].POST == null){
        continue;
      }

      let datos = 5;
      let top = 0;

      //Buscando la publicación en el html
      
      if(columnsOrRows=="R"){
        //Cuando en metabusiness trabaja con tablas
        let newRow = false;
        let inRow = false;
        for(var f = 0; f < listaPublic.length; f++){        
          //verificar que el contenido de la publicación sea la misma 
          let innerText=""; 
            //Cuando en metabusiness trabaja con tablas
          let ctText = listaPublic[f].getElementsByClassName(xpathUrl["text_publication"][0]);
          if(ctText.length > 0){
            innerText = ctText[0].innerText;
            inRow = false;
            newRow = true;
          } else{ 
            innerText = listaPublic[f].innerText;
            newRow = false;
          }

          if(innerText =="" || innerText === undefined ){
            continue;
          }
          
          innerText = innerText.toLowerCase();

          console.log(jsonFile[p].POST.toLowerCase());
          let xy = jsonFile[p].POST.toLowerCase();
          if(xy.endsWith("\n")){ 
            xy = xy.substring(0,xy.length-1) 
          }
          //if(newRow && (jsonFile[p].POST.toLowerCase() == innerText || innerText.trim().startsWith(jsonFile[p].POST.toLowerCase()))){              
          if(newRow && (xy.toLowerCase() == innerText || innerText.trim().startsWith(xy.toLowerCase()))){              
              inRow = true;
          }
          if(inRow && datos > 0){
              //if(innerText.includes("cuentas alcanzadas")){
                if(innerText.includes("alcanceel valor de esta")){
                  datos--;
                  let v = innerText.split("alcance")[0];
                  jsonFile[p]["ALCANCE"+datetime] = v;
                  //jsonFile[p]["ALCANCE"+datetime] = v.replace(/\D/g, "");
              }
              if(innerText.includes("interacciones con la")){
                  datos--;
                  let v = innerText.split("interacciones con la")[0];
                  jsonFile[p]["INTERACCIONES"+datetime] = v;
                  //jsonFile[p]["INTERACCIONES"+datetime] = v.replace(/\D/g, "");
              }
              if(innerText.includes("reaccion")){
                  datos--;
                  let v = innerText.split("reaccion")[0];
                  jsonFile[p]["REACCIONES"+datetime] = v;
                  //jsonFile[p]["REACCIONES"+datetime] = v.replace(/\D/g, "");
              }
              if(innerText.includes("comentario")){
                  datos--;
                  let v = innerText.split("comentario")[0];
                  jsonFile[p]["COMENTARIOS"+datetime] = v;
                  //jsonFile[p]["COMENTARIOS"+datetime] = v.replace(/\D/g, "");
              }
              if(innerText.includes("veces compartid")){
                  datos--;
                  let v = innerText.split("veces compartid")[0];
                  jsonFile[p]["COMPARTIDOS"+datetime] = v;
                  //jsonFile[p]["COMPARTIDOS"+datetime] = v.replace(/\D/g, "");
              }
          }
          if(datos <= 0)
              break;
      }
    
        
      }else{

        for(var f = 0; f < listaPublic.length; f++){        
            //verificar que el contenido de la publicación sea la misma 
            let innerText = listaPublic[f].innerText;
            if(innerText =="" || innerText === undefined ){
              continue;
            }
            innerText = innerText.toLowerCase();

            if(top == 0 && (jsonFile[p].POST.toLowerCase() == innerText || innerText.startsWith(jsonFile[p].POST.toLowerCase()))){
                console.log("width: "+listaPublic[f].style.width);
                console.log("top: "+listaPublic[f].style.top);
                top = listaPublic[f].attributeStyleMap.get("top").value;
            }
            if(top > 0 && datos > 0 && listaPublic[f].attributeStyleMap.get("top").value == top){
                if(innerText.includes("alcanzadas")){
                    datos--;
                    jsonFile[p]["ALCANCE"+datetime] = innerText.replace(/\D/g, "");
                }
                if(innerText.includes("interacciones")){
                    datos--;
                    jsonFile[p]["INTERACCIONES"+datetime] = innerText.replace(/\D/g, "");
                }
                if(innerText.includes("reaccion")){
                    datos--;
                    jsonFile[p]["REACCIONES"+datetime] = innerText.replace(/\D/g, "");
                }
                if(innerText.includes("comentario")){
                    datos--;
                    jsonFile[p]["COMENTARIOS"+datetime] = innerText.replace(/\D/g, "");
                }
                if(innerText.includes("compartido")){
                    datos--;
                    jsonFile[p]["COMPARTIDOS"+datetime] = innerText.replace(/\D/g, "");
                }
            }
            if(datos <= 0)
                break;
        }
      }
  }

  console.log(jsonFile);
  flagmtbs.setValue(0); 

}



function clearMtbs(){
  console.log("Reiniciando variables.....");
  $('#trstart').prop('disabled', false);
  $('#dtmtbs').prop('disabled', false);
  $(".mtbs-contairner-process").hide();

  urlsMtbsList =[];
  jsonFile=[];
  pos = -1;
  minutesInSeg = 20;
  seg = -1; 
  fechatr = "";
  stringDate ="";
  communities=[];
  currentComunidad = "";
  urlMetaBusiness ="";
  reqGetLinks = {
    columns:"",
    range:"",
    spreadsheet_id:""
  }
  datetime ="";

  try{
    //Limpiar campos de alcance      
    //document.getElementById("formmtbs").value="";
    document.getElementById("urlGoogleSheet").value ="";  
    document.getElementById("mtbs-file-selector").value ="";
    document.getElementById("errorDtMtbs").value ="";
    document.getElementById("dtMtbs").value ="";     
    
  }
  catch(error){
    console.log(error);
  }

  switchBlock("extencion");

  if(includeAlcanceMTB){
    clearTimeout(myTimeout);  
    document.getElementById(option+"lbState").innerHTML = "";
    document.getElementById(option+"LinkProcess").innerHTML = "";
    restart();
    switchBlock("action");
  }
  
}


loadSheet("MetaBusiness");
loadSheet("Comunidades");
loadSheet("MetaBusinessGoogle");


function getIsActiveMetaLink(){
  let links = jQuery(".nav-link-meta");
  let response = "local"

  $(".nav-link-meta").each(function() {
    let classList = $( this ).attr("class");

    if(classList.includes("active")){
      if(this.innerText.toLowerCase().includes("google"))
      {
        response ="googleSheet";
      }
    }
  });
  return response;
}

function convertData(objectResult){
  
  let columns = objectResult[0];

  for (let r = 1; r < objectResult.length; r++) {
    let row = objectResult[r];
    let obj = {};

    for (let index = 0; index < columns.length; index++) {
      obj[columns[index].toUpperCase()] = row[index];    
    }
    jsonFile.push(obj);

  }

}