'use strict';
console.log("Cargando archivo mwgroup");

var rowActitud =[];   
var rowAlcance =[];   
var rowAlcanceXlsx =[];   
var rowWcXlsx =[]; 
var rowLD =[]; 
var LdTweetsByCluster =[]; 
//Variable para las imagenes
var imagesDownload=[];
var rowWcImg ="";   
var rowLdImg ="";   
var hashmap = new Map();

var contentFileLD =[];

var fileNameAlcance="";
var msg ="";
var msgActitud = "";
var msgAlcance = "";
var msgWordCloud = "";
var msgAudiencias = "";
var msgLines = "";
var toProcess = 0;
var processed = 0;
var descriptionEvaluation="";



var flagEvaluation = new observable("");
flagEvaluation.onChange(function(v){
  if(v!=""){
    console.log("flagEvaluation: "+v);
    document.getElementById(option+"description").innerHTML = v;
    if(processed==toProcess){
      setTimeout(function() {
        wb = XLSX.utils.book_new();
        const checks = document.querySelectorAll('.badgebox');
        for (let i = 0; i < checks.length; i++) {
          if(checks[i].checked){

            if(checks[i].id=="Actitud"){
              addSheet("Actitud", rowActitud);
              //download("Actitud_"+nameFileLoaded,rowActitud);

            }else if(checks[i].id=="Alcance"){
              addSheet("Alcance", rowAlcanceXlsx);
              //download(fileNameAlcance,rowAlcance);  

            }else if(checks[i].id=="WordCloud"){
              addSheet("WordCloud", rowWcXlsx);
              descriptionEvaluation += "\n Imagen wordcloud: "+document.getElementById("namefilesave").value.trim()+"_wordcloud.jpeg";
    
              downloadImg(document.getElementById("namefilesave").value.trim()+"_wordcloud.jpeg",rowWcImg);
            }else if(checks[i].id=="Audiencias"){
              
            }else if(checks[i].id=="LineasDiscursivas"){
              addSheet("Líneas Discursivas", rowLD);
              downloadImg(document.getElementById("namefilesave").value.trim()+"_lineas.jpeg",rowWcImg);
            }

          }
          
        } 

        //descarga de imagenes
        for (let i = 0; i < imagesDownload.length; i++) {
          downloadImg(imagesDownload[i].name,imagesDownload[i].content);          
        }
        downloadBook(document.getElementById("namefilesave").value.trim());
        alert(descriptionEvaluation);
        clearMwgroup();  

      },10);
    }
  }
});
 

// image gallery
// init the state from the input
$(".image-checkbox").each(function () {
  if ($(this).find('input[type="checkbox"]').first().attr("checked")) {
    $(this).addClass('image-checkbox-checked');
  }
  else {
    $(this).removeClass('image-checkbox-checked');
  }
});

// sync the state to the input
$(".image-checkbox").on("click", function (e) {
  $(this).toggleClass('image-checkbox-checked');
  var $checkbox = $(this).find('input[type="checkbox"]');
  $checkbox.prop("checked",!$checkbox.prop("checked"))

  e.preventDefault();
});


function getToken(){

  const secret = new FormData();
  secret.append('email', 'prueba@prueba.com');
  secret.append('password', '#admincaronte1');
 
  return fetch(urlBase+'/token', {
     method: 'POST',
     body: secret
  })
  .then((response) => response.json())
  .catch((error) => error);
}

