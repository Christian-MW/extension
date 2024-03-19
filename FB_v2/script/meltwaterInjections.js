//_dataApis={tokenAuthMelt:"",mw_api_search:"",mw_api_grapql:"",mw_api_runes:"",mw_api_users:"",XClientName:""}
//filters={search:"",dateStart:1696143600000,dateEnd:1699599599999,locations=[],languaje=[]}
function meltInject(_dataApis={}, _filters={}, _parametersMelt={}){
    console.log("Funcion meltInject iniciada!!!");
    let data = JSON.parse(_dataApis);
    let filters = JSON.parse(_filters);
    let parametersMelt = JSON.parse(_parametersMelt);
    console.log(data);
    console.log(filters);

    let requestSearch={};
    let searchSucces = 0;
    let objectResponse = {searchResponse:{},usersResponse:{}};
    generateObject();

	function generateObject(){
        
        var requestHql = {
        "operationName": "GetToken",
        "variables": {
            "searchCriteria": {
                "booleanQuery": filters.search,
                "filter": {
                    "type": "CUSTOM",
                    "filters": {
                        "subKeyword": [],
                        "country": filters.locations,
                        "geoname": [],
                        "booleans": [],
                        "language": filters.languaje,
                        "newsReach": [],
                        "rssSource": [],
                        "sentiment": [],
                        "authorList": [],
                        "newsSource": [],
                        "sourceType": filters.sourcetypes,
                        "customCategory": [],
                        "newsOutletTypes": [],
                        "newsMediaFormats": [],
                        "newsPremiumTypes": [],
                        "broadcastSubtypes": [],
                        "twitter": {
                            "likes": {},
                            "gender": [],
                            "replies": {},
                            "retweets": {},
                            "followers": {},
                            "tweetType": [],
                            "accountStatus": []
                        }
                    }
                },
                "allKeywords": [],
                "anyKeywords": [],
                "notKeywords": [],
                "allSearches": [],
                "anySearches": [],
                "notSearches": [],
                "caseSensitive": "no",
                "searchQueryType": "boolean"
            }
        },
        "query": "query GetToken($searchCriteria: SearchQueryInput!) {\n  token(searchQuery: $searchCriteria) {\n    token\n    __typename\n  }\n}"
        };

        let header = { 'Authorization': "Bearer "+data.tokenAuthMelt,  'Content-Type':'application/json', 'Origin':'https://app.meltwater.com', 'apollographql-client-name':data.apollographql_client_name , 'apollographql-client-version':data.apollographql_client_version }
        //graphql
        sendPostMw(data.mw_api_grapql, requestHql,header)
        .then(function(responseGraphql){
            console.log("responseGraphql");
            console.log(responseGraphql);
            let header = { 'Authorization': data.tokenAuthMelt,'Origin':'https://app.meltwater.com', 'Referer':'https://app.meltwater.com/' , 'X-Client-Name':'alpha-curator-web-overview' , 'Content-Type':'application/json' }
            let _continue = true;
            let requestRunes = {};
            try {
                console.log("Token: "+responseGraphql.data.token.token);
                requestRunes = {"token":responseGraphql.data.token.token};
                
            } catch (error) {
                SendMessageM(mCreateMessageOnError("MeltwaterInyection","Api graphql","",JSON.stringify(responseGraphql)),M_CHANNEL_ERROR);
                _continue = false;
            }
            
            if(_continue){
                //runes
                        
                sendPostMw(data.mw_api_runes, requestRunes,header)
                .then(function(responseRunes){
                    console.log("responseRunes");
                    console.log(responseRunes);

                    requestSearch = {
                        "runes": responseRunes.runesQuery,
                        "twitterApproved": false,
                        "dateRange": {
                            "dateStart": filters.dateStart,
                            "dateEnd": filters.dateEnd
                        },
                        "document": {
                            "sortField": "date",
                            "sortOrder": "DESC",
                            "groupingOption": "similar",
                            "start": 0,
                            "groupFrom": 0,
                            "page": 0,
                            "size": 25,
                            "hidden": false,
                            "keywords": []
                        },
                        "visualizationIds": [
                            "AF-mentionsStatsTrend",
                            "AF-usersCountTrend",
                            "AF-viewsCountTrend",
                            "AF-reachCountTrend",
                            "AF-impressionsStatsTrend",
                            "AF-mentionTypeBreakdown",
                            "AF-mentionTypeBreakdownTrend",
                            "AF-sentiment",
                            "AF-sentimentTrend",
                            "AF-topKeywords",
                            "AF-keywordsPositive",
                            "AF-keywordsNegative",
                            "AF-topEmojis",
                            "AF-authorsAuthority",
                            "AF-mostRetweeted",
                            "AF-topHashtags",
                            "AF-topTwitterAuthors",
                            "AF-topLocations",
                            "AF-genderBreakdown",
                            "AF-resultListSorted",
                            "AF-filterTotal",
                            "AF-filterCountry",
                            "AF-filterInformationType",
                            "AF-filterLanguage",
                            "AF-filterMediaType",
                            "AF-filterSentiment",
                            "AF-filterSourceType",
                            "AF-mergedSourceTypes",
                            "AF-mentionsStatsTrendBySource",
                            "AF-mentionsStatsTrendPredictive",
                            "AF-topStoriesBubble",
                            "AF-topStories"    
                        ]
                    }
                    let header = { 'Authorization': data.tokenAuthMelt,'Origin':'https://app.meltwater.com', 'Referer':'https://app.meltwater.com/' , 'Content-Type':'application/json', 'X-Client-Name':'twitterInsights','X-Request-Id':data.x_request_id  }
                    
                    if(parametersMelt.includeUsers){
                        //Usuarios
                        let publishDate = 
                            {
                                "field": "body.publishDate.date",
                                "type": "range",
                                "from": filters.dateStart.toString(),
                                "to": filters.dateEnd.toString()
                            };
                        let rQ = responseRunes.runesQuery;
                        rQ.allQueries.push(publishDate);
                        
                        let requestUsers = {
                            "dateStart": filters.dateStart,
                            "dateEnd": filters.dateEnd,
                            "runes": {
                                "query": {
                                    "boost": 1,
                                    "matchQuery": rQ,
                                    "notMatchQuery": {
                                        "field": "metaData.applicationTags",
                                        "type": "term",
                                        "value": "_hiddenDocument_"
                                    },
                                    "type": "not"
                                },
                                "isTwitterGuardrailsApproved": false
                            },
                            "page": 0,
                            "pageSize": 25,
                            "sortOrder": "DESC",
                            "sortField": "followers",
                            "groupOption": "none",
                            "fragmentSize": 140,
                            "showHiddenDocuments": false,
                            "timeZone": "America/New_York",
                            "viewRequests": {
                                "AF-twitterInfluencers": {},
                                "AF-twitterUniqueAuthors": {},
                                "AF-twitterVerification": {},
                                "AF-twitterGenderBreakdown": {},
                                "AF-twitterAgeBreakdown": {},
                                "AF-twitterAuthorLocations": {},
                                "AF-twitterTopProfessions": {},
                                "AF-twitterTopInterests": {},
                                "AF-twitterTopLanguages": {},
                                "AF-twitterTopBioKeywords": {}
                            }
                        };
                        
                        sendPostMw(data.mw_api_users, requestUsers,header)
                        .then(function(responseUsers){
                            
                            console.log("responseUsers");
                            console.log(responseUsers);
    
                            objectResponse.usersResponse = responseUsers;
                            searchSucces++;
                            returnMessageChrome();
                        })
                        .catch(function(error){
                            searchSucces++;
                            console.log(error);
                            SendMessageM(mCreateMessageOnError("MeltwaterInyection","Api usuarios","",error),M_CHANNEL_ERROR);
                            console.log("Finalizado con error!!!");
                            console.log(objectResponse);                        
                            chrome.runtime.sendMessage(null, "");
                        });

                    }

                    //Search
                    header = { 'Authorization': data.tokenAuthMelt,'Origin':'https://app.meltwater.com', 'Referer':'https://app.meltwater.com/' , 'Content-Type':'application/json', 'X-Client-Name':'twitterInsights','X-Request-Id':data.x_request_id  }
                            
                    sendPostMw(data.mw_api_search, requestSearch,header)
                    .then(function(responseSearch){
                        console.log("responseSearch");
                        console.log(responseSearch);
                        
                        objectResponse.searchResponse = responseSearch; 
                        
                        console.log("Finalizado con exito!!!");
                        console.log(objectResponse);
                        searchSucces++;
                        returnMessageChrome();
                        //chrome.runtime.sendMessage(null, JSON.stringify(objectResponse));

                    })
                    .catch(function(error){
                        console.log(error);
                        searchSucces++;
                        SendMessageM(mCreateMessageOnError("MeltwaterInyection","Api Search","",error),M_CHANNEL_ERROR);
                        console.log("Finalizado con error!!!");
                        console.log(objectResponse);                        
                        chrome.runtime.sendMessage(null, "");
                    });
                    
                })
                .catch(function(error){
                    console.log(error);
                    SendMessageM(mCreateMessageOnError("MeltwaterInyection","Api Runes","",error),M_CHANNEL_ERROR);
                    console.log("Finalizado con error!!!");
                    console.log(objectResponse);                        
                    chrome.runtime.sendMessage(null, "");
                });
            }else{
                chrome.runtime.sendMessage(null, "");
            }
            
        })
        .catch(function(error){
            console.log(error);
            
            SendMessageM(mCreateMessageOnError("MeltwaterInyection","Api Graphql","",error),M_CHANNEL_ERROR);
            console.log("Finalizado con error!!!");
            console.log(objectResponse);                        
            chrome.runtime.sendMessage(null, "");
        });
    }

    function sendPostMw(url, request, headers){
        try{
            console.log("Ejecutando sendPostMw");
            console.log(url);
            console.log(request);
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(request),
                headers: headers
             })
             .then((response) => response.json())
             .catch((error) => error);
        }catch(error){
            console.log("Error en la funcion sendPostMw");
            console.log(error);
            return {status:210};
        }  
    }

    function returnMessageChrome(){
        if(parametersMelt.includeUsers){
            if(searchSucces>1){
                chrome.runtime.sendMessage(null, JSON.stringify(objectResponse));
            }
        }else{
            chrome.runtime.sendMessage(null, JSON.stringify(objectResponse));
        }
        
    }

    var M_CHANNEL_ERROR = "-1002051644677";
    function SendMessageM(message, channel) {
        let TELEGRAM_BOT_TOKEN = "6799451485:AAF-4CSsRkBK7tm2kpjTb4YIvWE34Pk18X4"
        //Canal Desarrollo
        let url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${channel}&text=${encodeURIComponent(message)}`;
        
        fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify("{}"),
            })
            .then((response) => response.json())
            .then(function(response){
            console.log(response);
            console.log("Mensaje enviado a telegram!!!");
            })
            .catch(function(error){
                console.log(error);
            });
        
    }

    function mCreateMessageOnError(module,fn,parameters,response){
        let message = "Le ha ocurrido un error al usuario\n"+parametersMelt.emailUser;
        if(module !== undefined && module !== ""){
            message+="\n\nModulo: \n"+module;
        }
        if(fn !== undefined && fn!== ""){
            message+="\n\nFunción:\n "+fn;
        }
        if(parameters !== undefined && parameters!== ""){
            message+="\n\nParametros:\n "+rq;
        }
        if(response !== undefined && response!== ""){
            message+="\n\nRespuesta:\n "+response;
        }
        return message;
    }
}

function formatDate(date = new Date(), formater="yyyy-mm-dd HH:mm:ss") {

    const year = date.toLocaleString('default', {year: 'numeric'});
    const month = date.toLocaleString('default', {
      month: '2-digit',
    });
    const day = date.toLocaleString('default', {day: '2-digit'});
    const hour = date.toLocaleString('default', {hour: '2-digit'}).toString().replace(" AM","").replace(" PM","");
    const minute = date.toLocaleString('default', {minute: '2-digit'});
    const second = date.toLocaleString('default', {second: '2-digit'});
    
    let formatersSoportet = ["yyyy-mm-dd hh:mm:ss","mm-dd-yyyy hh:mm:ss","dd-mm-yyyy hh:mm:ss","yyyy-mm-dd","dd-mm-yyyy", "mm-dd-yyyy"]
    
    let result = "";
    for(let c =0; c<formatersSoportet.length; c++){
    
        let f = formatersSoportet[c];
        if(f == formater.toLowerCase().replaceAll("/","-")){
            if(f == "yyyy-mm-dd hh:mm:ss"){
                   result = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;    	
            }
        else if(f == "mm-dd-yyyy hh:mm:ss"){
                   result = month+"-"+day+"-"+year+" "+hour+":"+minute+":"+second;    	
            }
        else if(f == "dd-mm-yyyy hh:mm:ss"){
                   result = day+"-"+month+"-"+year+" "+hour+":"+minute+":"+second;    	
            }
        else if(f == "yyyy-mm-dd"){
                   result = year+"-"+month+"-"+day;    	
            }
        else if(f == "mm-dd-yyyy"){
                   result = month+"-"+day+"-"+year;    	
            }
        else if(f == "dd-mm-yyyy"){
                   result = day+"-"+month+"-"+year;    	
            }
          break;
        }
    }
      if(formater.includes("/"))  {
        result = result.replace("-","/");
    }
  
    return result;
  }

//funcion para obtener los datos de AF-latestActivityBySource para presentationMeltwater
function getValuesFile(data){
    let sources = {};
   
    for(let s = 0; s<data.length; s++){
        let r = [];
      let ds = data[s].data;
        for(let d = 0; d<ds.length; d++){
            
            r.push(formatDate(new Date(parseInt(ds[d].key)),"yyyy-mm-dd HH:mm:ss")+","+ds[d].value);
        }
      sources[data[s].name]=r;
    }

    return sources;
}

//Recibe un lista de objetos {key:"epoch",value:0} 
//retorna una lista de objetos {date:"yyyy-mm-dd HH:mm:ss",value:0} 
function getValuesByDate(data){
    let newData = [];
   
    for(let s = 0; s<data.length; s++){  
        newData.push(
            {date:formatDate(new Date(parseInt(data[s].key)),"yyyy-mm-dd HH:mm:ss"),
            value:data[s].value
        });
    
    }

    return newData;
}

function getTotals(searchResponse){
    let data = searchResponse;
    let m = data["AF-mentionsStatsTrend"].compoundWidgetData["AF-totalMentions"].number;
    let md = getValuesByDate(data["AF-mentionsStatsTrend"].compoundWidgetData["AF-mentionsTrend"].data);

    let a = data["AF-usersCountTrend"].compoundWidgetData["AF-totalMentions"].number;
    let ad = getValuesByDate(data["AF-usersCountTrend"].compoundWidgetData["AF-mentionsTrend"].data);

    let v = data["AF-viewsCountTrend"].compoundWidgetData["AF-twitterViews"].number;
    let vd = getValuesByDate(data["AF-viewsCountTrend"].compoundWidgetData["AF-twitterViewsByDate"].data);

    let r = data["AF-reachCountTrend"].compoundWidgetData["AF-twitterReach"].number;
    let rd = getValuesByDate(data["AF-reachCountTrend"].compoundWidgetData["AF-twitterReachByDate"].data);

    let i = data["AF-impressionsStatsTrend"].compoundWidgetData["AF-twitterImpressions"].number;
    let id = getValuesByDate(data["AF-impressionsStatsTrend"].compoundWidgetData["AF-twitterImpressionsByDate"].data);
    let rTotals =
    {
        a: a,
        ad:ad,
        m: m,
        md:md,
        i: i,
        id:id,
        v: v,
        vd:vd,
        r: r,
        rd:rd
    }
    return rTotals;
}


function getVizualizationNumber(searchResponse, visualizationIds){
    let data = searchResponse;
    for (let v = 0; v < visualizationIds.length; v++) {
        
        
    }
    let m = data["AF-mentionsStatsTrend"].compoundWidgetData["AF-totalMentions"].number;
    let a = data["AF-usersCountTrend"].compoundWidgetData["AF-twitterUniqueAuthors"].number;
    let v = data["AF-viewsCountTrend"].compoundWidgetData["AF-twitterViews"].number;
    let r = data["AF-reachCountTrend"].compoundWidgetData["AF-twitterReach"].number;
    let i = data["AF-impressionsStatsTrend"].compoundWidgetData["AF-twitterImpressions"].number;
    let rTotals =
    {
        a: a,
        m: m,
        i: i,
        v: v,
        r: r
    }
    return rTotals;
}

function getAuthors(responseUsers){
    let visualizations = responseUsers.visualizations;					
    let influencers = visualizations["AF-twitterInfluencers"];
    let documents = influencers.data.documents;					
    
    let rA = [];

    for(var u = 0; u < documents.length; u++){
        let img = documents[u].imageUrl;
        let n = documents[u].author.name;
        let sn = documents[u].author.handle;
        let followers = documents[u].author.followers;
        let followings = documents[u].author.followings;
        
        rA.push(
            {
                "nombre": n,
                "cuenta": sn,
                "imagen": img,
                "followers": followers,
                "followings": followings
            }
        )
    }

    return rA;
}

function getTopKeywords(searchResponse){
    let data = searchResponse;
    let topKeyWords = [];
    let wordsMelt = data["AF-topKeywords"].analytics.data;

    for (let index = 0; index < wordsMelt.length; index++) {
        topKeyWords.push({ name: wordsMelt[index].key ,weight: wordsMelt[index].value});
    }
    
    return topKeyWords;
  
}
