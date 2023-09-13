'use strict';
var csvClasification =[];
var isXlsx = false;
let jsonFile=[];
let columns =[];
$("#dbUrlC").html('La Base la puedes ver: <a href="'+urlDB+'" target="_blank">aquí</a>');  
jQuery(document).ready(function() {
    /*
    let abc = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    var select = document.getElementById('columns');
  
    for (var i = 0; i<abc.length; i++){
          var opt = document.createElement('option');
          opt.value = i;
          opt.innerHTML = abc[i];
          select.appendChild(opt);      
    }
    */

    document.getElementById('cl-file-selector').addEventListener('change', handleFileSelect, false);

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
            
          }
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


  $(document).on(('click','change'), function(e) { 
    var container = $(".cl-evaluation-check");
    if (!$(e.target).closest(container).length) {
      const checks = document.querySelectorAll('.badgebox');
      for (let i = 0; i < checks.length; i++) {
        try{         


            if(checks[i].checked){
                let add = true;
                for (var s = 0; s < themsEval.length; s++) {
                  if(themsEval[s].desc == checks[i].id){
                    add = false;
                    break;
                  }
                }

                if(add){
                    for (var l = 0; l < arrThems.length; l++) {
                        if(arrThems[l].desc == checks[i].id){
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

$("#clstart").click(function(event){
    console.log("Starting clstart");
    $(".cl-contairner-process").show();
    $("#clstart").hide();   
    listControlsExecuted = [];
    document.getElementById(option+"lbState").innerHTML = "Clasificando";

    window.setTimeout(function(){

      
    
    let col  = $("#columns").val();
    if(jsonFile.length > 0){   
      
  
  
        /*
        let obj = jsonFile[0]; 
        */
        let co = document.getElementById("columns").value;;
        
        if(co !== undefined && co != ""){
            if(themsEval.length > 0){
                    
                for (var s = 0; s < themsEval.length; s++) {
                    
                    let sh = themsEval[s];
                    console.log("Obteniendo el contenido de la Hoja "+ sh.desc);
                    listControlsExecuted.push({control:"CHK-"+sh.desc.toUpperCase(),module:"CLASIFICADOR"});
                    document.getElementById(option+"LinkProcess").innerHTML = "Obteniendo  "+sh.desc;
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
                
                listControlsExecuted.push({control:"BTN-START",module:"CLASIFICADOR"});
                saveLog();

                document.getElementById(option+"LinkProcess").innerHTML = "Clasificando los items";
                jsonFile = clasificador(jsonFile, themsEval,co);

                var date = new Date();
                stringDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

                console.log("Listo para descargar");
                wb = XLSX.utils.book_new();    
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
                addSheet("Tendencias", data);
                downloadBook("Clasificación_"+stringDate);
                alert("Se han procesado las fechas ingesadas, el resultado lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory+"  \n Archivo: Clasificación_"+stringDate+".xlsx");
               
                $("#clstart").show();
                document.getElementById(option+"lbState").innerHTML = "";
                document.getElementById(option+"LinkProcess").innerHTML = "";
            }
        }
    
      }
    }, 100);
});

