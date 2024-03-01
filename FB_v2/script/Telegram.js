var CHANNEL_ERROR = "-1002051644677";
var CHANNEL_INFO = "-1002051644677";


function SendMessage(message, channel) {
    let TELEGRAM_BOT_TOKEN = "6799451485:AAF-4CSsRkBK7tm2kpjTb4YIvWE34Pk18X4"
    //Canal Desarrollo
    
    
    let url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${channel}&text=${encodeURIComponent(message)}`;
    
    fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify("{}"),
        })
        .then((response) => response.json())
        .then(function(response){
        console.log(response);
        console.log("Mensaje enviado a telegram!!!");
        })
        .catch(function(error){
            console.log(error);
        });
    
}

function createMessageOnError(module,fn,parameters,response){
    let message = "Le ha ocurrido un error al usuario\n"+userInfo.email;
    if(module !== undefined && module !== ""){
        message+="\n\nModulo: \n"+module;
    }
    if(fn !== undefined && fn!== ""){
        message+="\n\nFunción:\n "+fn;
    }
    if(parameters !== undefined && parameters!== ""){
        message+="\n\nParametros:\n "+rq;
    }
    if(response !== undefined && response!== ""){
        message+="\n\nRespuesta:\n "+response;
    }
    return message;
}