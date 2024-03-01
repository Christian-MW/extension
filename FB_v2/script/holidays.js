let isGet = true;
$(sm).click(function(e){
    $('#numberdvd').hide();
})
$(m).click(function(e){
    $('#numberdvd').hide();
})
$("#dvd-").click(function(e){ 
    if(isGet){
        $('#numberdvd').show();
        document.getElementById("numberdvd").innerHTML="<h3>Consultando...</h3>";
        listControlsExecuted=[];
        listControlsExecuted.push({control:"BTN-START",module:"Días de vacaciones disponibles"});
        saveLog();
        getHolidays();
        //isGet = false;
    }else{
        isGet = true;
        $('#numberdvd').hide();
        
    }
    
});

function getHolidays(){
    
    let rq = {
        "email": userLog.email,
        "spreadsheet_id":xpathUrl["spreadsheet_vacations"][0]
    }
    
    let urlApiSheet = xpathUrl["api_java_sheet"][0]
    let endponit = xpathUrl["holidays_days"][0];
    fetch(urlApiSheet+endponit, {
        method: 'POST',
        body: JSON.stringify(rq),
        headers: { 'Content-Type': 'application/json',  }
     })
     .then((resp) => resp.json())
     .then(function(resp){ 
        console.log("getHolidays response");
        console.log(resp);
        try {
            if(resp.code == 200 && resp.message=="OK"){
                let name = users.filter((u) => u["Correo"]==userInfo.email);
                let message ="";
                if(resp.days > 0){
                    let dt = resp.endDate.split("-");
                     message = "<b>"+name[0].Usuario+"</b> tienes <b>"+resp.availableDays+"</b> días de vacaciones, usalos antes del "
                     +dt[0]+" de "+MONTHS[parseInt(dt[1]).toString()]+" del "+dt[2];
                }else{
                    message = "<b>"+name[0].Usuario+"</b> ya no tienes días de vacaciones disponibles";
                }
                
                document.getElementById("numberdvd").innerHTML=message;
            }else{
                document.getElementById("numberdvd").innerHTML="Hay un problema con el servicio favor de intentar más tarde";
            }
        } catch (error) {
            document.getElementById("numberdvd").innerHTML="Hay un problema con el servicio favor de intentar más tarde";
            SendMessage("Mís días de vacaciones",urlApiSheet+endponit,JSON.stringify(rq),JSON.stringify(resp));                               
        }
        
        
        
     })
     .catch(function(error){
        console.log(error);   
        document.getElementById("numberdvd").innerHTML="Hay un problema con el servicio favor de reportarlo a Tecnologia";
     });
}
