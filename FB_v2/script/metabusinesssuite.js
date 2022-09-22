'use strict';
var urlComunidades = "https://docs.google.com/spreadsheets/d/1yQ41kTP39D9y7Eh3pM7yDQyLxhI-5H6-3YjbgbfD98I/gviz/tq?&sheet={{sheetN}}&tq=Select *"
let xpathUrl={};
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
              goToPageMt(xpathUrl[communities[pos]][0], tabs[0].id);  
          });
      }
      else{  
          document.getElementById(option+"lbState").innerHTML = "";
          document.getElementById(option+"LinkProcess").innerHTML = "";
          console.log("Preparando para descargar");
          console.log("urlsTrProcess: "+urlsTrProcess);                
          console.log("urlsTrProcessTemp: "+urlsTrProcessTemp);
          var date = new Date();
          stringDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

          if(stringDate !=""){

            let data =[];  
            let columns =[];
            Object.keys(jsonFile[0]).forEach( function(key) {
                columns.push(key);
              });
            //agregando columnas
            data.push(columns);

            for (let index = 0; index < jsonFile.length; index++) {
                let row = jsonFile[index];
                let dataR = [];

                for (var key in columns) {
                    dataR.push(row[columns[key]]);
                }

                data.push(dataR);
                
            } 

              console.log("Listo para descargar");
              wb = XLSX.utils.book_new();                    
              addSheet("Alcance", data);

              downloadBook("Alcance_"+stringDate);

              //download("trendinalia_"+stringDate+".csv",urlsTrProcess);
              alert("Se han procesado las publicaciones, el resultado lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory+"  \n Archivo: Alcance_"+stringDate+".xlsx");
          }
          clearMtbs();                
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
          jsonFile = XL_row_object;
          if(jsonFile.length > 0){

            let columns = [];
            Object.keys(jsonFile[0]).forEach( function(key) {
                columns.push(key);
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
    console.log("Starting clstart");
    let col  = $("#columns").val();
    if(jsonFile.length > 0){   
      getCommunity();
      $(".mtbs-contairner-process").show();
      $("#mtbsstart").hide();
      flagmtbs.setValue(0);
    }
});


function getCommunity(){
  jsonFile.forEach(element => {
      const found = communities.find(f => f == element.comunidad);
      if(found === undefined){
          communities.push(element.comunidad);
      }else{
          console.log("Y existe la comunidad");
      }
  });
}

function processPost(htmlPost){
  
  let classdiv = xpathUrl["columns_by_publications"][0] //"_2e42 _2yi0 _2yia";

  let listaPublic = htmlPost.getElementsByClassName(classdiv);

  //Ciclando las publicaciones
  for(var p = 0; p<jsonFile.length; p++){
      
      if(currentComunidad != jsonFile[p].comunidad){
        continue;
      }

      let datos = 5;
      let top = 0;

      //Buscando la publicación en el html
      for(var f = 0; f < listaPublic.length; f++){
          //verificar que el contenido de la publicación sea la misma 
          let innerText = listaPublic[f].innerText.toLowerCase();
          if(top == 0 && (jsonFile[p].post.toLowerCase() == innerText || innerText.startsWith(jsonFile[p].post.toLowerCase()))){
              console.log("width: "+listaPublic[f].style.width);
              console.log("top: "+listaPublic[f].style.top);
              top = listaPublic[f].attributeStyleMap.get("top").value;
          }
          if(top > 0 && datos > 0 && listaPublic[f].attributeStyleMap.get("top").value == top){
              if(innerText.includes("alcanzadas")){
                  datos--;
                  jsonFile[p].alcance = innerText.replace(/\D/g, "");
              }
              if(innerText.includes("interacciones")){
                  datos--;
                  jsonFile[p].interacciones = innerText.replace(/\D/g, "");
              }
              if(innerText.includes("reaccion")){
                  datos--;
                  jsonFile[p].reacciones = innerText.replace(/\D/g, "");
              }
              if(innerText.includes("comentario")){
                  datos--;
                  jsonFile[p].comentarios = innerText.replace(/\D/g, "");
              }
              if(innerText.includes("compartido")){
                  datos--;
                  jsonFile[p].compartidos = innerText.replace(/\D/g, "");
              }
          }
          if(datos <= 0)
              break;
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
  $("#mtbsstart").hide();
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

  try{
    //Limpiar campos de alcance      
    document.getElementById("formmtbs").value="";
    document.getElementById("errorDtMtbs").value ="";
    document.getElementById("dtMtbs").value ="";  
  }
  catch(error){
    console.log(error);
  }

  switchBlock("extencion");
  
}


function loadLinkCommunities(sheetN){
  $.ajax({
      async: false,
      type: 'GET',
      url: urlComunidades.replace("{{sheetN}}",sheetN),
      success: function(data) {
        console.log("#LoadConfiguration: ")
        getDataLinksCommunity(JSON.parse(data.substr(47).slice(0,-2)));
      }
 });
}

loadLinkCommunities("MetaBusiness");
loadLinkCommunities("Comunidades");

function getDataLinksCommunity(data){
  try{
      let rows = data.table.rows;
   
      for (var i = 0; i < rows.length; i++) {
          let r = rows[i]["c"];
          xpathUrl[r[0]["v"]]= r[1]["v"].split(',');
      }
      console.log("xpathUrl: " + JSON.stringify(xpathUrl));

  }catch(error){
      console.log(error);
  }
}