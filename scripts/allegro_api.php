<?php

function getAccessToken(): String
{
    $authUrl = 'https://allegro.pl.allegrosandbox.pl/auth/oauth/token?grant_type=client_credentials';
    $clientId = "a2788f54019d4df6b0e5fb26ed83e4f2";
    $clientSecret = "ElbOONYZ7qYwpaCnfwqW27SKTKXjousSg9HpSBUsDdIUWDidP6HSwY2npQuXUhm9";

    //$authUrl = 'https://allegro.pl/auth/oauth/token?grant_type=client_credentials';
    //$clientId = "a16004d41096431198bc9baf3d58aa0c";
    //$clientSecret = "ADTNwyWVNJKQ8YpJR4G4svF0mAA0aosD8FnNzcqgsRvquLU9X4fPdVczPjSvJBwq";

    $ch = curl_init($authUrl);

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_USERNAME, $clientId);
    curl_setopt($ch, CURLOPT_PASSWORD, $clientSecret);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $tokenResult = curl_exec($ch);
    $resultCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    //echo("hello world");
    //echo (strval($tokenResult));
    if ($tokenResult === false || $resultCode !== 200) {
        exit ("Something went wrongjjjjj23456");
    }

    $tokenObject = json_decode($tokenResult);

    return json_encode($tokenObject);
}

function getGivenProduct(String $token, String $givenProductUrl)//: String
{
    $ch = curl_init($givenProductUrl);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                 "Authorization: Bearer $token",
                 "Accept: application/vnd.allegro.public.v1+json"
    ]);

    $searchResult = curl_exec($ch);
    $resultCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($searchResult === false || $resultCode !== 200) {
        exit ("Something went wrong123");
    }

    $jsonSearchResult = json_decode($searchResult);
    //return json_encode($jsonSearchResult);
    return $jsonSearchResult;
}


function setURL(string $givenProductUrl, string $productName, string $minPrice, string $maxPrice): String
{
  $givenProductUrl .= $productName;

  $minPriceString = "&price.from=";
  $minPriceString .= $minPrice;
  $givenProductUrl .= $minPriceString;

  $maxPriceString = "&price.to=";
  $maxPriceString .= $maxPrice;
  $givenProductUrl .= $maxPriceString;

  $sortTypeString = "&order=p";
  $givenProductUrl .= $sortTypeString;

  return $givenProductUrl;

}

function selectBest($givenProductArray)
{
    $regularProducts = array();
    //$regularProducts = $givenProductArray(0)->items->regular;
    $len = sizeof($givenProductArray);
    echo($len);
    //echo("ania123");
    $numberOfItems = array();
    $sellersList = array();


    for ($k = 0; $k < $len; $k++ ){
      $numberOfItems[$k] = sizeof($givenProductArray[$k]->items->regular);
      for ($j = 0; $j < $numberOfItems[$k]; $j++ ){
        $sellersList[$j] = $givenProductArray[$k]->items->regular[$j]->seller->id;
        echo($sellersList[$j]);
        echo("\n");
      }
      //var_dump($givenProductArray[0]->items->regular[0]->seller);
      echo("\n");
      echo($numberOfItems[$k]);
      echo("ania");
      //echo ($sellersList[$k]);
    }
    $best['first'] = 0;
    $best['second'] = 1;
    $best['third'] = 2;
    return $best;
}



function main()
{
    global $argc, $argv;
    $givenProductUrl = "https://api.allegro.pl.allegrosandbox.pl/offers/listing?phrase=";
    //$givenProductUrl = "https://api.allegro.pl/offers/listing?phrase=";
    //$givenProductUrl = "https://api.allegro.pl.allegrosandbox.pl/users/43544063/ratings-summary";
    $mode = $argv[1];

    if( $mode == "1" ){
        $token = getAccessToken();
        //echo("token");
        echo (strval($token));
    }
    if( $mode == "2" ){
        $token = $argv[2];
        $data = $argv[3];
        //echo "blup";
        echo $data;
        $data = str_replace('/', '"', $data);
        echo $data;
        $json_data = json_decode($data);
        if (json_last_error() === JSON_ERROR_NONE) {
        //do something with $json. It's ready to use
        echo ("YES");
        } else {
        //yep, it's not JSON. Log error or alert someone or do nothing
        echo ("ERROR");
        }
        //echo (strval($json_data['searchData'][0]['name']));
        var_dump( $json_data );//->name;
        //$json_names = array_column($json_data, 'name');
        /*
        for ($k = 0; $k < 3; $k++) {
          echo $json_data[$k]->name;
          echo "blaaaaaa";
        }

        */
        $urlArray = array();
        $json_array = $json_data->searchData;
        echo( sizeof($json_array));
        for ($k = 0; $k < sizeof($json_array); $k++ ) {
          $productName = $json_array[$k]->name;
          $urlArray[$k] = setURL($givenProductUrl, $json_array[$k]->name, $json_array[$k]->p_min, $json_array[$k]->p_max);
        }
        //$productName = $json_array[0]->name;
        //echo($productName);
        //$givenProductUrl = setURL($givenProductUrl, "t-shirt", 1, 10000);
        echo("blablab");
        $givenProductArray = array();
        for ($k = 0; $k < sizeof($json_array); $k++ ) {
          //echo($urlArray[$k]);
          $givenProduct = getGivenProduct($token, $urlArray[$k]);
          $givenProductArray[$k] = $givenProduct;
          echo($k);
          echo(strval(json_encode($givenProduct)));

        }
        //echo(strval(selectBest($givenProductArray)['second']));
        //echo (strval($givenProduct));
        $best = array();
        $best = selectBest($givenProductArray);
    }

}

main();
?>
