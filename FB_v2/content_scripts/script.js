
var minutesInSeg = 10;
var seg = 0;


//sleep(sleepSeconds);
let page_title = document.title,
	page_html_tag = '';


page_html_tag = document.documentElement.innerText;

var retry = new observable(0);
var classPost =null;
var iterateNext;
let querySelector;

console.log("Iniciando el script.....");

//console.log(target);

var post =
	{ 
		PostName: document.title.replace(/,/g,""), 
		url:'', 
		date:"", 
		likes: 'N/A',
		comments:'N/A',
		shared:'N/A',
		reproductions:'N/A',
		timeElapsed:'',
		details:''
	}


var timer = function (){
	seg++;
	console.log("Tiempo transcurrido "+seg+" segundos ");
		if(minutesInSeg < seg ){
			console.log("Regresando respuesta oir tiempo excedido......");
			post.timeElapsed = 'Tiempo transcurrido '+seg+' segundo(s)';
			post.details='Tiempo de espera excedido';

			if(document.documentElement.innerText.includes("contenido no está disponible en este momento")){
				//Link roto
				post.details = "Link roto [Este contenido no está disponible en este momento]";
				console.log("Regresando respuesta");
				post.timeElapsed ='Tiempo transcurrido '+seg+' segundo(s)';
				post.likes="N/A";
				post.comments="N/A";
				post.shared="N/A";
				post.reproductions='N/A';
			}			
			else if(document.documentElement.innerText.includes("Grupo privado") || document.documentElement.innerText.includes("Grupo - Privada")){
				//Link de un grupo privado
				post.details = "Link de un grupo y no tiene titulo [Link privado]";
				post.likes="GP";
				post.comments="GP";
				post.shared="GP";	
				post.reproductions='GP';			
			}

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




function waitForElm(selector) {

	console.log("Buscando el selector:");
	console.log(selector);
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
        	//console.log("return resolve(document.querySelector(selector): ");
        	//document.querySelector(selector)
        	//getReactions(document.querySelector(selector));
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


var t = page_title.split(" | ");

if(document.documentElement.innerText.includes("contenido no está disponible en este momento")){
	//Link roto
	post.details = "Link roto [Este contenido no está disponible en este momento]";
	console.log("Regresando respuesta");
	post.timeElapsed ='Tiempo transcurrido '+seg+' segundo(s)';
	post.likes="N/A";
	post.comments="N/A";
	post.shared="N/A";
	post.reproductions='N/A';
	console.log(JSON.stringify(post));
	chrome.runtime.sendMessage(null, JSON.stringify(post));
}else{
	let href = window.location.href;
	if(document.documentElement.innerText.includes("Grupo privado") || document.documentElement.innerText.includes("Grupo - Privada")){
		//Link de un grupo privado
		post.details = "Link de un grupo y no tiene titulo [Link privado]";
		post.likes="GP";
		post.comments="GP";
		post.shared="GP";
		post.reproductions='GP';
		console.log("Regresando respuesta");
		console.log(JSON.stringify(post));
		chrome.runtime.sendMessage(null, JSON.stringify(post));
	}else{
		//Link publico
		post.likes="0";
		post.comments="0";
		post.shared="0";
		post.reproductions='0';
	
		/*
		Reacciones
		Publicas: div.tpvapw4o.j0k7ypqs
		Grupos: div.tpvapw4o.j0k7ypqs
		*/

		waitForElm('div.tpvapw4o.j0k7ypqs, div.ramewbz7.k1z55t6l.cgu29s5g.jl2a5g8c.alzwoclg.pbevjfx6.i85zmo3j')		
		.then((elm) => {		    
		    console.log('Reacciones cargadas!!!');
		    console.log(elm);
		    console.log("Validando que este cargado el div de la publicacin principal");

		    /*
				contenedor de plublicaciones
				Publica:div gvxzyvdx r6ydv39a imjq5d63 flv4y0wt cbwvpmhb
				Grupos: div.g4tp4svg.mfclru0v.om3e55n1.p8bdhjjv
				Privada: //div[@class='km253p1d']
				Link Roto: //div[@class='alzwoclg cqf1kptm ktovzxj4 g1smwn4j']
				watch: div.mfclru0v.h4m39qi9.pytsy3co
					   //DIV[@CLASS="anf3k8p9 r26s8xbz gug11x0k"]
					   //div[@class="z6erz7xo bdao358l on4d8346 s8sjc6am myo4itp8 ekq1a7f9 fsf7x5fv"]
					   //div[@class="alzwoclg cqf1kptm q367e8p0 a6oyxcnl"]

		    */
		    let xpath = "div.gvxzyvdx.r6ydv39a.imjq5d63.flv4y0wt.cbwvpmhb, "+
		    "div.rq0escxv.l9j0dhe7.du4w35lb.hpfvmrgz.g5gj957u.aov4n071.oi9244e8.bi6gxh9e.h676nmdw.aghb5jc5.gile2uim.pwa15fzy.fhuww2h9, "+
		    "div.qublvx3c.oh7imozk.cbu4d94t.j83agx80.bp9cbjyn, "+
		    "div.du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0, "+
		    "div.d2edcug0.tr9rh885.oh7imozk.abvwweq7.ejjq64ki, "+
		    "div.g4tp4svg.mfclru0v.om3e55n1.p8bdhjjv, "+
		    "div.alzwoclg.cqf1kptm.ktovzxj4.g1smwn4j, "+
		    "div.mfclru0v.h4m39qi9.pytsy3co, "+
		    "div.anf3k8p9.r26s8xbz.gug11x0k, "+
		    "div.z6erz7xo.bdao358l.on4d8346.s8sjc6am.myo4itp8.ekq1a7f9.fsf7x5fv, "+
		    "div.alzwoclg.cqf1kptm.q367e8p0.a6oyxcnl";
		    waitForElm(xpath)
		    .then((elm) => {
		    	console.log('Contendor cargado!!!');

			    getReactions(elm);

				if(document.documentElement.innerText.includes("contenido no está disponible en este momento")){
					//Link roto
					post.details = "Link roto [Este contenido no está disponible en este momento]";
					post.timeElapsed ='Tiempo transcurrido '+seg+' segundo(s)';
					post.likes="N/A";
					post.comments="N/A";
					post.shared="N/A";
					post.reproductions='N/A';
				}			
				else if(document.documentElement.innerText.includes("Grupo privado") || document.documentElement.innerText.includes("Grupo - Privada")){
					//Link de un grupo privado
					post.details = "Link de un grupo y no tiene titulo [Link privado]";
					post.likes="GP";
					post.comments="GP";
					post.shared="GP";
					post.reproductions='GP';
				}

			    console.log("Regresando respuesta");
			    post.timeElapsed='Tiempo transcurrido '+seg+' segundo(s)';
				console.log(JSON.stringify(post));
				chrome.runtime.sendMessage(null, JSON.stringify(post));

				seg = minutesInSeg;
			});


		});
	}
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

function getReactions(element){
	console.log("Obteniendo las reacciones.... de querySelector");
	console.log(querySelector);

	//Extraccion de los likes
	
	let lk = element.querySelector('span.f7rl1if4.adechonz.f6oz4yja.dahkl6ri.axrg9lpx.rufpak1n.qtovjlwq.qbmienfq.rfyhaz4c.rdmi1yqr.ohrdq8us.nswx41af.fawcizw8.l1aqi3e3.sdu1flz4');

	//console.log(lk.textContent);
	if(lk !== null && lk.textContent != "" && !lk.textContent.includes(' d') && !lk.textContent.includes(' las')){

		console.log("LIKES: " + lk.textContent);
		if(lk.textContent.match(/^\d/)){
			post.likes = lk.textContent.replace(",",".").replace(/&nbsp;/g, ' ');
		}
	}else{
		lk= null;
		let spanLk =element.querySelectorAll('span.nnzkd6d7');
		spanLk.forEach(function(spn) {
			console.log(spn.textContent);
		  if(!spn.textContent.includes(' d') && !spn.textContent.includes(' las')){
		  	lk = spn;
		  }
		});

		//console.log(lk);
		if(lk !== null && lk.textContent != "" ){
			console.log("LIKES: " + lk.textContent);
			if(lk.textContent.match(/^\d/)){
				post.likes = lk.textContent.replace(",",".").replace(/&nbsp;/g, ' ');
			}
		}else{
			lk= null;
			let spanLk =element.querySelectorAll('span.f7rl1if4.adechonz.f6oz4yja.dahkl6ri.axrg9lpx.rufpak1n.qtovjlwq.qbmienfq.rfyhaz4c.rdmi1yqr.ohrdq8us.nswx41af.fawcizw8.l1aqi3e3.sdu1flz4');
			console.log("Likes video");
			for (var s = 0; s < spanLk.length; s++) {
				let spn = spanLk[s];
			  console.log(spn.textContent);
			  if(!spn.textContent.includes(' d') && !spn.textContent.includes(' las') && !spn.textContent.includes(' rep') && spn.textContent != ""){
			  	lk = spn;
			  	console.log("LIKES: " + lk.textContent);
				if(lk.textContent.match(/^\d/)){
					post.likes = lk.textContent.replace(",",".").replace(/&nbsp;/g, ' ');
				}
				break;
			  }
			}
		}
	}

	
	
	//Extraccion de los compartidos
	let shared = Array.prototype.slice.call(element.querySelectorAll('span')).filter(function (el) {
    	return el.textContent.includes('vez compartid');
  	});
  	console.log(shared);
  	if(shared.length > 0){
  		if(shared[0].textContent.match(/^\d/)){
			post.shared = shared[0].textContent.replace(",",".").replace("vez compartido","").replace("vez compartida","").replace(/&nbsp;/g, ' ');
		}  		
  	}
  	else{
  		shared = Array.prototype.slice.call(element.querySelectorAll('span')).filter(function (el) {
	    	return el.textContent.includes('veces compartid');
	  	});
	  	console.log(shared);
	  	if(shared.length > 0){
	  		if(shared[0].textContent.match(/^\d/)){
				post.shared = shared[0].textContent.replace(",",".").replace("veces compartida","").replace("veces compartido","").replace(/&nbsp;/g, ' ');
			} 
  			
  		}
  	}
  	//Extraccion del comentario
  	let comments = Array.prototype.slice.call(element.querySelectorAll('span')).filter(function (el) {
    	return el.textContent.includes('comentario');
  	});
	console.log(shared);
  	if(comments.length > 0){
  		if(comments[0].textContent.match(/^\d/)){
			post.comments = comments[0].textContent.replace(",",".").replace("comentarios","").replace("comentario","").replace(/&nbsp;/g, ' ');
		}   			
  	}

  		//Extraccion de reproducciones
	let reproducc = Array.prototype.slice.call(element.querySelectorAll('span')).filter(function (el) {
    	return el.textContent.includes(' reproducc');
  	});
  	console.log(reproducc);
  	if(reproducc.length > 0){
  		if(reproducc[0].textContent.match(/^\d/)){
			post.reproductions = reproducc[0].textContent.replace(",",".").replace("reproducciones","").replace("reproducción","").replace("reproduccion","").replace(/&nbsp;/g, ' ');
		}  		
  	}

  	console.log("Resultados:" + JSON.stringify(post));
}