function getEvaluation(evaluacion ="", token=""){

  let request = new FormData();
  let url = "";

  switch(evaluacion){
    case "Actitud":
        request.append('id', 'christian.garcia');
        request.append('file_train', $('#'+option+'file-selector-trainning')[0].files[0]);
        request.append('file_rate', $('#'+option+'file-selector-clasification')[0].files[0]);
        //secret.append('file_rate', $('input[type=file]')[0].files[0]);
         url = urlBase+"/actitud";
      break;

    case "Alcance":
        
        //let epoch = Math.floor((d).getTime() / 1000)-(3600*5);
        let dtstart = document.getElementById("dtStart").value;
        let d = new Date(dtstart.split('-')[0] , dtstart.split('-')[1], dtstart.split('-')[2], "00", "00", "00");
        let epochStart = Math.floor((d).getTime() / 1000);

        let dtend = document.getElementById("dtEnd").value;
        d = new Date(dtend.split('-')[0] , dtend.split('-')[1], dtend.split('-')[2], "00", "00", "00");
        let epochEnd = Math.floor((d).getTime() / 1000);

        let category=document.getElementById("category").value;
        let position=document.getElementById("position").value;
        let level=document.getElementById("level").value;
        let impresion=document.getElementById("impresion").value;
        let publication=document.getElementById("publication").value;
        let user=document.getElementById("user").value;
        let hour=document.getElementById("hour").value;

        fileNameAlcance="Alcance"+hashCode(category+""+position+""+level+""+impresion+""+publication+""+user+""+hour)+".csv";

        request.append('categoriaTema', category);
        request.append('posicionoTema', position);
        request.append('nivel', level);
        request.append('tema', "");
        request.append('numImpre', impresion);
        request.append('numpubli', publication);
        request.append('numUser', user);
        request.append('numHrs', hour);
        request.append('datestart', epochStart);
        request.append('dateend', epochEnd);
        
         url = urlBase+"/alcance";
      break;
    
    case "WordCloud":
        let file= $('#'+option+'file-selector-wc')[0].files[0];
        let stopfile=$('#'+option+'file-selector-wc-stop')[0].files[0];
        let id= "pruebasdir";
        let p=document.getElementById("wcwords").value;
        let forma=document.getElementById("wcform").value;
        let color=document.getElementById("wctype").value;

        request.append('id', id);
        request.append('file', file);
        request.append('stopfile', stopfile);
        request.append('p', p);
        request.append('forma', forma);
        request.append('color', color);
         url = urlBase+"/wordcloud";
      break;

    case "LineasDiscursivas":
        let fileLd= $('#'+option+'file-selector-ld')[0].files[0];        
        let publicaciones=document.getElementById("ldNPublications").value;

        request.append('file', fileLd);
        request.append('publicaciones', publicaciones);
        let type=document.getElementById("ldTypeProcess").value;
        if(type=="0"){
          url = urlBase+"/linea";
        }
        else  if(type=="1"){
          url = urlBase+"/lineatopicoall";
        }
      break;

  }

  if(evaluacion != ""){
 
    return fetch(url, {
       method: 'POST',
       body: request
       //headers: { 'Authorization': token  }
    })
    .then((response) => response.json())
    .catch((error) => error);
  }else{
    return {status:210};
  }
  
}


function getActitude(){
  /*
  return getToken()
  .then(function(response){
    if(response.access_token !== undefined && response.access_token != "") {
        console.log("Token obtenido correctamente!!!");
        */
        msgActitud += " <br> Actitud...";
        msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
        flagEvaluation.setValue(msg);        
        //getEvaluation("Actitud", response.token_type+ " " +response.access_token)
        getEvaluation("Actitud", "")
        .then(function(responseActitud){
          try{
            let n = responseActitud.Data["Dialogo Negativo"];
            let p = responseActitud.Data["Dialogo Positivo"];
            let i = responseActitud.Data["Dialogo Informativo"];
            if(n=== undefined)
              n=0;
            if(p=== undefined)
              p=0;
            if(i=== undefined)
              i=0;

            console.log("Negativo: "+n.toFixed(2));
            console.log("Positivo: "+p.toFixed(2));
            console.log("Informativo: "+i.toFixed(2));
            
            rowActitud =[];  
            rowActitud.push(["Positivo","Informativo","Negativo"]);
            rowActitud.push([p.toFixed(2), i.toFixed(2), n.toFixed(2)]);
            let name = $('#'+option+'file-selector-clasification')[0].files[0];
            nameFileLoaded = name.name.split(".")[0]+".csv";

            msgActitud = msgActitud.replace("Actitud...","Actitud procesada!!!");
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            /*
            if(processed > 0){
              descriptionEvaluation += "\n--------------------------------------------------";
            }else{
              descriptionEvaluation += "\n";
            }
            descriptionEvaluation += "\nACTITUD: Actitud_"+nameFileLoaded;
            */
            processed++;
            flagEvaluation.setValue(msg);
            
          }catch(error){
            console.log(error);   
            msgActitud = msgActitud.replace("Actitud...","Actitud no puedo ser procesada");
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            processed++;
            flagEvaluation.setValue(msg);
          }
                 
        })
        .catch(function(error){
          console.log(error);   
          rowActitud=[["No fue posible obtener la información del api"]]; 
            msgActitud = "Actitud no puedo ser procesada :( problema con unexplored";
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            processed++;
            flagEvaluation.setValue(msg);
        });
        /*
     } else {
      console.log(response.error_description);   
     }   
  });
  */

}

