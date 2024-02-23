jQuery(document).ready(function() {
loadConfigurationSheet("Modulos")
.then(function(result){
    modules=result;
    console.log("Modulos");
    console.log(modules);
    loadConfigurationSheet("Usuarios")
    .then(function(result){
        users=result;        
        console.log("Usuarios");
        console.log(users);
        /*
        loadConfigurationSheet("Disponibilidad de días")
        .then(function(result){
            userDVD=result;        
            console.log("Disponibilidad de días");
            console.log(userDVD);
        })
        .catch((error) => {
            console.log(error)
        });
        */
    })
    .catch((error) => {
        console.log(error)
      });
})
.catch((error) => {
    console.log(error)
  });


 function loadConfigurationSheet(sheetN){
    let urlSheetBase = urlComunidades;
    if(sheetN == "Comunidades"){
        urlSheetBase = urlComunidadesMeta;
    }
    else if(sheetN == "Disponibilidad de días"){
        urlSheetBase = "https://docs.google.com/spreadsheets/d/"+xpathUrl["spreadsheet_vacations"][0]+"/gviz/tq?&sheet={{sheetN}}&tq=Select *";
    }
    console.log("Obteniendo las variables de la hoja "+urlSheetBase.replace("{{sheetN}}",sheetN));

    return new Promise((resolve, reject)=>{

        $.ajax({
            async: false,
            type: 'GET',
            url: urlSheetBase.replace("{{sheetN}}",sheetN),
            success: function(data) {
              console.log("loadSheet: "+ sheetN)
              resolve(getDataSheetConfiguration(JSON.parse(data.substr(47).slice(0,-2))));
         
            },
            error: function (error) {
                reject(error)
            },
       });

    })
   

  }

  function getDataSheetConfiguration(data){
    let result = [];
    try{
        console.log("getDataSheetConfiguration");
        console.log(data);
        let c = [];
        let cols = data.table.cols;
        for (var i = 0; i < cols.length; i++) {
            if(cols[i].label =="" || cols[i].label === ""){
                break;
            }else{
                c.push({"v":cols[i].label});
            }
        }
        console.log("Se encontraron columnas definidas?");
        console.log(c);

        let rows = data.table.rows;
        let addR = false;
        for (var i = 0; i < rows.length; i++) {
            try {
                if(i == 0 && c.length == 0){
                    c = rows[i]["c"];                    
                }else if(c.length >0){
                    addR = true;
                }
                if(addR){
                    let r = rows[i]["c"];
                    let obj={};
                    //console.log(r);
                    for (let cindex = 0; cindex < r.length; cindex++) {
                        try {
                            obj[c[cindex]["v"]]=(r[cindex]["v"]).toString();    
                        } catch (error) {
                            obj[c[cindex]["v"]]="";
                        }
                        
                    }
                    result.push(obj);
                }
                
            } catch (error) {
                console.log(error);
            }
        }
  
    }catch(error){
        console.log("ERROR en ==> "+getDataSheetConfiguration)
        console.log(error);
    }
    
    
    console.log(result);
    return result;
  }


})