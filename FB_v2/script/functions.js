'use strict';
console.log("Cargando archivo functions");
var pathname ="";
var option="";
var domain ="https://";
var dirBase="mw_group_extension";
var currentDirectory="";

let dateTime = "";
let nameFileLoaded = "";
let myTimeout;
let contentCSVLoaded ="";

var urlBase="http://3.129.70.158:8100/V1/api";


let mapOption={fb:"Facebook", mw:"Meltwater", xp:"MWGroup", tr:"Trendinalia"}

console.log("Archivo dunctions");
pathname = window.location.pathname.slice(1).replace("popup.html","").replaceAll("/","\\");
console.log(pathname);
console.log(window.location.host);



/*FUNCIONES GENERALES*/

function loadFile(idFileS){
    let idFileSelector = idFileS
    console.log("funcion loadFile()");
    console.log(idFileS);

    const fileSelector = document.getElementById(idFileSelector);
    if(fileSelector !== null){
        fileSelector.addEventListener('change', (event) => {
            //console.log('enter change');
            const fileList = event.target.files;
            var fileName = fileList[0].name;
            console.log('fileName :' + fileName);
            switchBlock("action");
            var date = new Date();
            var stringDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
            nameFileLoaded = fileName.split(".")[0]+stringDate+".csv";

            readFile(fileList[0])
        });
    }

}


function pad2(n) { return n < 10 ? '0' + n : n }

function readFile(file) {
    console.log('enter readFile');
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            
            

            var content = evt.target.result;
            //log('content file ' +content);
            //envia la lista al worker
            //   sendMessageToBackground('_fileList', content);
            contentCSVLoaded = content;
            processFiles(content);
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
             if(urls_list.length > 0){
                document.getElementById(option.replace("-","")+"start").style.display = "block";
                document.getElementById(option+"description").innerHTML="";
            }else{
                document.getElementById(option.replace("-","")+"start").style.display = "none";
                document.getElementById(option+"description").innerHTML="El archivo no cuenta con links para procesar";
                
            }
        }
    }
}

function getContentFile(file) {
    console.log('enter getContentFile');
    let ctn = [];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {            
            var content = evt.target.result;
            ctn = content;
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    }

    return ctn;
}

function processFiles(fileList) {
    urls_list = fileList.split(/\r?\n/);
    if(urls_list.length > 0){
        document.getElementById(option.replace("-","")+"start").style.display = "block";
        document.getElementById(option+"description").innerHTML="";
    }else{
        document.getElementById(option.replace("-","")+"start").style.display = "none";
        document.getElementById(option+"description").innerHTML="El archivo no cuenta con links para procesar";
        
    }

}

function download(){
    
    var rows = urls_processed.map(e => e.join(",")).join("\n");
    let blob = new Blob([rows], {type: "data:text/csv;charset=utf-8"});
    let objectURL = LURL.createObjectUR(blob);

    chrome.downloads.download({ url: objectURL, filename: (dirBase+'/'+currentDirectory+'/' + nameFileLoaded), conflictAction: 'overwrite' });
    document.getElementById(option+"description").innerHTML="";
}

function downloadToSQL(nameParent,content){
    var rows = content.map(e => e).join("\n");          
    let blob = new Blob([rows], {type: "data:text/csv;charset=utf-8"});
    let objectURL = URL.createObjectURL(blob);

    chrome.downloads.download({ url: objectURL, filename: (dirBase+'/'+currentDirectory+'/'+ nameParent), conflictAction: 'overwrite' });
    document.getElementById(option+"description").innerHTML="";
}

function download(nameParent,content){
    var rows = content.map(e => e.join(",")).join("\n");          
    let blob = new Blob([rows], {type: "data:text/csv;charset=utf-8"});
    let objectURL = URL.createObjectURL(blob);

    //chrome.downloads.download({ url: objectURL, filename: (dirBase+'/'+currentDirectory+'/'+ nameParent + nameFileLoaded), conflictAction: 'overwrite' });
    chrome.downloads.download({ url: objectURL, filename: (dirBase+'/'+currentDirectory+'/'+ nameParent), conflictAction: 'overwrite' });
    document.getElementById(option+"description").innerHTML="";
}

function downloadImg(name, base){
    
    chrome.downloads.download({ url: base, filename: (dirBase+'/'+currentDirectory+'/' + name), conflictAction: 'overwrite' });    
}

function hiddenProcess(){    
    let collection = document.getElementsByClassName("process");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.display = "none";
    }
    
}


function showProcess(evt){
    console.log(evt);
    hiddenProcess();
    if(option!=""){
        switch(option) {
          case "xp-":
            // code block
            clearMwgroup();
            break;
          case "tr-":
            // code block
            clearMwgroup();
            break;
          default:
            // code block
            restart();
        }

    }

    option = evt.target.id;
    currentDirectory = mapOption[option.replace("-","")];
    console.log(currentDirectory);
     switch(option) {
          case "xp-":
            // code block
            clearMwgroup();
            break;
          case "tr-":
            // code block
            clearTrendinalia();
            break;
          default:
            // code block
            restart();
            loadFile(option+"file-selector");
        }

    
    const containers = document.getElementsByClassName(evt.target.id);
    for (let i = 0; i < containers.length; i++) {
        containers[i].style.display = "block";
    }

    const collection = document.getElementsByClassName("list-inline-item");
    for (let i = 0; i < collection.length; i++) {
        collection[i].classList.remove("active");
    }

    evt.target.classList.add("active");

    switchBlock("extencion");
}