function getAlcance(){
  /*
  return getToken()
  .then(function(response){
    if(response.access_token !== undefined && response.access_token != "") {
       console.log("Token obtenido correctamente!!!");
       */
        msgActitud += " <br> Alcance...";
        msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
        flagEvaluation.setValue(msg);
        //getEvaluation("Alcance", response.token_type+ " " +response.access_token)
        getEvaluation("Alcance", "")
        .then(function(responseAlcance){
          try{
            console.log(responseAlcance);
            rowAlcance =[];   
            rowAlcanceXlsx =[];
            rowAlcance.push(["","Twitter","Facebook","Whatsapp","Totales"]);
            rowAlcanceXlsx.push(["","Twitter","Facebook","Whatsapp","Totales"]);
            for (let i = 0; i < responseAlcance.length; i++) {
              if(typeof responseAlcance[i] == "object"){
                for (let o = 0; o < responseAlcance[i].length; o++) {
                  rowAlcance.push(['"'+responseAlcance[i][o][0].trim()+'"',
                                   '"'+responseAlcance[i][o][1].trim()+'"',
                                   '"'+responseAlcance[i][o][2].trim()+'"',
                                   '"'+responseAlcance[i][o][4].trim()+'"',
                                   '"'+responseAlcance[i][o][3].trim()+'"']);

                  rowAlcanceXlsx.push([responseAlcance[i][o][0].trim(),
                                   responseAlcance[i][o][1].trim(),
                                   responseAlcance[i][o][2].trim(),
                                   responseAlcance[i][o][4].trim(),
                                   responseAlcance[i][o][3].trim()]);
                }
                break;
              }   
            }

            msgActitud = msgActitud.replace("Alcance...","Alcance procesada!!!");
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            /*
            if(processed > 0){
              descriptionEvaluation += "\n--------------------------------------------------";
            }else{
              descriptionEvaluation += "\n";
            }
            descriptionEvaluation += "\nALCANCE: "+fileNameAlcance;
            */
            processed++;
            flagEvaluation.setValue(msg);
          }catch(error){
            console.log(error);   
            msgAlcance = "Alcance no puedo ser procesado :( problema con unexplored";
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            processed++;
            flagEvaluation.setValue(msg);
          }
                 
        })
        .catch(function(error){
          console.log(error);   
            rowAlcanceXlsx=[["No fue posible obtener la información del api"]]; 
            msgAlcance = "Alcance no puedo ser procesada  :( problema con unexplored";
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            processed++;
            flagEvaluation.setValue(msg);
        });
      /*  
     } else {
      console.log(response.error_description);   
     }   
     
  });
*/
}


