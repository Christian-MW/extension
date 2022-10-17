console.log("Script inyectado!!!");

function observableS(v){
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

let ctrl;
let finded = false;
let containerPather = document.querySelectorAll('mi-app-chrome-content');
//let ctrlsToFind = [];
let result =[];
let finishedSleep = false;

let objSearch ={ text_search:"", startDate:"", endDate:"" }
let objSearchResult ={ search:"", totalmentions:"", mentionsdayaverage:"", totalengagement:"" }
let listSearchResult =[];

let pos = -1; 
let indexCtrl = -1;

let flag = new observableS(-1);
flag.onChange(function(v){
    console.log("");console.log("");
     console.log("value changed to: " + v);  
    if(v >= 0){
         if(v == 0){ 
            //Procesar la busqueda
            pos++;
            console.log("pos: "+pos+" < searchs.length: "+searchs.length);
            if(pos < searchs.length ){
                flag.setValue(2);
                
                objSearch.text_search = searchs[pos].BUSQUEDA;
                objSearchResult.search = searchs[pos].NOMBRE;
                
                ctrlsToFind.sort((a, b) => a.step - b.step);
                indexCtrl = 0;
                processCtrls(ctrlsToFind, false);
                
            }
            else{  
                //Búsquedas procesadas    
                console.log("Finaliado!!!");
                console.log(listSearchResult);
                console.log(JSON.stringify(listSearchResult));
                chrome.runtime.sendMessage(null, JSON.stringify(listSearchResult));         
            }
         }else if(v == 1 ){
            //Bucando el control
            indexCtrl++;
            processCtrls(ctrlsToFind, false);
         }
         
    }     
});

function find(Pather, ctrlToFind) {
    //////console.log(Pather);
    if (Pather != null) {
        let shadow = Pather.shadowRoot;
        let children = [];

        if (!finded) {

            //////console.log(ctrlToFind);
            //////console.log(shadow);
            //////console.log(Pather);	

            if (shadow != null) {
                children = shadow.children;
                ////////console.log("Hijos en Shadow");
                for (let c = 0; c < children.length; c++) {

                    if (ctrlToFind.tagName.toLowerCase() == children[c].localName) {
												
                        if (ctrlToFind.id != "") {
                            if (ctrlToFind.id == children[c].id) {

                                console.log("Encontrado!!!");
                                finded = true;
                                ctrl = children[c];
                            }
                        } 
						else if (ctrlToFind.className != "") {
                            if (ctrlToFind.className == children[c].className) {
                                if (ctrlToFind.attr != "") {
                                    let attr = children[c].attributes;
                                    let prop = ctrlToFind.attr.split('=');
                                    for (let a = 0; a < attr.length; a++) {
                                        ////////console.log("attr[a]: "+attr[a]);
                                        if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                            console.log("Encontrado!!!");	
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }
                                } 
								else {

                                    console.log("Encontrado!!!");	
                                    finded = true;
                                    ctrl = children[c];
                                }

                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);									
                                        if (ctrlToFind.text != children[c].innerText) {
											console.log("NO coincide el texto");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    } 
									else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.htm)) {
											console.log("NO cointine el html");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    }
                                }

                            }
                        } 
						else if (ctrlToFind.attr != "") {
                            let attr = children[c].attributes;
                            let prop = ctrlToFind.attr.split('=');
                            for (let a = 0; a < attr.length; a++) {
                                ////////console.log("attr[a]: "+attr[a]);
                                if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                    console.log("Encontrado!!!");	
                                    finded = true;
                                    ctrl = children[c];
                                }
                            }
                            if (finded) {
                                if (ctrlToFind.text != "") {
                                    ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                    ////////console.log("children[c].innerText: "+children[c].innerText);
                                    if (ctrlToFind.text != children[c].innerText) {
										console.log("NO coincide el texto 2");
                                        finded = false;
                                        ctrl = null;
                                    }
                                } 
								else if (ctrlToFind.html != "") {
                                    //////console.log("children[c].innerText: "+children[c].innerHTML);
                                    if (!children[c].innerHTML.includes(ctrlToFind.htm)) {
										console.log("NO contiene el html 2");
                                        finded = false;
                                        ctrl = null;
                                    }
                                }
                            }

                        } 
						else if (ctrlToFind.text != "") {
                            ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                            ////////console.log("children[c].innerText: "+children[c].innerText);
                            if (ctrlToFind.text == children[c].innerText) {
                                finded = true;
                                ctrl = children[c];
                            }
                        } 
						else if (ctrlToFind.html != "") {
                            //////console.log("children[c].innerText: "+children[c].innerHTML);
                            if (children[c].innerHTML.includes(ctrlToFind.htm)) {
                                finded = true;
                                ctrl = children[c];
                            }
                        }
                    }

                    if (finded) {
                        console.log("Encontrado!!!");									
                        break;
                    } 
					else {
                        //////console.log("Buscando en los Hijos del Pather");
                        find(children[c], ctrlToFind);
                    }
                }
            }

            if (!finded) {

                children = Pather.children;
                //////console.log("Hijos en Pather");
                for (let c = 0; c < children.length; c++) {

                    if (ctrlToFind.tagName.toLowerCase() == children[c].localName) {
						                        												
                        if (ctrlToFind.id != "") {
                            if (ctrlToFind.id == children[c].id) {

                                console.log("Encontrado!!!");
                                finded = true;
                                ctrl = children[c];
                            }
                        } 
						else if (ctrlToFind.className != "") {
                            if (ctrlToFind.className == children[c].className) {
                                if (ctrlToFind.attr != "") {
                                    let attr = children[c].attributes;
                                    let prop = ctrlToFind.attr.split('=');
                                    for (let a = 0; a < attr.length; a++) {
                                        ////////console.log(typeof(attr["data-test-id"]));
                                        ////////console.log(attr[prop[0]]);
                                        if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                            console.log("Encontrado!!!");	
                                            finded = true;
                                            ctrl = children[c];
                                        }
                                    }
                                } 
								else {

                                    console.log("Encontrado!!!");
                                    finded = true;
                                    ctrl = children[c];
                                }

                                if (finded) {
                                    if (ctrlToFind.text != "") {
                                        ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                        ////////console.log("children[c].innerText: "+children[c].innerText);
                                        if (ctrlToFind.text != children[c].innerText) {
											console.log("NO coincide el texto 3");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    } 
									else if (ctrlToFind.html != "") {
                                        //////console.log("children[c].innerText: "+children[c].innerHTML);
                                        if (!children[c].innerHTML.includes(ctrlToFind.htm)) {
											console.log("NO contiene el html 3");
                                            finded = false;
                                            ctrl = null;
                                        }
                                    }
                                }

                            }
                        } 
						else if (ctrlToFind.attr != "") {
                            let attr = children[c].attributes;
                            let prop = ctrlToFind.attr.split('=');
                            for (let a = 0; a < attr.length; a++) {
                                if (attr[prop[0]] !== undefined && attr[prop[0]].value == prop[1]) {
                                    console.log("Encontrado!!!");	
                                    finded = true;
                                    ctrl = children[c];
                                }
                            }

                            if (finded) {
                                if (ctrlToFind.text != "") {
                                    ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                                    ////////console.log("children[c].innerText: "+children[c].innerText);
                                    if (ctrlToFind.text != children[c].innerText) {
										console.log("NO coincide el texto 4");
                                        finded = false;
                                        ctrl = null;
                                    }
                                } 
								else if (ctrlToFind.html != "") {
                                    //////console.log("children[c].innerText: "+children[c].innerHTML);
                                    if (!children[c].innerHTML.includes(ctrlToFind.htm)) {
										console.log("NO contiene el html 4");
                                        finded = false;
                                        ctrl = null;
                                    }
                                }
                            }
                        } else if (ctrlToFind.text != "") {
                            ////////console.log("ctrlToFind.text: "+ctrlToFind.text );
                            ////////console.log("children[c].innerText: "+children[c].innerText);
                            if (ctrlToFind.text == children[c].innerText) {
                                finded = true;
                                ctrl = children[c];
                            }
                        } 
						else if (ctrlToFind.html != "") {
                            if (children[c].innerHTML.includes(ctrlToFind.htm)) {
                                finded = true;
                                ctrl = children[c];
                            }
                        }
                    }

                    if (finded) {
                        break;
                    } else {
                        //console.log("Buscando en los Hijos del Pather");
                        find(children[c], ctrlToFind);
                    }
                }
            }
        
		}

    }

}

