
getRanking()

$("#rkstart").click(function(event){
    $("#cpstart").hide();
    $("#cp-description").show();
    $("#cp-description").html("<h4>Validando datos....</h4>");

    let sheetid = $("#rk_spreadsheet_id").val();
    if(sheetid != "" && sheetid.startsWith("https://docs.google.com/spreadsheets/d/")){
        sheetid = sheetid.replace("https://docs.google.com/spreadsheets/d/","");
        sheetid = sheetid.split('/')[0];
        $("#rkstart").hide();
        let url = xpathUrl["api_java_sheet"][0]+xpathUrl["addRanking"][0];
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({spreadsheet_id:sheetid}),
            headers: { 'Content-Type': 'application/json',  }
        })
        .then((resp) => resp.json())
        .then(function(resp){ 
            console.log(resp);
            try {

                if(resp.code == 200 || resp.code == 0){     
                    document.getElementById(option+"description").innerHTML = "Ranking guardado";         
                    alert("Ranking guardado");
                    clearRanking();
                    getRanking();

                }else if(resp.code == 409){
                    document.getElementById(option+"LinkProcess").innerHTML = "El archivo sheet tiene inconsitencia en la información";
                    alert("El archivo sheet tiene inconsitencia en la información");
                    clearRanking();
                }
                else if(resp.code == 500){
                    document.getElementById(option+"LinkProcess").innerHTML = "Problemas al guardar el ranking";
                    alert("Problemas al guardar el ranking");
                    clearRanking();
                }

            } catch (error) {
                document.getElementById(option+"LinkProcess").innerHTML = "Problemas al guardar el ranking";
                alert("Problemas al guardar el ranking");
                clearRanking
            }
        })        
        .catch(function(error){
            console.log(error);          
            document.getElementById(option+"LinkProcess").innerHTML = "Problemas al obtener las publicaciones";
            alert("Problemas al obtener las publicaciones");
            clearRanking();
        });

    }else{
        document.getElementById(option+"LinkProcess").innerHTML = "Ingresa una url valida de google sheets";
        alert("Ingresa una url valida de google sheets");
        clearRanking();
    }
})

function getRanking(){
    console.log("Obteniendo la url para consultar las busquedas......");
    console.log(xpathUrl)
    url = "http://3.138.108.174:9091/apolo/api/category/get";
    console.log(url);
    
    fetch(url, {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json',  }
    })
    .then((response) => response.json())
    .then(function(responseRanking){
        try{
            requestCpUpdate ={}
            console.log("responseRanking");
            console.log(responseRanking); 
            $(".tblRanking").find('tbody').html("");
            let siteRanking = xpathUrl["siteRanking"][0]
            console.log("siteRanking: "+siteRanking);
            for (let i = 0; i < responseRanking.result.length; i++) {

                $(".tblRanking").find('tbody').append('<tr><td>'+responseRanking.result[i].name+'</td><td><a href="'+siteRanking+'?'+responseRanking.result[i].id+'" target="blank">Ver</a></td></tr>');
                
            }
            //DataRanking = responseRanking;
            //renderizarPaggerRk();

        }catch(error){
            console.log(error);
        }        
    })
    .catch(function(error){
        console.log(error);
    });
}

function clearRanking(){
    let inputs = document.querySelectorAll('.rk-input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value="";
    }
    $("#rkstart").show();    
    $("#rk-description").hide();
    $("#rk-description").html(""); 
}