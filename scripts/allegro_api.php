<?php

function getAccessToken(): String
{
    $authUrl = 'https://allegro.pl.allegrosandbox.pl/auth/oauth/token?grant_type=client_credentials';
    $clientId = "a2788f54019d4df6b0e5fb26ed83e4f2";
    $clientSecret = "ElbOONYZ7qYwpaCnfwqW27SKTKXjousSg9HpSBUsDdIUWDidP6HSwY2npQuXUhm9";

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


function getMainCategories(String $token): stdClass
{
    $getCategoriesUrl = "https://api.allegro.pl.allegrosandbox.pl/sale/categories";

    $ch = curl_init($getCategoriesUrl);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                 "Authorization: Bearer $token",
                 "Accept: application/vnd.allegro.public.v1+json"
    ]);

    $mainCategoriesResult = curl_exec($ch);
    $resultCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($mainCategoriesResult === false || $resultCode !== 200) {
        exit ("Something went wrong");
    }

    $categoriesList = json_decode($mainCategoriesResult);

    return $categoriesList;
}

function getGivenProduct(String $token, String $givenProductUrl): String
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
        exit ("Something went wrong");
    }

    $jsonSearchResult = json_decode($searchResult);
    return json_encode($jsonSearchResult);
}

/*
function setProductName(string $productName, string $givenProductUrl): String
{
  $givenProductUrl .= $productName;
  //echo $givenProductUrl;
  return $givenProductUrl;
}

function setMinPrice(float $minPrice, string $givenProductUrl): String
{
  $minPriceString = "&price.from=";
  $minPriceString .= $minPrice;
  $givenProductUrl .= $minPriceString;
  return $givenProductUrl;
}

function setMaxPrice(float $maxPrice, string $givenProductUrl): String
{
  $maxPriceString = "&price.to=";
  $maxPriceString .= $maxPrice;
  $givenProductUrl .= $maxPriceString;
  return $givenProductUrl;
}

function setSort(string $sortType, string $givenProductUrl): String
{
  $sortTypeString = "&order=";
  $sortTypeString .= $sortType;
  $givenProductUrl .= $sortTypeString;
  return $givenProductUrl;
}
*/

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
  //$sortTypeString .= $sortType;
  $givenProductUrl .= $sortTypeString;

  return $givenProductUrl;

}

function main()
{
    global $argc, $argv;
    $givenProductUrl = "https://api.allegro.pl.allegrosandbox.pl/offers/listing?phrase=";
    //$givenProductUrl = "https://api.allegro.pl.allegrosandbox.pl/users/43544063/ratings-summary";
    $mode = $argv[1];

    if( $mode == "1" ){
        $token = getAccessToken();
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
        /*
        $givenProductUrl = setProductName("t-shirt", $givenProductUrl);
        $givenProductUrl = setMinPrice(1, $givenProductUrl);
        $givenProductUrl = setMaxPrice(10000, $givenProductUrl);
        $givenProductUrl = setSort("d", $givenProductUrl);
        */
        //$givenProductUrl = setURL($givenProductUrl, "t-shirt", 1, 10000);
        echo("blablab");
        //for ($k = 0; $k < sizeof($json_array); $k++ ) {
        //  echo($urlArray[$k]);
        //}

        $givenProduct = getGivenProduct($token, $urlArray[0]);
        echo (strval($givenProduct));
    }

}

main();
?>
