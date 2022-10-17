console.log("Cargando data...");
let _searchs = [
    {"NOMBRE":'Rendichicas','FECHAINICIO':'10/01/2022','FECHAFIN':'10/08/2022','BUSQUEDA':'("Rendichicas" OR #Rendichicas OR @RendiChicasGas) AND NOT ("https://t.co/W2K00OiwUf" OR "quisiera vivir abrazada de las rendichicas" OR "2 moods en el gc" OR "HOME EN HONOR" OR from:starlightofhobi OR "bts" OR from:lovserhsk OR from:Canarybangtan OR "qué hacía antes de rendichicas" OR from:starlightofhobi OR "free rendichicas" OR "rendichicas best gc" OR "disband" OR "morras de rendichicas" OR from:aritzell OR from:eversincehobi OR "What if we kissed" OR "para qué ir hasta los ángeles a la pink wall cuando puedo ir a un rendichicas" OR "me quiero casar" OR "ODA" OR "t olvidas de las" OR "minions" OR @starlightofhobi OR from:starlightofhobi OR @goldrushjm OR from:goldrushjm OR "prueba de la dictadura" OR "unique" OR "diamond" OR "bities" OR "mas perfect" OR @jimenavmin OR from:jimenavmin OR "concert" OR @kookieslys OR from:kookieslys OR @lovserhsk OR from:lovserhsk OR "Tammy" OR @rendichica OR from:rendichica OR "discography" OR @moonlightskjn OR from:w0nderxhttp OR @w0nderxhttp OR "BTS" OR #BTS OR "girlband" OR @mulberryxmin OR from:mulberryxmin OR @eversincehobi OR from:eversincehobi OR @beomgyusivy OR from:beomgyusivy OR from:goldrushjm OR @goldrushjm OR @moonlightskjn OR from:moonlightskjn)'},
    {"NOMBRE":'Chevron (filtro MX/Español)','FECHAINICIO':'10/01/2022','FECHAFIN':'10/08/2022','BUSQUEDA':'("Chevron Havoline México" OR "Chevron Havoline" OR #ChevronMx OR #ChevronHavoline OR "Chevron" OR #Chevron OR @HavolineMx OR #HavolineLoTiene) AND NOT ("Toros de Tijuana" OR "estadio" OR #YoCreoEnToros OR "juego" OR "beisbol" OR #SerieDelRey OR from:TorosDeTijuana OR from:septimaentrada_ OR from:LigaMexBeis OR "@TorosDeTijuana" OR "toros" OR "LMB" OR "Ecuador" OR "PetroPiar" OR "Alberto Baldonado" OR "Stevie Wilkerson" OR "YPF" OR "Pablo Fajardo" OR #JugadorDestacado OR "Barrick Gold")'}
    ];
    
let _ctrlsToFind = [
       {
          "step":2,
          "name":"",
          "tagName":"flux-button",
          "className":"",
          "id":"",
          "attr":"data-test-id=update-results",
          "text":"",
          "html":"",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"btn_start_search",
                "tagName":"button",
                "className":"button dense hasLabel type-outline tint-primary",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"click",
             }
          ]
       },
       {
          "step":3,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Mentions Trend",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"btn_download_mentions_trend",
                "tagName":"flux-list-item",
                "className":"",
                "id":"",
                "attr":"ng-click=$ctrl.clickEvent(item.click)",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"click"
             }
          ]
       },
       {
          "step":1,
          "name":"text_search",
          "tagName":"div",
          "className":"cm-activeLine cm-line",
          "id":"",
          "attr":"",
          "text":"",
          "html":"",
          "finded":null,
          "chil":[],
          "action":"setText",
       },
       {
          "step":4,
          "name":"",
          "tagName":"md-tab-item",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Analytics",
          "finded":null,
          "action":"click",
          "chil":[]
       },
       {
          "step":5,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Total Mentions",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"totalmentions",
                "tagName":"span",
                "className":"mw-label-formatted-number__value",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"getText"
             }
          ]
       },
       {
          "step":6,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Mentions/Day Average",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"mentionsdayaverage",
                "tagName":"span",
                "className":"mw-label-formatted-number__value",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"getText"
             }
          ]
       },
       {
          "step":7,
          "name":"",
          "tagName":"base-widget",
          "className":"",
          "id":"",
          "attr":"",
          "text":"",
          "html":"Total Engagement",
          "finded":null,
          "action":"",
          "chil":[
             {	"step":1,
                "name":"totalengagement",
                "tagName":"span",
                "className":"mw-label-formatted-number__value",
                "id":"",
                "attr":"",
                "text":"",
                "html":"",
                "chil":[],
                "finded":null,
                "action":"getText"
             }
          ]
       },   
    ];

    