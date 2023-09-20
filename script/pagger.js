const botonAtrasDOM = document.querySelector("#atras");
const informacionPaginaDOM = document.querySelector("#informacion-pagina");
const botonSiguienteDOM = document.querySelector("#siguiente");

   
    
    //const listadoArticulosDOM = document.querySelector("#listado-articulos");
    
    //const plantillaArticulo = document.querySelector("#plantilla-articulo").content.firstElementChild;

    const elementosPorPagina = 10;
    let paginaActual = 1;
    


	 // --
	 // Funciones
	 // --

	 /**
	  * Función que pasa a la siguiente página
	  * @return void
	  */
	 function avanzarPagina() {
        // Incrementar "paginaActual"
        paginaActual = paginaActual + 1;
        // Redibujar
        renderizar();
    }

    /**
     * Función que retrocedea la página anterior
     * @return void
     */
    function retrocederPagina() {
        // Disminuye "paginaActual"
        paginaActual = paginaActual - 1;
        // Redibujar
        renderizar();
    }

    /**
     * Función que devuelve los datos de la página deseada
     * @param {Int) pagina - Número de página
     * @return {Array<JSON>}
     */
    function obtenerRebanadaDeBaseDeDatos(pagina = 1) {
        const corteDeInicio = (paginaActual - 1) * elementosPorPagina;
        const corteDeFinal = corteDeInicio + elementosPorPagina;
        return DataCampaign.slice(corteDeInicio, corteDeFinal);
    }

    /**
     * Función que devuelve el número total de páginas disponibles
     * @return {Int}
     */
    function obtenerPaginasTotales() {
        return Math.ceil(DataCampaign.length / elementosPorPagina);
    }

    /**
     * Función que gestiona los botones del paginador habilitando o
     * desactivando dependiendo de si nos encontramos en la primera
     * página o en la última.
     * @return void
     */
    function gestionarBotones() {
        // Comprobar que no se pueda retroceder
        if (paginaActual === 1) {
            botonAtrasDOM.setAttribute("disabled", true);
            botonAtrasDOM.classList.add('btn-disabled');
        } else {
            botonAtrasDOM.removeAttribute("disabled");
            botonAtrasDOM.classList.remove('btn-disabled');
        }
        // Comprobar que no se pueda avanzar
        if (paginaActual === obtenerPaginasTotales()) {
            botonSiguienteDOM.setAttribute("disabled", true);
            botonSiguienteDOM.classList.add('btn-disabled');
        } else {
            botonSiguienteDOM.removeAttribute("disabled");
            botonSiguienteDOM.classList.remove('btn-disabled');

        }
    }

    /**
     * Función que se encarga de dibujar el nuevo DOM a partir de las variables
     * @return void
     */
    function renderizar() {
        console.log("renderizar.......")
        
        // Limpiamos los artículos anteriores del DOM
        //listadoArticulosDOM.innerHTML = "";
        // Obtenemos los artículos paginados
        const responseCampañas = obtenerRebanadaDeBaseDeDatos(paginaActual);
        //// Dibujamos
        // Deshabilitar botones pertinentes (retroceder o avanzar página)
        gestionarBotones();
        // Informar de página actual y páginas disponibles
        informacionPaginaDOM.textContent = `Página ${paginaActual} de ${obtenerPaginasTotales()}`;
        // Crear un artículo para cada elemento que se encuentre en la página actual
        $(".tblCampañas").find('tbody').html("");
            let dateNow = new Date();
            dateNow = new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate());
            for (let i = 0; i < responseCampañas.length; i++) {
                let arrDt = responseCampañas[i].rules.startDate.split('/');
                let startDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));
                arrDt = responseCampañas[i].rules.endDate.split('/');
                let endDateObject = new Date(parseInt(arrDt[2]),parseInt(arrDt[1])-1,parseInt(arrDt[0]));
                let theme = responseCampañas[i].theme;
                let sheet = responseCampañas[i].sheet;
                let start = responseCampañas[i].rules.startDate;
                let end = responseCampañas[i].rules.endDate;
                let btnUpdate = '';
                console.log("Fechas")
                console.log(dateNow)
                console.log(endDateObject)
                if(dateNow <= endDateObject)
                {
                    console.log("CReando el boton actualizar");
                    requestCpUpdate[theme]={
                        "campaign":theme,
                        "spreadsheet_id": responseCampañas[i].sheet,
                        "range":"Campañas",
                        "search":responseCampañas[i].search,
                        "date_start":start,
                        "date_end":end,
                        "update":"update"
                    }
                    btnUpdate='&nbsp;&nbsp;<button type="button" class="btn-success btnUpdateCP" name="'+theme+'">Actualizar</button>';
                    
                }else{
                    console.log("Si boton actualizar");
                }
                $(".tblCampañas").find('tbody').append('<tr><td>'+theme+'</td><td><a href="https://docs.google.com/spreadsheets/d/'+sheet+'" target="blank">Ver</a>'+btnUpdate+'</td><td>'+start+'</td><td>'+end+'</td></tr>');
                $("#ctn-pagger").show();
            }
    }

    // --
    // Eventos
    // --
    botonAtrasDOM.addEventListener("click", retrocederPagina);
    botonSiguienteDOM.addEventListener("click", avanzarPagina);

    // --
    // Inicio
    // --
    //renderizar(); // Mostramos la primera página nada más que carge la página
