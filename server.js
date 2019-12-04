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
    constructor(name,link,price){
        this.name = name;
        this.link = link;
        this.price = price;
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

  console.log("URL = " + givenProductUrl);
  return givenProductUrl;
}

function getGivenProduct(givenProductUrl, givenProductArray, num){

    let optionsQuery = {
      url: givenProductUrl[num],
      headers: {
          'Authorization': 'Bearer ' + access_token,
          'Accept': 'application/vnd.allegro.public.v1+json'
      },
    };

    request.get(optionsQuery, function(error, response, body){
        //console.log(body);
        console.log("JSON for product " + num + " downloaded.");
        givenProductArray[num] = JSON.parse(body);
        //console.log(givenProductArray[num].items.regular);
        num+=1;
        if( num == givenProductUrl.length )
            selectBest( givenProductArray );
        if( num < givenProductUrl.length )
            getGivenProduct(givenProductUrl, givenProductArray, num);
    });

}

function getSellerReputation(sellerId){

    let optionsQuery = {
      url: 'https://api.allegro.pl.allegrosandbox.pl/users/43974801/ratings-summary',
      headers: {
          'Authorization': 'Bearer ' + access_token,
          'Accept': 'application/vnd.allegro.public.v1+json'
      },
    };
    let tmp = "";
    request.get(optionsQuery, function(error, response, body){
        //console.log(body);
        tmp = JSON.parse(body);
        return tmp;
    });
}

function selectBest(givenProductArray){

    //console.log("DATA = " + JSON.stringify(givenProductArray[0]));
    regularProducts = [];
    givenProducts = [];
    numberOfSelectedProduct = givenProductArray.length;
    numberOfItems = [];
    numberOfPromotedItems = [];
    numberOfRegularItems = [];
    sellersList = [];
    deliveryCosts = [];
/*
    for (k = 0; k<numberOfSelectedProduct; k++ ){
        givenProducts[k] = givenProductArray[k].items.promoted;
        givenProducts[k].push(givenProductArray[k].items.regular);
        //console.log(givenProducts[k]);
    }*/

    for (k = 0; k<numberOfSelectedProduct; k++ ){
        console.log("promowane");
        console.log(givenProductArray[k].items.promoted.length);
        console.log("regular");
        console.log(givenProductArray[k].items.regular.length);
        if(givenProductArray[k].items.regular.length == 0){
          givenProducts[k] = givenProductArray[k].items.promoted;
        } else if(givenProductArray[k].items.promoted.length == 0){
          givenProducts[k] = givenProductArray[k].items.regular;
        } else if(givenProductArray[k].items.promoted.length == 0 && givenProductArray[k].items.regular.length == 0){
          givenProducts[k] = null;
          //moge tak? xd
        } else{
          givenProducts[k] = givenProductArray[k].items.regular;
          for (i = 0; i<givenProductArray[k].items.promoted.length; i++ ){
              givenProducts[k].push(givenProductArray[k].items.promoted[i]);
          }
          deliveryCosts[k] = [];
          //algorytm sortowania po cenie
          //givenProducts[k].sort((a, b) => (a[k].delivery.))
          console.log("delivery.lowestPrice");
          for (j = 0; j < givenProducts[k].length; j++ ){
              //deliveryCosts[k][j] = givenProducts[k][j].delivery.lowestPrice.amount;
              deliveryCosts[k][j] = givenProducts[k][j].delivery.lowestPrice.amount + givenProducts[k][j].sellingMode.price.amount;
              console.log("for sie wypelnia");
              console.log(deliveryCosts[k][j]);
          }

        }

        //console.log(givenProducts[k]);

        //console.log(givenProducts[k]);
        //numberOfPromotedItems[k] = givenProductArray[k].items.promoted.length;
        //numberOfRegularItems[k] = givenProductArray[k].items.regular.length;
        //numberOfItems[k] = numberOfPromotedItems[k] + numberOfRegularItems[k];
        numberOfItems[k] = givenProducts[k].length;
        //console.log(numberOfPromotedItems[k]);
        //console.log(numberOfRegularItems[k]);
        console.log("wszystkie");
        console.log(numberOfItems[k]);
        //console.log(givenProducts[k]);
        sellersList[k] = [];
        /*
        for (j = 0; j < numberOfPromotedItems[k]; j++ ){
            sellersList[k][j] = givenProductArray[k].items.promoted[j].seller.id;
        }
        for (j = numberOfPromotedItems[k]; j < numberOfItems[k]; j++){
            sellersList[k][j] = givenProductArray[k].items.regular[j].seller.id;
        }
        */
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
              //console.log(sellersList[k][j]);
              //console.log("---");
              //console.log(sellersList[n][m]);
              //echo("dziala tak\n");
              //echo($sellersList[$k][$j]);
              //echo("---");
              //echo($sellersList[$n][$m]);
              //echo("\n");
              differentsellers = false;
            }
          }
        }
      }
    }
    exit = [];
    finalExit = '';
    if (differentsellers == true) {
        //echo("taaaaak");
        console.log("nie powtarzaja sie");
        for (k =0; k <3; k++){
            exit[k] = [];
            for (j = 0; j < numberOfSelectedProduct; j++) {
                exit[k][j] = new ExitProduct("imieproduktu", "link do produktu", "koszt produktu plus jego wysylka");
            }
        }
        finalExit = JSON.stringify(exit);
        console.log(finalExit);
    }

    globalSocket.emit( 'results', finalExit );
}

io.on('connection', function (socket) {

    globalSocket = socket;
    socket.on('searchData', function (data){

        givenProductUrl = 'https://api.allegro.pl/offers/listing?phrase=';

        json_array = JSON.parse(data).searchData;

        urlArray = [];
        for (k = 0; k < json_array.length; k++ ) {
          row = json_array[k];
          urlArray[k] = setURL(givenProductUrl, row.name, row.p_min, row.p_max);
        }

        let givenProductArray = [];

        getGivenProduct(urlArray, givenProductArray, 0);
    });
});
