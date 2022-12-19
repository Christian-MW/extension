loadSheet("Campaign");
console.log("Archivo campaign.js cargado!!!");
jQuery(document).ready(function() {
    getCampaign();
})

let requestCpUpdate ={}
function getCampaign(){
    console.log("Obteniendo la url para consultar las busquedas......");
    console.log(xpathUrl)
    url = xpathUrl["api_stream_search"][0]+xpathUrl["getSearchJson"][0];
    console.log(url);
    
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({"type": "campaña"}),
        headers: { 'Content-Type': 'application/json',  }
    })
    .then((response) => response.json())
    .then(function(responseCampañas){
        try{
            requestCpUpdate ={}
            console.log("responseCampañas");
            console.log(responseCampañas);
            $(".tblCampañas").find('tbody').html("");
            let dateNow = new Date();
            for (let i = 0; i < responseCampañas.length; i++) {
                let arrDt = responseCampañas[i].rules.startDate.split('/');
                let startDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));
                arrDt = responseCampañas[i].rules.endDate.split('/');
                let endDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));
                let theme = responseCampañas[i].theme;
                let sheet = responseCampañas[i].sheet;
                let start = responseCampañas[i].rules.startDate;
                let end = responseCampañas[i].rules.endDate;
                let btnUpdate = '';
                console.log("Fechas")
                console.log(dateNow)
                console.log(endDateObject)
                if(dateNow <= endDateObject)
                {
                    requestCpUpdate[theme]={
                        "campaign":theme,
                        "spreadsheet_id": responseCampañas[i].sheet,
                        "range":"Campañas",
                        "search":responseCampañas[i].search,
                        "date_start":start,
                        "date_end":end,
                        "update":"update"
                    }
                    btnUpdate='&nbsp;&nbsp;<button type="button" class="btn-success btnUpdateCP" name="'+theme+'">Actualizar</button>';
                    
                }
                $(".tblCampañas").find('tbody').append('<tr><td>'+theme+'</td><td><a href="https://docs.google.com/spreadsheets/d/'+sheet+'" target="blank">Ver</a>'+btnUpdate+'</td><td>'+start+'</td><td>'+end+'</td></tr>');
            }
            
        }catch(error){
            console.log(error);
        }        
    })
    .catch(function(error){
        console.log(error);
    });
}

function addCampaign(request){
    console.log("Agregano o actualizando campaña")
    console.log(request);
    url = xpathUrl["api_java_sheet"][0]+xpathUrl["addCampaign"][0];
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json',  }
    })
    .then((response) => response.json())
    .then(function(responseCampañas){
        try{
            alert("Campaña agregada o actualizada correctamente");
            console.log("responseCampañas");
            console.log(responseCampañas);
            console.log("Actualizando la lista");
            getCampaign();            
            clearCampaign();
                        
        }catch(error){
            console.log(error);
        }        
    })
    .catch(function(error){
        console.log(error);
        alert("Error al guardar la campaña intenta mas tarde");
    });
}

$(document).on('click','.btnUpdateCP', function(){
        let theme = $(this).attr('name');
        console.log("Click para actualizar una campaña")
        console.log(theme);
        console.log(requestCpUpdate[theme]); 
        addCampaign(requestCpUpdate[theme]) 
  }
 );

 let rqSaveCampaign = {
    "campaign":"",
    "spreadsheet_id": "",
    "range":"Campañas",
    "search":"",
    "date_start":"",
    "date_end":"",
    "update":"false"
}
 $("#cpstart").click(function(event){
    if(validateFormCp()){
        let dtNow = new Date();
        dtNow = new Date(dtNow.getFullYear(),dtNow.getMonth(),dtNow.getDate());
        let arrDt = rqSaveCampaign.date_start.split('/');
        let startDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));
        arrDt = rqSaveCampaign.date_end.split('/');
        let endDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));

        let _continue = true;
        if(dtNow > startDateObject){
            _continue = false;
            alert("La fecha de inicio no puede ser menor al dia en curso");
        }else if(startDateObject > endDateObject){
            _continue = false;
            alert("La fecha de termino no puede ser menor a la de inicio");
        }else if(dtNow > endDateObject){
            _continue = false;
            alert("La fecha de termino no puede ser menor al dia en curso");
        }else {
            console.log("Validando diferencia de dias");
            let diff = endDateObject.getTime() - startDateObject.getTime();
            console.log(diff);
            diff = diff/(1000*60*60*24);
            console.log(diff);
            let minday = parseInt(xpathUrl["min_day"][0]);
            let maxday = parseInt(xpathUrl["max_day"][0]);
            if(minday > diff ||  diff  > maxday){
                _continue = false;
                alert("La duración de la campaña debe ser entre 1 día y "+maxday+" días");
            }
        }

        if(_continue){
            if(!rqSaveCampaign.search.startsWith("(")){
                rqSaveCampaign.search = "("+rqSaveCampaign.search+")"
            }
            addCampaign(rqSaveCampaign);
        }
    }
 });

 function validateFormCp(){  
    let isOK = true;
    let inputs = document.querySelectorAll('.cp-input');
    for (let i = 0; i < inputs.length; i++) {
        console.log(inputs[i]);
        if(inputs[i].value == ""){
            isOK = false;
            break;
        }else{
            if(inputs[i].id == "cp_spreadsheet_id"){
                if(!inputs[i].value.startsWith("https://docs.google.com/spreadsheets/d/")){ 
                    document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google sheets";
                    isOK = false;
                    alert("Agrega una url de Google sheet valida");
                    break;
                }else{
                    let url = inputs[i].value.replace("https://docs.google.com/spreadsheets/d/","");
                    url = url.split('/')[0];
                    if(url == ""){
                        isOK = false;
                        alert("Agrega una url de Google sheet valida");
                        break;
                    }
                    rqSaveCampaign[inputs[i].id.replace("cp_","")] = url;
                }
            }else if(inputs[i].id == "cp_date_start" || inputs[i].id == "cp_date_end"){
                //"2022-12-15"
                let dt = inputs[i].value.split("-");
                //dd/mm/yyyy
                rqSaveCampaign[inputs[i].id.replace("cp_","")] = dt[2]+"/"+dt[1]+"/"+dt[0];
            }else{
                rqSaveCampaign[inputs[i].id.replace("cp_","")] = inputs[i].value;
            }
        }
    }
    return isOK;
  }

function clearCampaign(){
    let inputs = document.querySelectorAll('.cp-input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value="";
    }
    rqSaveCampaign = {
        "campaign":"",
        "spreadsheet_id": "",
        "range":"Campañas",
        "search":"",
        "date_start":"",
        "date_end":"",
        "update":"false"
    }
}