function getWordCloud(){
  /*
  return getToken()
  .then(function(response){
    if(response.access_token !== undefined && response.access_token != "") {
       console.log("Token obtenido correctamente!!!");
       */
        msgWordCloud += " <br> WordCloud...";
        msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
        flagEvaluation.setValue(msg);
        //getEvaluation("WordCloud", response.token_type+ " " +response.access_token)
        getEvaluation("WordCloud", "")
        .then(function(responseWc){
          try{
            rowWcXlsx =[];
            imagesDownload.push({name:document.getElementById("namefilesave").value.trim()+"_wordcloud.jpeg",content:"data:image/jpeg;base64,"+responseWc.Image});
            //rowWcImg = "data:image/jpeg;base64,"+responseWc.Image;
            rowWcXlsx.push(["Palabra","Repeticiones"]);
            for (let i = 0; i < responseWc.Data.Palabras.length; i++) {
              rowWcXlsx.push([responseWc.Data.Palabras[i],responseWc.Data.Repeticiones[i]]);
              
            }

            msgWordCloud = msgWordCloud.replace("WordCloud...","WordCloud procesada!!!");
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;

            processed++;
            flagEvaluation.setValue(msg);
          }catch(error){
            console.log(error);   
            msgWordCloud = msgWordCloud.replace("WordCloud...","WordCloud no puedo ser procesado");
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            processed++;
            flagEvaluation.setValue(msg);
          }
                 
        })
        .catch(function(error){
          console.log(error);  
          rowWcXlsx=[["No fue posible obtener la información del api"]]; 
            msgWordCloud = "WordCloud no puedo ser procesada :( problema con unexplored";
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
            processed++;
            flagEvaluation.setValue(msg);
        });
        /*
     } else {
      console.log(response.error_description);   
     }   
  });
  */

}

function getLinesDiscursive(){
  /*
  return getToken()
  .then(function(response){
    if(response.access_token !== undefined && response.access_token != "") {
       console.log("Token obtenido correctamente!!!");
       */
        msgLines += " <br> Líneas Discursivas...";
        msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;
        flagEvaluation.setValue(msg);
        //getEvaluation("LineasDiscursivas", response.token_type+ " " +response.access_token)
        getEvaluation("LineasDiscursivas", "")
        .then(function(responseLd){
          hashmap = new Map();

          let type=document.getElementById("ldTypeProcess").value;
          if(type=="0"){
            let base = responseLd.cluster.cluster.replace("<img src='","").replace("' class='img-fluid'>","");
                        
            imagesDownload.push(
              {
                name:document.getElementById("namefilesave").value.trim()+"_lineas.jpeg",
                content:"data:image/jpeg;base64,"+base
              });
            
            let clusterProccesed = 0;
            for (var i = 0; i < responseLd.cluster.archivos.length; i++) {
              let fBase = responseLd.cluster.archivos[i].replace("<a href='","").split("' download")[0];
              
              getTweetsInCloster(fBase,"cluster"+(i+1))
                .then(tweetsByCloster => {
                  //LdTweetsByCluster.push(tweetsByCloster);
                  clusterProccesed++;
                })
                .then(()=>{
                  if(responseLd.cluster.archivos.length == clusterProccesed){
                    getObjectGroupTopicos(responseLd.topicos);
                    console.log(hashmap);
                    console.log(rowLD);


                    msgLines = msgLines.replace("Líneas Discursivas...","Líneas Discursivas procesada!!!");
                    msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;

                    processed++;
                    flagEvaluation.setValue(msg);
                  }
                });              
            }
            
          }
          else  if(type=="1"){
            LdTweetsByCluster= undefined;
            getObjectGroupTopicos(responseLd.topicos);

            msgLines = msgLines.replace("Líneas Discursivas...","Líneas Discursivas procesada!!!");
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;

            processed++;
            flagEvaluation.setValue(msg);
          }

   
        })
        .catch(function(error){
          console.log(error);  
          rowLD=[["No fue posible obtener la información del api"]];
            msgLines = "Líneas Discursivas no procesada :( problema con unexplored";
            msg = msgActitud+msgAlcance+msgWordCloud+msgAudiencias+msgLines;

            processed++;
            flagEvaluation.setValue(msg);
        });
        /*
     } else {
      console.log(response.error_description);   
     }   
  });
  */
}



function showButtonStart(){

  let showStart =true;
  let checkedOption =false;

  const checks = document.querySelectorAll('.badgebox');

  for (let i = 0; i < checks.length; i++) {
    try{

      if(checks[i].checked){
        checkedOption = true;
        if(checks[i].id=="Actitud"){

          let t = $('#'+option+'file-selector-trainning')[0].files[0];
          let c = $('#'+option+'file-selector-clasification')[0].files[0];
          if(t === undefined || c === undefined){
            showStart = false;
            break;
          }
        }

      }          
      
    }catch(error){

    }
  }

  if(showStart && checkedOption){
    $("#xpstart").show();
  }else{
    $("#xpstart").hide();
  }

}

