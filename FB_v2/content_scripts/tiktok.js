'use strict';

setTimeout(function (){
    document.body.attributeStyleMap.set("zoom","80%");
    var urlConfig = "https://docs.google.com/spreadsheets/d/1yQ41kTP39D9y7Eh3pM7yDQyLxhI-5H6-3YjbgbfD98I/gviz/tq?&sheet=Tiktok&tq=Select *"
    var minutesInSeg = 10;
    var seg = 0;
    var xpaths =[];
    var likes = "",comments = "",shareds = "",favorites = "";

    var post =
    {  
        url:'', 
        likes: '',
        comments:'',
        shareds:'',
        favorites:'',
    }



    var timer = function (){
        seg++;
        console.log("Tiempo transcurrido "+seg+" segundos ");
        if(minutesInSeg < seg ){
            console.log("Regresando respuesta oir tiempo excedido......");

            console.log(JSON.stringify(post));
            chrome.runtime.sendMessage(null, "");
            
        }
        setTimeout(function(){ 
            if(minutesInSeg > seg ){
                timer();
            }
            
        }, 1000);
    }
    timer();


    function loadConfiguration(){
        $.ajax({
            async: false,
            type: 'GET',
            url: urlConfig,
            success: function(data) {
                console.log("########################___LoadConfiguration: ")
                getDataConfiguration(JSON.parse(data.substr(47).slice(0,-2)));
            }
        });
    }

    loadConfiguration();

    function getDataConfiguration(data){
		try{
			var rows = data.table.rows;
		
			for (var i = 0; i < rows.length; i++) {
				let r = rows[i]["c"];
				xpaths.push({                        
					them:r[0]["v"],
					items:r[1]["v"].split(',')
				});
			}
			console.log("###=> Xpaths: " + JSON.stringify(xpaths));
			console.log("###=> Xpaths.length: " + JSON.stringify(xpaths.length));

			likes = xpaths[0].items;
			comments = xpaths[1].items;
			shareds = xpaths[2].items;
			favorites = xpaths[3].items;
			
			console.log("###=> likes " + likes);
			console.log("###=> comments " + comments);
			console.log("###=> shareds " + shareds);
			console.log("###=> favorites " + favorites);
			
			post.likes = getReactions(likes);
            post.comments = getReactions(likes);
            post.favorites = getReactions(favorites);
            post.shareds = getReactions(shareds);
            
			chrome.runtime.sendMessage(null, JSON.stringify(post));
			
		}catch(error){
			console.log(error);
            chrome.runtime.sendMessage(null, "");
		}
	}

    function getReactions(arrayElement){
        console.log("getReactions*****************8");
        
        let result =0;
        //let arrayElement = element.split(',');

        for (let index = 0; index < arrayElement.length; index++) {
            try {
                let resultStr = document.querySelector(arrayElement[index]).innerText;
                if(resultStr.includes('K')){
                    //Miles
                    resultStr = resultStr.replace("K","");
                    result = parseFloat(resultStr)*1000;
                }
                else if(resultStr.includes('M')){
                    //Millones
                    resultStr = resultStr.replace("M","");
                    result = parseFloat(resultStr)*1000000;
                }
                else if(resultStr.includes('B')){
                    //Billones
                    resultStr = resultStr.replace("B","");
                    result = parseFloat(resultStr)*1000000000;
                }
            } catch (error) {
                console.log("Error al obtener el expath");
                console.log(error);
            }

            if(result!=''){
                break;
            }
        }

        return result;
    }

    

});
//me gusta
document.querySelector('[data-e2e="like-count"]').innerText;
//comentarios
document.querySelector('[data-e2e="comment-count"]').innerText;
//compartidos
document.querySelector('[data-e2e="share-count"]').innerText;
//favoritos
document.querySelector('[data-e2e="undefined-count"]').innerText;


