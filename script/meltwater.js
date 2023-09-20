'use strict';
console.log("Cargando archivo meltware");

var csvClasification =[];
var csvTraining =[];
var csvSQLLite =[];

// start navigation when #startNavigation button is clicked
mwstart.onclick = function(element) {
    // query the current tab to find its id
    console.log("Starting mwstart")
    listControlsExecuted = [];
    //element.target.hidden = true;
    document.getElementById(option+"lbState").innerHTML = "Procesando... ";
    switchBlock("process");

    if(urls_list.length > 0){    
        const sql = document.querySelector('#mwSql');
        dateTime = new Date().toLocaleString().substring(0,16).replace(",","");
        if(sql.checked){
            listControlsExecuted.push({control:"RB-SQL-LITE",module:"MELTWATER"});
            listControlsExecuted.push({control:"BTN-START",module:"MELTWATER"});
            saveLog();
            ReplaceComillaSimple();
            downloadToSQL("SQLLite_"+nameFileLoaded,csvSQLLite);  
            alert("Archivo procesado, el resultado lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory+"  \n Archivo: SQLLite_"+nameFileLoaded);
        }else{
            listControlsExecuted.push({control:"BTN-START",module:"MELTWATER"});
            saveLog();
            getRows();
            deleteRT();
                        
            download("Classification_"+nameFileLoaded,csvClasification);  
            download("Training_"+nameFileLoaded,csvTraining);                  
            alert("Archivo procesado, el resultado lo puedes consultar en tus descargas. \n\n Carpeta: "+dirBase+'/'+currentDirectory+"  \n Archivo de Entrenamiento: Training_"+nameFileLoaded+"  \n Archivo de Clasificación: Classification_"+nameFileLoaded);
        }
        csvClasification =[];
        csvTraining =[];  
        csvSQLLite =[];
        restart();
    }else{
        alert("No hay links para procesar!!!");
        restart();
    }

    
};

mwcancel.onclick = function(element) {
    // query the current tab to find its id
    restart();
    switchBlock("extencion");

};


function ReplaceComillaSimple(){
    for (var i = 0; i < urls_list.length; i++) {
        urls_list[i] = urls_list[i].replaceAll("'","\"");    
    }
    csvSQLLite = [...csvSQLLite,...urls_list];
}

function getRows(){
    urls_list.forEach(function(item) {
      let columns = item.split(/\t/);
      //Agregando comillas si existe una [,] en la columna 
      for (var i = 0; i < columns.length; i++) {
          if(columns[i].includes(",")){
            columns[i] = "\""+columns[i]+"\"";
        }
      }

      csvClasification.push(columns);
    });
}
//excluir los rt y twits duplicados
function deleteRT(){
    //RT        
    let index = 0;
   csvClasification.forEach(function(row){        
        //excluyendo los rt
        if(index == 0){
            //Agregando los encabezados
            csvTraining.push(["URL","Comentarios","Calificacion"]);
        }else
        {
            //Agregando los registros
            let isRT = false;
            if(row[4] !== undefined  && row[4] !== null && (row[4].startsWith("RT ") || row[4].startsWith("\"RT ") ||row[4].startsWith("QT ") || row[4].startsWith("\"QT "))){
                isRT = true;
            }
            if(!isRT){
                //Validando que el link no exista
                let exist = csvTraining.filter(function(r) {
                    return r[2] == row[2];
                });

                if(exist.length <= 0)
                    csvTraining.push([row[2],row[4],""]);
            }
        }

        index++;
   });

}