function unchecked(){
  const checks = document.querySelectorAll('.badgebox');
  for (let i = 0; i < checks.length; i++) {
    checks[i].checked=false;
    //$("#tab"+checks[i].id).removeClass("active");
    //$("#tab"+checks[i].id).addClass("fade");
    $("#tab"+checks[i].id).hide();
  }

}

function clearMwgroup(){
  console.log("Reiniciando variables.....");
  //Actitud
   try {      
      document.getElementById(option+"file-selector-trainning").value = "";
      document.getElementById(option+"file-selector-clasification").value = "";
    } catch (error) {
      console.log(error);
    }
  unchecked();
  showButtonStart();
  $('input[type="checkbox"]').removeAttr('disabled');
  urls_list = [];
  urls_processed = [];
  dateTime = "";
  nameFileLoaded = "";
  pos = -1;
  currentUrl = "";
  domain = "https://";

  minutesInSeg = 20;
  seg = -1; 

  //var flag = 0;
  flag.setValue(2);

  hashmap = new Map();
  rowActitud =[];   
  msg ="";
  msgActitud = "";
  msgAlcance = "";
  msgWordCloud = "";
  msgAudiencias = "";
  msgLines = "";
  toProcess = 0;
  processed = 0;
  descriptionEvaluation="";
  flagEvaluation.setValue("");
  imagesDownload=[];
  try{
    //Limpiar campos de alcance
    document.getElementById("namefilesave").value ="";
    document.getElementById("category").value ="";
    document.getElementById("position").value="";
    document.getElementById("level").value="";
    document.getElementById("impresion").value="";
    document.getElementById("publication").value="";
    document.getElementById("user").value="";
    document.getElementById("hour").value="";
    document.getElementById("dtStart").value="";
    document.getElementById("dtEnd").value="";
  }
  catch(error){
    console.log(error);
  }

  try{
    //Limpiar campos del wordcloud
    document.getElementById("xp-file-selector-wc").value="";    
    document.getElementById("wcwords").value="0";
    document.getElementById("wcform").value="";
    document.getElementById("wctype").value="";
    document.getElementById("wcStop").checked = false;
    document.getElementById("xp-file-selector-wc-stop").value="";
  }
  catch(error){
    console.log(error);
  }

    try{
    //Limpiar campos del líneas discursivas
    document.getElementById("xp-file-selector-ld").value="";    
    document.getElementById("ldTypeProcess").value="";
    document.getElementById("ldNPublications").value="1";
  }
  catch(error){
    console.log(error);
  }



  fileNameAlcance ="";
  switchBlock("extencion");
  
}



$(document).on(('click','change'), function(e) {
    var container = $(".xp-evaluation-check");
    if (!$(e.target).closest(container).length) {
      $(".namefilesave").hide();
      const checks = document.querySelectorAll('.badgebox');
      for (let i = 0; i < checks.length; i++) {
        try{

          if(checks[i].id=="wcStop"){            
            if(checks[i].checked){
              $("#div"+checks[i].id).show();
            }else{
              $("#div"+checks[i].id).hide();
              document.getElementById("xp-file-selector-wc-stop").value ="";
            }          
          }else if(checks[i].id=="mwSql"){            
            
          }
          else if(checks[i].checked){
            $(".xp-evaluation-action").show();
            $("#tab"+checks[i].id).show();
            $(".namefilesave").show();
          }else{
            $("#tab"+checks[i].id).hide();
          }          
          
        }catch(error){

        }
      }

    }
    showButtonStart();
});



 //$("#formEvaluation").submit(function(event){
 $("#xpstart").click(function(event){

  if(validateForm()){
    imagesDownload=[];

    descriptionEvaluation = "Solicitud procesada, los resultados lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory;
      // query the current tab to find its id
    switchBlock("process");
    $('input[type="checkbox"]').attr('disabled','disabled');
    const checks = document.querySelectorAll('.badgebox');
    //document.getElementById(option+"lbState").innerHTML = "Procesando... ";
    toProcess = 0;
    descriptionEvaluation += "\n Archivo: "+document.getElementById("namefilesave").value.trim()+".xlsx";
    for (let i = 0; i < checks.length; i++) {
      //let text =document.getElementById(option+"lbState").innerHTML;
      if(checks[i].checked){
        
        if(checks[i].id=="Actitud"){
          toProcess++;
          let act = getActitude();
        }else if(checks[i].id=="Alcance"){
          toProcess++;
          let alc = getAlcance();
        }else if(checks[i].id=="WordCloud"){
          toProcess++;
          let alc = getWordCloud();
        }else if(checks[i].id=="LineasDiscursivas"){
          toProcess++;
          let alc = getLinesDiscursive();
        }      

      }
      
    }
  }
});

