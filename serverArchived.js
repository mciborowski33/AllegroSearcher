const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const runner = require("child_process");
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const request = require('request');

const port = 80;
let globalSocket;


app.use('/img', express.static('img'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
server.listen(port, function(){
    console.log(`App listening on port ${port}!`);
    init();
    setInterval(function(){ init() }, 43200000);
});

const client_id = "fb6c73e8e50b480f8c27019029f48c0f";
const client_secret = 'OsucPMjJHv9rMNSm3fJwORUfjASJ3sEUO9u6MIyVkxB2RwZ4WcQlHC0fYZ1Za51d';
let access_token = '';

class ExitProduct{
    constructor(name,link,price,sellerId){
        this.name = name;
        this.link = 'https://allegro.pl/oferta/'+link;
        this.price = price;
        this.sellerId = sellerId;
    }
}

function init(){
    let options = {
      url: 'https://allegro.pl/auth/oauth/token?grant_type=client_credentials',
      headers: {
          'Authorization': 'Basic ' + Buffer.from(client_id+':'+client_secret).toString('base64')
      },
    };

    request.post(options, callback);

    function callback(error, response, body){
        console.log(body);
        access_token = JSON.parse(body).access_token;
    }
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function setURL(givenProductUrl, productName, minPrice, maxPrice)
{
  givenProductUrl += productName;

  minPriceString = "&price.from=" + minPrice;
  givenProductUrl += minPriceString;

  if( maxPrice != '0'){
      maxPriceString = "&price.to=" + maxPrice;
      givenProductUrl += maxPriceString;
  }

  sortTypeString = "&order=d";
  givenProductUrl += sortTypeString;

  givenProductUrl += "&stan=nowe&offerTypeBuyNow=1";

  console.log("URL = " + givenProductUrl);
  return givenProductUrl;
}

function getGivenProduct(givenProductUrl){

    try{
        let optionsQuery = {
          url: encodeURI(givenProductUrl),
          headers: {
              'Authorization': 'Bearer ' + access_token,
              'Accept': 'application/vnd.allegro.public.v1+json'
          },
        };

        return new Promise(function(resolve, reject) {
            request.get(optionsQuery, function(error, response, body){

                if(error)
                    reject(error);

                //console.log(body);
                console.log("JSON for product downloaded.");
                givenProductArray = JSON.parse(body);
                //console.log(givenProductArray[num].items.regular);
                resolve(givenProductArray);
            });
        });
    }
    catch{
        console.log("DOWNLOAD ERROR");
    }

}

function simplifyArrays(givenProductArray){

  givenProducts = [];
  numberOfSelectedProduct = givenProductArray.length;
  numberOfItems = [];
  sellersList = [];
  summaryCost = [];
  reputation = [];

  for (k = 0; k<numberOfSelectedProduct; k++ ){
      console.log("promowane");
      console.log(givenProductArray[k].items.promoted.length);
      console.log("regular");
      console.log(givenProductArray[k].items.regular.length);
      //if(givenProductArray[k].items.regular.length == 0){
      //  givenProducts[k] = givenProductArray[k].items.promoted;
      if(givenProductArray[k].items.promoted.length == 0 && givenProductArray[k].items.regular.length == 0){
        //givenProducts[k] = null;
        givenProducts[k] = givenProductArray[k].items.promoted;
        //givenProducts[k] =[];
        //givenProducts[k][0].id = 'null';
        console.log(givenProducts[k].length);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
        //moge tak? xd
      } else if(givenProductArray[k].items.promoted.length == 0){
        givenProducts[k] = givenProductArray[k].items.regular;
      } else if(givenProductArray[k].items.regular.length == 0){
        givenProducts[k] = givenProductArray[k].items.promoted;
      } else{
        givenProducts[k] = givenProductArray[k].items.regular;
        for (i = 0; i<givenProductArray[k].items.promoted.length; i++ ){
            givenProducts[k].push(givenProductArray[k].items.promoted[i]);
        }
        summaryCost[k] = [];

        //dodanie parametru totalCost
        for (j = 0; j < givenProducts[k].length; j++ ){
            //summaryCost[k][j] = givenProducts[k][j].delivery.lowestPrice.amount;
            summaryCost[k][j] = parseFloat(givenProducts[k][j].delivery.lowestPrice.amount) + parseFloat(givenProducts[k][j].sellingMode.price.amount);
            givenProducts[k][j].totalCost = summaryCost[k][j];
            //console.log(summaryCost[k][j]);
        }
        //algorytm sortowania po cenie
        givenProducts[k].sort((a, b) => (a.totalCost > b.totalCost) ? 1 : -1);
        //console.log(givenProducts[k]);

      }

  }
  console.log(givenProducts);
  //tu zamienic selectBest na getReputation jak chcecie zobaczyc ile mu schodzi
  //z pobraniem reputacji dla kazdego sprzedawcy
  //getReputation(givenProducts, 0, 0);
  selectBest(givenProducts);
}

function getReputation(givenProductArray, num, index){
  sellerId = givenProductArray[num][index].seller.id;
  //console.log(sellerId);
    let optionsQuery = {

      url: 'https://api.allegro.pl/users/' + sellerId + '/ratings-summary',
      headers: {
          'Authorization': 'Bearer ' + access_token,
          'Accept': 'application/vnd.allegro.public.v1+json'
      },
    };
    let sellerReputation = "";
    request.get(optionsQuery, function(error, response, body){
        //console.log("proba");
        sellerReputation = JSON.parse(body);
        givenProductArray[num][index].reputation = sellerReputation.recommendedPercentage;
        console.log(givenProductArray[num][index].reputation);
        //console.log("reputacja sprzedawcy");
        index+=1;
        if( index < givenProductArray[num].length ){
          getReputation(givenProductArray, num, index);
        }
        if( index == givenProductArray[num].length ){
          num = num+1;
          console.log("num");
          console.log(num);
          if ( num == givenProductArray.length ){
            console.log("selectBest");
            selectBest( givenProductArray );
          } else{
            getReputation(givenProductArray, num, 0);
          }
        }
        console.log("num i index");
        console.log(num);
        console.log(index);


        //console.log(sellerReputation);
        //return sellerReputation.recommendedPercentage;
    });
}

function getReputation2(sellerId){

  let optionsQuery = {
    url: 'https://api.allegro.pl/users/' + sellerId + '/ratings-summary',
    headers: {
        'Authorization': 'Bearer ' + access_token,
        'Accept': 'application/vnd.allegro.public.v1+json'
    },
  };

  request.get(optionsQuery, function(error, response, body){
      //console.log(body);
      console.log("JSON for sellerID " + sellerId + " downloaded.");
      sellerReputationJson = JSON.parse(body);
      //console.log(givenProductArray[num].items.regular);
      sellerReputation = sellerReputationJson.recommendedPercentage;
      console.log(sellerReputation);
      return sellerReputation;
  });

}

function selectBest(givenProducts){

    //console.log("DATA = " + JSON.stringify(givenProductArray[0]));
    //regularProducts = [];
    /*
    givenProducts = [];
    numberOfSelectedProduct = givenProductArray.length;
    numberOfItems = [];
    //numberOfPromotedItems = [];
    //numberOfRegularItems = [];
    sellersList = [];
    summaryCost = [];
    reputation = [];
    //delivery = 0;
    //price = 0;

        //reputacja

        reputation[k] = [];
        /*
        console.log("reputacja");
        for (j = 0; j < givenProducts[k].length; j++ ){
          sellerId = givenProducts[k][j].seller.id;
          console.log(sellerId);
          //reputation[k][j] = getReputation(sellerId);
          //sleep(100);
          console.log(getReputation(sellerId));
        }

        //givenProducts[k]
        //console.log(givenProducts[k]);
        numberOfItems[k] = givenProducts[k].length;
        console.log("wszystkie");
        console.log(numberOfItems[k]);
        //console.log(givenProducts[k]);
        sellersList[k] = [];

        for (j = 0; j < numberOfItems[k]; j++ ){
            sellersList[k][j] = givenProducts[k][j].seller.id;
        }

    }*/
    numberOfSelectedProduct = givenProducts.length;
    numberOfItems = [];
    sellersList = [];

    for (k = 0; k<numberOfSelectedProduct; k++ ){
      numberOfItems[k] = givenProducts[k].length;
      console.log("wszystkie");
      console.log(numberOfItems[k]);
      //console.log(givenProducts[k]);
      sellersList[k] = [];

      for (j = 0; j < numberOfItems[k]; j++ ){
          sellersList[k][j] = givenProducts[k][j].seller.id;
      }
    }
    //console.log(sellersList);
    differentsellers = true;
    //echo("czy sie powtarzaja?\n");
    for (k = 0; k < numberOfSelectedProduct; k++ ){
      for (j = 0; j < numberOfItems[k]; j++ ){
        for (n = k+1; n < numberOfSelectedProduct; n++){
          for (m = 0; m < numberOfItems[n]; m++ ){
            if (sellersList[k][j] == sellersList[n][m]) {
              console.log("Powtarzaja sie:\n");
              differentsellers = false;
            }
          }
        }
      }
    }
    exit = [];
    finalExit = '';
    console.log(givenProducts[2]);
    if (differentsellers == true) {
        console.log("nie powtarzaja sie");
        //name = givenProducts[0][0].name;
        //console.log(name);
        for (k =0; k <3; k++){
            exit[k] = [];
            for (j = 0; j < numberOfSelectedProduct; j++) {
              name = [];
              id = [];
              cost = [];
              sellerId = [];
              count = 0;
              for (i = 0; i < 3; i++) {
                if (givenProducts[j].length > 0){
                  a = i;
                  if(givenProducts[j].length == a){
                    //count = count +1;
                    a = a-1;
                  } else if(givenProducts[j].length < a){
                    a = a-2;
                  }
                  name[i] = givenProducts[j][a].name;
                  console.log(name[a]);
                  id[i] = givenProducts[j][a].id;
                  del = parseFloat(givenProducts[j][a].delivery.lowestPrice.amount);
                  pr = parseFloat(givenProducts[j][a].sellingMode.price.amount);
                  cost[i] = del + pr;
                  //cost[i] = parseFloat(givenProducts[j][i].delivery.lowestPrice.amount) + parseFloat(givenProducts[j][i].sellingMode.price.amount);
                  cost[i] = cost[i].toFixed(2);
                  console.log(parseFloat(givenProducts[j][a].delivery.lowestPrice.amount));
                  console.log(parseFloat(givenProducts[j][a].sellingMode.price.amount));
                  console.log(cost[i]);
                  sellerId[i] = givenProducts[j][a].seller.id;
                  //if(givenProducts[j].length == i+1) {
                  //  i = i-1;
                  //}

                } else {
                  console.log("else");
                  name[i] = "brak wynikow";
                  id[i] = "";
                  cost[i] = 0;
                  sellerId[i] =0;
                }

                //cost = parseFloat(givenProducts[j][0].delivery.lowestPrice.amount) + parseFloat(givenProducts[j][i].sellingMode.price.amount);

                //console.log(exit[k][j]);
                //exit[k][j] = new ExitProduct("imieproduktu", "link do produktu", "koszt produktu plus jego wysylka");
                //exit[k][j] = new ExitProduct(name[i], id[i], cost[i]);
                //console.log(exit[k][j]);
              }

              exit[k][j] = new ExitProduct(name[k], id[k], cost[k], sellerId[k]);
              /*
              console.log(sellerId[k]);
              reputation = getReputation2(sellerId[k]);
              sleep(1000);
              console.log("ania");
              if (reputation < 98){
                index = givenProducts[j].seller.id.indexOf(sellerId[k]);
                console.log(index);
              }
              */



              //exit[k][j] = new ExitProduct(name, id, cost);

            }
        }
        console.log(exit);
        finalExit = JSON.stringify(exit);
        console.log(finalExit);
    }

    return finalExit;
    //globalSocket.emit( 'results', finalExit );
}

io.on('connection', function (socket) {

    globalSocket = socket;
    socket.on('searchData', async function (data){

        givenProductUrl = 'https://api.allegro.pl/offers/listing?phrase=';

        json_array = JSON.parse(data).searchData;

        urlArray = [];
        for (k = 0; k < json_array.length; k++ ) {
          row = json_array[k];
          urlArray[k] = setURL(givenProductUrl, row.name, row.p_min, row.p_max);
        }

        let givenProductArray = [];

        for( i = 0; i < urlArray.length; i++ ){
            givenProductArray[i] = await getGivenProduct(urlArray[i]);
        }

        console.log("Gotowa tablica: " + givenProductArray.length);
    });
});