function processCtrls(_ctrlToFind, isChil){
	let ctrlToFind = [];
	if(isChil){
		ctrlToFind = _ctrlToFind.chil;		
	}
	else{
		ctrlToFind.push(_ctrlToFind[indexCtrl]);
	}
	
	ctrlToFind.sort((a, b) => a.step - b.step);
	
	
	for(let f = 0; f<ctrlToFind.length; f++){
		finded = false;
		ctrl = null;
		
		if(isChil){
			if(f > 0){
				if(ctrlToFind.length > 1 && (ctrlToFind[f-1].finded != null && ctrlToFind[f-1].finded !== undefined )){
					find(_ctrlToFind.finded,ctrlToFind[f]);
				}else{
					break;
				}
			}else{
				find(_ctrlToFind.finded,ctrlToFind[f]);
			}
			
			ctrlToFind[f].finded = ctrl;
		}
		else{
			find(containerPather[0],ctrlToFind[f]);
			ctrlToFind[f].finded = ctrl;
		}
		
		
		if(finded){
			
			action(ctrlToFind[f]);
			if(ctrlToFind[f].chil !== undefined && ctrlToFind[f].chil != null && ctrlToFind[f].chil.length > 0){
				processCtrls(ctrlToFind[f], true);
			}
		}
		else{
			console.log("No se logro encontrar el control del paso: "+ctrlToFind[f].step);
		}
		
	}
	
	if(isChil){
		_ctrlToFind.chil = ctrlToFind;
	}
	else{
		_ctrlToFind[indexCtrl] = ctrlToFind[0];
        ctrlsToFind[indexCtrl] = ctrlToFind[0];
	}
	
}

