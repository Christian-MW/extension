document.body.attributeStyleMap.set("zoom","67%");
setTimeout(function (){
	var urlConfig = "https://docs.google.com/spreadsheets/d/1yQ41kTP39D9y7Eh3pM7yDQyLxhI-5H6-3YjbgbfD98I/gviz/tq?&sheet=Facebook&tq=Select *"
	var minutesInSeg = 10;
	var seg = 0;
	var xpaths =[];
	var div_contenedor_mg = "";
	var div_post_principal = "";
	var likes = "";
	var span_likes = "";
	var div_text_post = "";
	var div_text_post_sub = "";
	var likes_video = "";
	var commentsXpath = "";
	var sharedXpath = "";
	var comments_icon = "";
	var shared_icon = "";
	var position_comments_icon="";
	var position_shared_icon="";
	var div_reactions_container = "";
	var container_video = "";

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
	let tt = document.title.replace(/,/g,"").replace(" | Facebook","").split('+)');

	if(tt.length > 1){
		tt = tt[1];
	}else{
		tt = tt[1];
	}
	var post =
		{ 
			PostName: tt, 
			url:'', 
			post:"",
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

			div_contenedor_mg = xpaths[0].items;
			div_post_principal = xpaths[1].items;
			likes = xpaths[2].items;
			span_likes = xpaths[3].items;
			likes_video = xpaths[4].items;
			commentsXpath = xpaths[5].items;
			sharedXpath = xpaths[6].items;
			comments_icon = xpaths[7].items;
			shared_icon = xpaths[8].items;
			position_comments_icon = xpaths[9].items;
			position_shared_icon = xpaths[10].items;
			div_reactions_container = xpaths[11].items;
			container_video = xpaths[12].items;
			div_text_post = xpaths[13].items;
			div_text_post_sub= xpaths[14].items;

			

			console.log("###=> div_contenedor_mg " + div_contenedor_mg);
			console.log("###=> div_post_principal " + div_post_principal);
			console.log("###=> likes " + likes);
			console.log("###=> span_likes " + span_likes);
			console.log("###=> likes_video " + likes_video);
			console.log("###=> Title post " + div_text_post);
			console.log("###=> Subtitle post " + div_text_post_sub);
			
			

			/*for (var t = 0; t < xpaths.length; t++) {
				let elementXpathFace = xpaths[t];
				console.log("###############=> elementXpathFace_them_ " + JSON.stringify(elementXpathFace.them));
				console.log("###=> elementXpathFace.items.length: " + JSON.stringify(elementXpathFace.items.length));
				console.log("###=> elementXpathFace.items: " + elementXpathFace.items);

				div_contenedor_mg = elementXpathFace.items;
				for (var i = 0; i < elementXpathFace.items.length; i++) {
					var itemElement = elementXpathFace.items[i];
					console.log("#=> itemElement_ " + elementXpathFace.items[i]);
					div_contenedor_mg += elementXpathFace.items[i];
				}
			}*/
			
		}catch(error){
			console.log(error);
		}
	}

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

			waitForElm(div_contenedor_mg)		
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
				let xpath = div_post_principal;
				console.log('##########BUSCANDO EL CONTENER###########');
				console.log(xpath);
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
		console.log("Obteniendo las reacciones.... de element");
		console.log(element);

		//Extraccion de los likes
		
		let lk = element.querySelector(likes);
		let containerVideo =element.querySelector(container_video);
		console.log(lk);
		if(lk !== null && lk.textContent != "" && !lk.textContent.includes(' d') && !lk.textContent.includes(' las')){

			console.log("LIKES: " + lk.textContent);
			let valueLikeTemp = lk.textContent.replace("Tú y ","").replace(" persona más","").replace(" personas más","");
			if(valueLikeTemp.match(/^\d/)){
				post.likes = valueLikeTemp.replace(",",".").replace(/&nbsp;/g, ' ');
			}
		}else{
			lk= null;
			let spanLk =element.querySelectorAll(span_likes);
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

				let lkArr = Array.prototype.slice.call(element.querySelectorAll('span')).filter(function (el) {
					return el.textContent.endsWith(' personas más');
				});
				if(lkArr.length> 0){
					console.log("endsWith: "+lkArr[0].outerText);
					//if(lkArr[0].outerText.match(/^\d/)){
						lk = lkArr[0].outerText.replace(",",".").replace(" personas más","").replace("Â ",' ').replace(/&nbsp;/g, ' ');
						if(lk.split(' y ').length> 1)
							post.likes = lk.split(' y ')[1];
					//}  
				}
				if(lk == null){
					
					let spanLk = (containerVideo != null)?containerVideo.querySelectorAll(likes_video):element.querySelectorAll(likes_video);
					console.log("Likes video");
					for (var s = 0; s < spanLk.length; s++) {
						let spn = spanLk[s];
					console.log(spn.outerText);
					if(!spn.outerText.includes(' d') && !spn.outerText.includes(' las') && !spn.outerText.includes(' rep') && spn.outerText != ""){
						lk = spn;
						console.log("LIKES: " + lk.outerText);
						if(lk.outerText.match(/^\d/)){
							post.likes = lk.outerText.replace(",",".").replace(" personas más","").replace("Â ",' ').replace(/&nbsp;/g, ' ');
							if(post.likes.split(' y ').length> 1)
								post.likes = post.likes.split(' y ')[1];
						}
						break;
					}
					}

				}
			}
		}

		if((post.likes.includes('compartid')
		|| post.likes.includes('comentario')
		|| post.likes.includes('visualizaci')
		|| post.likes.includes('reproducc')
		|| post.likes.includes(' d')
		|| post.likes.includes(' h')
		|| post.likes.includes(':')
		|| post.likes.includes('.'))&& !post.likes.includes("mil")){
			post.likes="0";
		}

		
		let reactionContainer =null;
		if(containerVideo != null){
			reactionContainer = containerVideo.querySelector(div_reactions_container);	
		}else{
			reactionContainer = element.querySelector(div_reactions_container);
		}


		//##########################Extraccion de los compartidos##########################
		console.log("div_reactions_container: "+reactionContainer.length)
		
		let shared = null;
		let spanExtras = 0;
		let findedReactionCC =0;
		let position = -1;
		let spanShared =(reactionContainer.length > 0)?reactionContainer.querySelectorAll(sharedXpath):element.querySelectorAll(sharedXpath);
		if(spanShared.length > 4){
			spanExtras = spanShared.length-4;
		}
		let iconShared =(reactionContainer.length > 0)?reactionContainer.querySelectorAll(shared_icon):element.querySelectorAll(shared_icon);
		console.log("iconShared: "+iconShared.length)
		iconShared.forEach(function(i) {
		if(i.style.backgroundPosition == position_shared_icon){	
			findedReactionCC = 1;		
			if(iconShared!=null){
				if(spanShared.length==1){
					position=1;
				}
				else if(spanShared.length>1){
					position=2;
				}
			}
		}
		})

		console.log("position para shared: "+position)
		if(position > 0){  			
			console.log("spanShared: "+spanShared.length)
			spanShared.forEach(function(spn, index) {
				console.log(spn.textContent);
			if(!spn.textContent.includes(' ') && index == (spanShared.length-(findedReactionCC+spanExtras))){
				shared = spn.textContent;
				post.shared = spn.textContent.replace(",",".");
				console.log("Compartidos:");
				console.log(spn.textContent.replace(",","."));
			}
			});
		}

		if(shared == null || shared == ""  || shared == " "){
			post.shared = "0";
			shared = Array.prototype.slice.call(element.querySelectorAll('span')).filter(function (el) {
				return el.textContent.includes('vez compartid');
			});
			console.log(shared);
			if(shared.length > 0){
				if(shared[0].textContent.match(/^\d/)){
					post.shared = shared[0].textContent.replace(",",".").replace("vez compartido","").replace("vez compartida","").replace("Â ",' ').replace(/&nbsp;/g, ' ');
				}  		
			}
			else{
				shared = Array.prototype.slice.call(element.querySelectorAll('span')).filter(function (el) {
					return el.textContent.includes('veces compartid');
				});
				console.log(shared);
				if(shared.length > 0){
					if(shared[0].textContent.match(/^\d/)){
						post.shared = shared[0].textContent.replace(",",".").replace("veces compartida","").replace("veces compartido","").replace("Â ",' ').replace(/&nbsp;/g, ' ');
					} 
					
				}
			}
		}

		//##########################Extraccion del comentario##########################
		let comments = null;
		let spanComments =(reactionContainer != null)?reactionContainer.querySelectorAll(commentsXpath):element.querySelectorAll(commentsXpath);
		spanExtras = 0; 
		if(spanComments.length > 4){
			spanExtras = spanComments.length-4;
		}
		let iconComment =(reactionContainer.length != null)?reactionContainer.querySelectorAll(comments_icon):element.querySelectorAll(comments_icon);
		position = 0;
		iconComment.forEach(function(i) {
			if(i.style.backgroundPosition == position_comments_icon){			
				position=1;
				
			}
		})
		findedReactionCC = findedReactionCC+position;
		console.log("position para comments: "+position)
		if(position > 0){
		spanComments.forEach(function(spn,index) {
			console.log(spn.textContent);
			if(!spn.textContent.includes(' ') && index == (spanComments.length-(findedReactionCC+spanExtras))){
				comments = spn.textContent;
				post.comments = spn.textContent.replace(",",".");
				console.log("Comentarios:");
				console.log("index: "+index);
				console.log(spn.textContent.replace(",","."));
			}
		});
		}
		if(comments == null || comments == ""  || comments == " "){
			post.comments = "0";
			comments = Array.prototype.slice.call((reactionContainer.length != null)?reactionContainer.querySelectorAll('span'):element.querySelectorAll('span')).filter(function (el) {
				return el.textContent.includes('comentario');
			});
			console.log(shared);
			if(comments.length > 0){
				if(comments[0].textContent.match(/^\d/)){
					post.comments = comments[0].textContent.replace(",",".").replace("comentarios","").replace("comentario","").replace("Â ",' ').replace(/&nbsp;/g, ' ');
				}   			
			}
		
				//Extraccion de reproducciones
			let reproducc = Array.prototype.slice.call((reactionContainer.length != null)?reactionContainer.querySelectorAll('span'):element.querySelectorAll('span')).filter(function (el) {
				return el.textContent.includes(' reproducc');
			});
			console.log(reproducc);
			if(reproducc.length > 0){
				if(reproducc[0].textContent.match(/^\d/)){
					post.reproductions = reproducc[0].textContent.replace(",",".").replace("reproducciones","").replace("reproducción","").replace("reproduccion","").replace("Â ",' ').replace(/&nbsp;/g, ' ');
				}  		
			}else{
				reproducc = Array.prototype.slice.call((reactionContainer.length != null)?reactionContainer.querySelectorAll('span'):element.querySelectorAll('span')).filter(function (el) {
					return el.textContent.includes('visualizaci');
				});
				console.log(reproducc);
				if(reproducc.length > 0){
					if(reproducc[0].textContent.match(/^\d/)){
						post.reproductions = reproducc[0].textContent.replace(",",".").replace("visualizaciones","").replace("visualizacio","").replace("visualización","").replace("Â ",' ').replace(/&nbsp;/g, ' ');
					}  		
				}
			}
		}

		//################################Extraccion del texto#####################
		
		let divTextPost = (reactionContainer != null)?reactionContainer.querySelectorAll(div_text_post):element.querySelectorAll(div_text_post);
		if(divTextPost.length > 0){
			if(divTextPost != null && divTextPost!== undefined){
				post.post = divTextPost[0].textContent;
			}
		}
		
		//subtitle
		divTextPost = (reactionContainer != null)?reactionContainer.querySelectorAll(div_text_post_sub):element.querySelectorAll(div_text_post_sub);
		if(divTextPost.length > 0){
			if(divTextPost != null && divTextPost!== undefined){
				post.post += divTextPost[0].textContent;
			}
		}
		console.log("Resultados:" + JSON.stringify(post));
	}

}, 1500);