// Disable form submissions if there are invalid fields
(function() {
  'use strict';

  var min = 0,
    max = 24,
    select = document.getElementById('hour');

  for (var i = min; i<max; i++){

    for (var m = 0; m<=45; m++){
      let h = i+":"+((m== 0)?"00":m);
      let val = ((60*(i*60))+(m*60));
        var opt = document.createElement('option');
        opt.value = val;
        opt.innerHTML = h;
        select.appendChild(opt);
        m=m+14;
    }
  }

})();

function validateForm(){  
  let ok=true;

  if(document.getElementById("namefilesave").value == ""){
    ok = false;
    return ok;
  }else{
    const checks = document.querySelectorAll('.badgebox');
    for (let i = 0; i < checks.length; i++) {
      if(checks[i].checked){
        toProcess++;
        if(checks[i].id=="Alcance"){
          //Verifica que no haya ningun campo vacio
          ok = isFull("category")
          if(!ok){
            i=100;
            break;
          }
          ok = isFull("position")
          if(!ok){
            i=100;
            break;
          }          
          ok = isFull("level")
          if(!ok){
            i=100;
            break;
          }
          ok = isFull("impresion")
          if(!ok){
            i=100;
            break;
          }
          ok = isFull("publication")
          if(!ok){
            i=100;
            break;
          }
          ok = isFull("user")
          if(!ok){
            i=100;
            break;
          }
          ok = isFull("hour")
          if(!ok){
            i=100;
            break;
          }
          ok = isFull("dtStart")
          if(!ok){
            i=100;
            break;
          }
          ok = isFull("dtEnd")
          if(!ok){
            i=100;
            break;
          }
        }

        if(checks[i].id=="WordCloud"){
          //Verifica que no haya ningun campo vacio
          ok = isFull("xp-file-selector-wc");
          if(!ok){
            i=100;
            break;
          }

          const ch = document.querySelector('#wcStop');
          let stop = isFull("xp-file-selector-wc-stop");
          if(ch.checked && !stop){
            i=100;
            ok=false;
            break;
          }
        }

        if(checks[i].id=="LineasDiscursivas"){
          //Verifica que no haya ningun campo vacio
          ok = isFull("xp-file-selector-ld");
          if(!ok){
            i=100;
            break;
          }

          ok = isFull("ldTypeProcess");
          if(!ok){
            i=100;
            break;
          }

          ok = isFull("ldNPublications");
          if(!ok){
            i=100;
            break;
          }

        }
      }
    }
  }

  return ok;
}

