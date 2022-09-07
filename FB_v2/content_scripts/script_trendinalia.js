console.log("Script inyectado!!!");
var minutesInSeg = 20;
var seg = 0;


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

if(document.title.includes("Not Found")){
	post =[];
	post.push(["0","Not Found",""]);
	console.log("Regresando respuesta");
	console.log(JSON.stringify(post));
	seg = minutesInSeg;
	chrome.runtime.sendMessage(null, JSON.stringify(post));	
	
}else{

	waitForElm('table.zebra-striped')		
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
		var row = element.querySelectorAll("tbody tr");
		console.log(row);
		if(row !== null){
			for (var i = 0; i < row.length; i++) {

				let col = row[i].querySelectorAll('td');
				if(col !== null && col.length == 3) {
					post.push([col[0].textContent,col[1].textContent,col[2].textContent]);
				}

			}
			
		}
	}
  	console.log("Resultados:" + JSON.stringify(post));
}
