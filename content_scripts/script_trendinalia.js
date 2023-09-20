console.log("Script inyectado!!!");
var urlConfig = "https://docs.google.com/spreadsheets/d/1yQ41kTP39D9y7Eh3pM7yDQyLxhI-5H6-3YjbgbfD98I/gviz/tq?&sheet=Trendinalia&tq=Select *"
var minutesInSeg = 20;
var seg = 0;
var xpaths =[];
var div_tabla_tt = "";
var file_tt = "";
var element_tt = "";

var post =[];


var timer = function (){
	seg++;
	console.log("Tiempo transcurrido "+seg+" segundos ");
		if(minutesInSeg < seg ){
			console.log("Regresando respuesta oir tiempo excedido......");
			console.log(JSON.stringify(post));
			chrome.runtime.sendMessage(null, JSON.stringify(post));
			
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

        div_tabla_tt = xpaths[0].items;
        file_tt = xpaths[1].items;
        element_tt = xpaths[2].items;

        console.log("###=> div_tabla_tt " + div_tabla_tt);
        console.log("###=> file_tt " + file_tt);
        console.log("###=> element_tt " + element_tt);
        
    }catch(error){
        console.log(error);
    }
}



if(document.title.includes("Not Found")){
	post =[];
	post.push(["0","Not Found",""]);
	console.log("Regresando respuesta");
	console.log(JSON.stringify(post));
	seg = minutesInSeg;
	chrome.runtime.sendMessage(null, JSON.stringify(post));	
	
}else{
	/******div_tabla_tt ******/
	waitForElm(div_tabla_tt)		
	.then((elm) => {		    
	    console.log('Tendencias cargadas!!!');
	    console.log(elm);
	    console.log("Validando que este cargado el div de la publicacin principal");
	    post =[];
	    getTendencia(elm);

	    console.log("Regresando respuesta");
		console.log(JSON.stringify(post));
		seg = minutesInSeg;
		chrome.runtime.sendMessage(null, JSON.stringify(post));	
		
	});
}




function waitForElm(selector) {

	console.log("Buscando el selector:");
	console.log(selector);
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
        	//console.log("return resolve(document.querySelector(selector): ");
        	//document.querySelector(selector)
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                console.log("resolve(document.querySelector(selector): ");
                console.log(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
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

function getTendencia(element){
	console.log("Obteniendo las tendencias.... de element");
	console.log(element);

	//Obteniendo la fila
	if(document.title.includes("Not Found")){
		post =[];
		post.push(["0","Not Found",""]);
	}else{
		post =[];
		/******file_tt ******/
		var row = element.querySelectorAll(file_tt);
		console.log(row);
		if(row !== null){
			for (var i = 0; i < row.length; i++) {
				/******element_tt ******/
				let col = row[i].querySelectorAll(element_tt);
				if(col !== null && col.length == 3) {
					post.push([col[0].textContent,col[1].textContent,col[2].textContent]);
				}

			}
			
		}
	}
  	console.log("Resultados:" + JSON.stringify(post));
}