function isFull(id){
  if(document.getElementById(id).value.trim() == ""){
    return false;
  }else{
    return true;
  }
}


 document.getElementById('xp-file-selector-ld').addEventListener('change', function() {
      
    var fr=new FileReader();
    fr.readAsText(this.files[0], "UTF-8");
    fr.onload=function(evt){
      var content = evt.target.result;
        contentFileLD=content.split(/\r?\n/);
    }
      
})

  function getObjectGroupTopicos(ar){
    //Crear el objeto con las palabras teniendo como valor el numero de repeiciones
    var rs ={};      
    const lines = [];
    let itemLinea = 1;
    ar.forEach(element => {
      lines.push("Linea-"+(itemLinea));
      element.forEach(word => {
        if(rs[word] === undefined){
          rs[word] =1;
        }else{
          rs[word] =rs[word] + 1;
        }
      });
      itemLinea++;
    });

    //Crear objeto con el numero de repeticiones con valor un array de las palabras que tengan el numero de repeticiones    
    var keys = Object.keys(rs);
    keys.forEach(k => {

      let val = hashmap.get(rs[k]);

      if(val === undefined){
        if(k.length>2){
          hashmap.set(rs[k], [k]);
        }

      }else{
        if(k.length>2){
          val.push(k);
          hashmap.set(rs[k], val);
        }
      }
      
    });

    
    rowLD.push(lines);
    let tweetsBYLines=[];
    for(var i = lines.length; i>0; i--){ 
      let words = hashmap.get(i); 
      if(words === undefined){
        continue;
      }
      if(i == 1){
        rowLD.push([]);
        rowLD.push(lines);
            

        let unics = [];
        for(var t = 0; t< ar.length; t++){   
          unics.push([]);
        }

        for(var x = 0; x< words.length; x++){
          let w = words[x];
          
          for(var t = 0; t< ar.length; t++){   

            let wd = w;
            if(ar[t].indexOf(w) > -1){
              unics[t].push(wd);
            }
          }          
        }
        tweetsBYLines = getTweetsBYLines(ar, lines, unics); 
        let maxWord = 0;

        for(var t = 0; t< unics.length; t++){
          if(maxWord <= unics[t].length){
            maxWord = unics[t].length
          }
        }
        for(var r = 0; r< maxWord; r++){
          rowLD.push([]);
          for(var t = 0; t< unics.length; t++){
            if(unics[t].length-1 >= t ){
              rowLD[rowLD.length-1].push(unics[t][r]);
            }else{
              rowLD[rowLD.length-1].push("");
            }
          }
          
        }

      }
      else
      {
        for(var x = 0; x< words.length; x++){

          rowLD.push([]);
          let itm = 0;
          let w = words[x];
          
          for(var t = 0; t< ar.length; t++){   

            let wd = w;
            if(ar[t].indexOf(w) > -1){
              rowLD[rowLD.length-1].push(wd);
            }else{
              rowLD[rowLD.length-1].push("");
            }
            
            itm++;
          }
          
        }
      }    
      
    }

    rowLD=[...rowLD,...tweetsBYLines];
  }


  function getTweetsBYLines(ar, lines, unics){
    let tweets = [];
    let group = [];
    let result = [];
    if(LdTweetsByCluster !== undefined){
      
      for(var l = 0; l< lines.length; l++){ 
        result.push([]);
        let words = unics[l];// hashmap.get(l+1);         
        if(words === undefined || words.length == 0){
          continue;
        }
        for(var x = 0; x< words.length; x++){
          
          let w = words[x].replace(/[,.?!¡¿;:*+-@"'#$%&/()=]/gi, "");                    

          if(ar[l].indexOf(w) > -1){
            let filter =[];
            LdTweetsByCluster["cluster"+(l+1)].filter(function (t) { 
              try{
                if(t !== undefined && t[1] !== undefined){
                  let exist = [];

                  exist = t[1].replace(/[,.?!¡¿;:*+-@"'#$%&/()=]/gi, "").split(" ").filter(function (f){
                    if(f.trim() == w.toLowerCase()){
                      return f;
                    }  
                  });
                   
                  if(exist.length > 0){
                    filter.push(t[0]); 
                  }
                }
              }catch(error){
                console.log(error);
                console.log(t);
                console.log(w);
              }
            });

            let news = [];
            if(filter.length > 0){

              for(var y = 0; y< filter.length; y++){
                if(result[l].length == 0){
                  news = filter;
                  break;
                }

                let exist = result[l].filter(function (r){
                  if(r == filter[y]){
                    return r;
                  }  
                });

                if(exist.length <= 0){
                    news.push(filter[y]); 
                  }

              }
            }
            result[l] = [...result[l],...news];
          }
                     
        }

      }

    }
    else if(contentFileLD.length > 0){
      let index = 0;

      for (var i = 0; i < contentFileLD[0].split(",").length; i++) {
        if(contentFileLD[0].toLowerCase().split(",")[i] == "hit sentence"){
            index = i;
            break;
        }
      }

      for (var i = 1; i < contentFileLD.length; i++) {
        tweets.push(contentFileLD[i].split(",")[index]);
      }      

      for(var l = 0; l< lines.length; l++){ 
        result.push([]);
        let words = unics[l];// hashmap.get(l+1);         
        if(words === undefined || words.length == 0){
          continue;
        }
        for(var x = 0; x< words.length; x++){
          
          let w = words[x].replace(/[,.?!¡¿;:*+-@"'#$%&/()=]/gi, "");                    

          if(ar[l].indexOf(w) > -1){
            let filter = tweets.filter(function (t) { 
              try{
                if(t !== undefined){
                  let exist = [];
                  exist = t.replace(/[,.?!¡¿;:*+-@"'#$%&/()=]/gi, "").split(" ").filter(function (f){
                    if(f.trim() == w.toLowerCase()){
                      return f;
                    }  
                  });
                   
                  if(exist.length > 0){
                    return t[0] 
                  }
                }
              }catch(error){
                console.log(error);
                console.log(t);
                console.log(w);
              }
            });
            
            let news = [];
            if(filter.length > 0){

              for(var y = 0; y< filter.length; y++){
                if(result[l].length == 0){
                  news = filter;
                  break;
                }

                let exist = result[l].filter(function (r){
                  if(r == filter[y]){
                    return r;
                  }  
                });

                if(exist.length <= 0){
                    news.push(filter[y]); 
                  }

              }
            }
            result[l] = [...result[l],...news];

          }
                     
        }

      }    

    }


    for (var i = 0; i < result.length; i++) {
      var hist = {};
      result[i].map( function (a) { if (a in hist) hist[a] ++; else hist[a] = 1; } );
      group.push([]);
      group.push(["Linea-"+(i+1)]);

      let sortable = Object.entries(hist)
          .sort(([,a],[,b]) => b-a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

      var keys = Object.keys(sortable);
      let nTweets = 1;
      keys.forEach(k => {
        if(nTweets <= 10){
          group.push([k,sortable[k]])
        }
        nTweets++;          
      });
      
      
    }
    console.log(group);

    return group;

  }

  
function getTweetsInCloster(dataUrl, name){
  var file = dataURLtoFile(dataUrl,name);

  var tweetsByCloster = [];    
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      console.log("onload: "+name);
      var hs = 0;
      var tl = 0;
      let rows = evt.target.result.split("\n");
      var cols = rows[0].split(",");

      for (var i = 0; i < cols.length; i++) {
        if(cols[i].toLowerCase() == "hit sentence"){
          hs = i;
        }else if(cols[i].toLowerCase() == "texto limpio"){
          tl = i;
        }  
      }

      
      for (var r = 1; r < rows.length; r++) {
        var cols = rows[r].split(',"');
        var cleanCol =[];
        if(cols.length > 1){
          for(var c = 0; c< cols.length; c++){   
          
            if(cols[c].split('\",').length > 1){ 
              let f = cols[c].split('\",')[0]; 
              
              cleanCol.push(f);
              cleanCol = [...cleanCol,...cols[c].split('\",')[1].split(',')];
            }else{
              cleanCol = [...cleanCol,...cols[c].split(',')];
            }
          }
        }else{
          cleanCol = rows[r].split(",");
        }

        tweetsByCloster.push([cleanCol[hs],cleanCol[tl]]);
      }
      //resolve(tweetsByCloster);
      console.log("onload finnished: "+name);
      
      LdTweetsByCluster[name]=tweetsByCloster
      resolve(tweetsByCloster);
      console.log("Tweets cargados!!!");
    }
    reader.onerror = function (evt) {
        console.log("error reading file");
        console.log("onload error: "+name);
        resolve(tweetsByCloster);
        reject(tweetsByCloster);
    }    
  });
}
  