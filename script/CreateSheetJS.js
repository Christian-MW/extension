console.log("Cargando CreateSheetjs");

var wb = XLSX.utils.book_new();
wb.Props = {
Title: "Evaluación",
Subject: "",
Author: "Metricser by extension",
CreatedDate: new Date()
};

function addSheet(name, content){
	if(name == ""){
		console.log("No se puede agregar contenido a un sheet sin nombre");
	}else{
		try{
			wb.SheetNames.push(name.trim());
			let ws = XLSX.utils.aoa_to_sheet(content);
			wb.Sheets[name.trim()] = ws;

		}catch(error){
			console.log(error);
		}
	}
}


function addImgToSheet(name, imgname, picBlob, from, to){
	if(name == ""){
		console.log("No se puede agregar contenido a un sheet sin nombre");
	}else{
		try{
			try{
				wb.SheetNames.push(name.trim());
			}
			catch(error){
					console.log(error);
			}
			wb.Sheets[name.trim()] = {};
			wb.Sheets[name.trim()]['!images'] =
		     {
		        name: imgname+'.jpeg',
		        data: picBlob, 
		        opts: {base64 : true},
		        position:{
		            type: 'twoCellAnchor',
		            attrs: {editAs:'oneCell'},
		            from: from, //{ col: 2, row : 2 },
		            to: to //{ col: 6, row: 5 }
		        }
		    };


		}catch(error){
			console.log(error);
		}
	}
}



function downloadBook(name){
	var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
	let blob = new Blob([s2ab(wbout)], {type: "data:text/xlsx;charset=utf-8"});
	let objectURL = URL.createObjectURL(blob);
	chrome.downloads.download({ url: objectURL, filename: (dirBase + '/' + currentDirectory + '/' + name + ".xlsx"), conflictAction: 'overwrite' });

	wb = XLSX.utils.book_new();
}



function s2ab(s) {
var buf = new ArrayBuffer(s.length);
var view = new Uint8Array(buf);
for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
return buf;
}


