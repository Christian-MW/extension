const botonAtrasrDOM = document.querySelector("#atras-rk");
const informacionPaginarDOM = document.querySelector("#informacion-pagina-rk");
const botonSiguienterDOM = document.querySelector("#siguiente-rk");

   
    
    //const listadoArticulosDOM = document.querySelector("#listado-articulos");
    
    //const plantillaArticulo = document.querySelector("#plantilla-articulo").content.firstElementChild;

    const elementosPorPaginaRK = 10;
    let paginaActualRk = 1;
    


	 // --
	 // Funciones
	 // --

	 /**
	  * Función que pasa a la siguiente página
	  * @return void
	  */
	 function avanzarPaginaR() {
        // Incrementar "paginaActualRk"
        paginaActualRk = paginaActualRk + 1;
        // Redibujar
        renderizarPaggerRk();
    }

    /**
     * Función que retrocedea la página anterior
     * @return void
     */
    function retrocederPaginaR() {
        // Disminuye "paginaActualRk"
        paginaActualRk = paginaActualRk - 1;
        // Redibujar
        renderizarPaggerRk();
    }

    /**
     * Función que devuelve los datos de la página deseada
     * @param {Int) pagina - Número de página
     * @return {Array<JSON>}
     */
    function obtenerRebanadaDeBaseDeDatos(pagina = 1) {
        const corteDeIniciork = (paginaActualRk - 1) * elementosPorPaginaRK;
        const corteDeFinalrk = corteDeIniciork + elementosPorPaginaRK;
        return DataRanking.slice(corteDeIniciork, corteDeFinalrk);
    }

    /**
     * Función que devuelve el número total de páginas disponibles
     * @return {Int}
     */
    function obtenerPaginasTotalesRk() {
        return Math.ceil(DataRanking.length / elementosPorPaginaRK);
    }

    /**
     * Función que gestiona los botones del paginador habilitando o
     * desactivando dependiendo de si nos encontramos en la primera
     * página o en la última.
     * @return void
     */
    function gestionarBotonesRk() {
        // Comprobar que no se pueda retroceder
        if (paginaActualRk === 1) {
            botonAtrasrDOM.setAttribute("disabled", true);
            botonAtrasrDOM.classList.add('btn-disabled');
        } else {
            botonAtrasrDOM.removeAttribute("disabled");
            botonAtrasrDOM.classList.remove('btn-disabled');
        }
        // Comprobar que no se pueda avanzar
        if (paginaActualRk === obtenerPaginasTotales()) {
            botonSiguienterDOM.setAttribute("disabled", true);
            botonSiguienterDOM.classList.add('btn-disabled');
        } else {
            botonSiguienterDOM.removeAttribute("disabled");
            botonSiguienterDOM.classList.remove('btn-disabled');

        }
    }

    /**
     * Función que se encarga de dibujar el nuevo DOM a partir de las variables
     * @return void
     */
    function renderizarPaggerRk() {
        console.log("renderizarPaggerRk.......")
        
        // Limpiamos los artículos anteriores del DOM
        //listadoArticulosDOM.innerHTML = "";
        // Obtenemos los artículos paginados
        const responseRanking = obtenerRebanadaDeBaseDeDatosRk(paginaActualRk);
        //// Dibujamos
        // Deshabilitar botones pertinentes (retroceder o avanzar página)
        gestionarBotonesRk();
        // Informar de página actual y páginas disponibles
        informacionPaginarDOM.textContent = `Página ${paginaActualRk} de ${obtenerPaginasTotalesRk()}`;
        // Crear un artículo para cada elemento que se encuentre en la página actual
        $(".tblRanking").find('tbody').html("");
            let dateNow = new Date();
            dateNow = new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate());
            for (let i = 0; i < responseRanking.length; i++) {
                let arrDt = responseRanking[i].rules.startDate.split('/');
                let startDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));
                arrDt = responseRanking[i].rules.endDate.split('/');
                let endDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));
                let theme = responseRanking[i].theme;
                let sheet = responseRanking[i].sheet;
                let start = responseRanking[i].rules.startDate;
                let end = responseRanking[i].rules.endDate;
                let btnUpdate = '';
                console.log("Fechas")
                console.log(dateNow)
                console.log(endDateObject)
                if(dateNow <= endDateObject)
                {
                    console.log("CReando el boton actualizar");
                    requestCpUpdate[theme]={
                        "campaign":theme,
                        "spreadsheet_id": responseRanking[i].sheet,
                        "range":"Campañas",
                        "search":responseRanking[i].search,
                        "date_start":start,
                        "date_end":end,
                        "update":"update"
                    }
                    btnUpdate='&nbsp;&nbsp;<button type="button" class="btn-success btnUpdateRK" name="'+theme+'">Actualizar</button>';
                    
                }else{
                    console.log("Si boton actualizar");
                }
                $(".tblRanking").find('tbody').append('<tr><td>'+theme+'</td><td><a href="https://docs.google.com/spreadsheets/d/'+sheet+'" target="blank">Ver</a>'+btnUpdate+'</td><td>'+start+'</td><td>'+end+'</td></tr>');
                $("#ctn-pagger-rk").show();
            }
    }

    // --
    // Eventos
    // --
    botonAtrasrDOM.addEventListener("click", retrocederPaginaR);
    botonSiguienterDOM.addEventListener("click", avanzarPaginaR);

