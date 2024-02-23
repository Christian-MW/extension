let isGet = true;
let sm = document.querySelectorAll('*[submodule]');
let m = document.querySelectorAll('*[module]');
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
        isGet = false;
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
        if(resp.code == 200 && resp.message=="OK"){
            let name = users.filter((u) => u["Correo"]==userInfo.email);
            let message = "<b>"+name[0].Usuario+"</b> tienes <b>"+resp.days+"</b> días de vacaciones";
            document.getElementById("numberdvd").innerHTML=message;
        }else{
            document.getElementById("numberdvd").innerHTML="Hay un problema con el servicio favor de reportarlo a Tecnologia";
        }
        
        
     })
     .catch(function(error){
        console.log(error);   
        document.getElementById("numberdvd").innerHTML="Hay un problema con el servicio favor de reportarlo a Tecnologia";
     });
}