function action(_ctrlA){ 
    
    console.log("iniciando accion ");     
    let _ctrl = {};
    if(_ctrlA.chil != null && _ctrlA.chil.length > 0){
        _ctrl = _ctrlA.chil[0];
    }else{
        _ctrl = _ctrlA; 
    }

	if(_ctrl.action != "" && _ctrl.action !== undefined){
		let actions = _ctrl.action.split(',');
		
		for(let a = 0; a< actions.length; a++){
		
			if(actions[a].trim() == "click"){
				console.log("Accionando un click");
                console.log(_ctrl);
				_ctrl.finded.click();
				sleep(10000);
			}
			else if(actions[a].trim() == "setText"){
				console.log("Accionando un setText");
				_ctrl.finded.innerHTML = objSearch[_ctrl.name];
                sleep(3000);
			}	
			else if(actions[a].trim() == "change"){
				console.log("Accionando un change");
                
			}	
			else if(actions[a].trim() == "getText"){
				console.log("Accionando un getText");
				objSearchResult[_ctrl.name]= _ctrl.finded.innerText;
                flag.setValue(1);
			}
		
		}
	}else{
		console.log("No tiene accion que hacer!!");
	}		
}

function sleep(second){
	let tm = second/1000;
	finishedSleep = false;
	setTimeout(function(){ 
		console.log("Tiempo cumplido!!!");
		flag.setValue(1);
     }, second);
}

setTimeout(function(){ 
    console.log("Starting....");
    console.log(pass);
console.log("searchs: "+searchs.length);
console.log("ctrlsToFind: "+ctrlsToFind.length);
    flag.setValue(0);
 }, 10000);