const li = document.querySelectorAll('li.list-inline-item');
console.log(li);

for (let x = 0; x < li.length; x++) {
        li[x].addEventListener('click' , showProcess , false ) ; 
    }



function timer (){ 

    console.log("Tiempo transcurrido "+seg+" segundos ");
    console.log("minutesInSeg "+minutesInSeg);
        if(minutesInSeg <= seg ){
            /*
            var row =["", currentUrl, dateTime, "N/A", "N/A", "N/A","No se pudo obtener información del link y se tuvo que interrumpir el proceso por exceder el tiempo."];
            urls_processed.push(row);
            */
            chrome.runtime.onMessage.removeListener();
            switch(option) {
              case "xp-":
                // code block
                flag.setValue(0);
                break;
              case "tr-":
                // code block
                flagTr.setValue(0);
                break;
              default:
                // code block
            }
            
            clearTimeout(myTimeout);
        }else if(seg >=0 ){
            seg++;
            myTimeout = setTimeout(timer,1000);
        }
}

function restart(){
    console.log("Reiniciando variables.....");
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
    //document.getElementById(option.replace("-","")+"start").style.display = "none";
    try{
        document.getElementById(option+"description").innerHTML="";
        document.getElementById(option+"file-selector").value = "";
    }catch(error){
        console.log(error);
    }
    console.log("Finalizando el timeout");
    clearTimeout(myTimeout);
    switchBlock("extencion");
}

function observable(v){
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
function observableTr(v){
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

function switchBlock(block){
    console.log("switchBlock...  => "+block);
    try{
        document.getElementById(option.replace("-","")+"start").style.display = "block";
    }catch(error){
        console.log(switchBlock);
        console.log(error);
    }
    
    let cactions = document.getElementsByClassName(option+"contairner-actions");
    for (let i = 0; i < cactions.length; i++) {
        cactions[i].style.display = "none";
    }
    let cprocess = document.getElementsByClassName(option+"contairner-process");
    for (let i = 0; i < cprocess.length; i++) {
        cprocess[i].style.display = "none";
    }
    let cextensions = document.getElementsByClassName("contairner-extensions");
    for (let i = 0; i < cextensions.length; i++) {
        cextensions[i].style.display = "none";
    }
    let ceval = document.getElementsByClassName(option+"evaluation-action");
    for (let i = 0; i < ceval.length; i++) {
        ceval[i].style.display = "none";
    }

    if(block =="action"){
        //mostrar el bloque de los botones de acción
         for (let i = 0; i < cactions.length; i++) {
            cactions[i].style.display = "block";
        }
    }else if(block=="extencion"){
        //mostrar el bloque de los botones de las extensiones
         for (let i = 0; i < cextensions.length; i++) {
            cextensions[i].style.display = "block";
        }
    }
    else{
        //mostrar el bloque del proceso cuando se da click en start
         for (let i = 0; i < cprocess.length; i++) {
            cprocess[i].style.display = "block";
        }
    }
}

function hashCode(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

 function dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

function clearText(txt){
    try{
        txt = txt.toLowerCase().replaceAll('á','a').replaceAll('é','e').replaceAll('í','i').replaceAll('ó','o').replaceAll('ú','u')
        .replaceAll(/[,-;+.:_*/!¡'$%&=?¿<>|"]/g, "");
    }catch(error){
        console.log(error);
    }
    return txt;
}

/*INVOCACION DE FUNCIONES INICIALES*/
hiddenProcess();









/*
const sheetID = '1k4r9mTcIl5FAsSCV7jNeIqXpcxuI-FvxHdIYJjOmDvg';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = 'Percepción';
const query = encodeURIComponent('Select *');
const url = base+'&sheet='+sheetName+'&tq='+query;
const data = [];
document.addEventListener('DOMContentLoaded',init);
 
function init(){
    console.log('ready');
    fetch(url)
    .then(res => res.text())
    .then(rep => {
        //console.log(rep);
        console.log("Charriskis");
        console.log("rep ==> "+rep);
        const jsData = JSON.parse(rep.substr(47).slice(0,-2));
        console.log(jsData);
        const colz = [];
        jsData.table.cols.forEach((heading)=>{
            if(heading.label) {
            colz.push(heading.label.toLowerCase().replace(/\s/g,''));x
            }
        })
        jsData.table.rows.forEach((main)=>{
            //console.log(main);
            const row = {};
            colz.forEach((ele,ind)=>{
                //console.log(ele);
                row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
            })
            data.push(row);
        })
        console.log("data ==> "+data);
    });
}

*/