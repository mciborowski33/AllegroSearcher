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

function main()
{
    global $argc, $argv;
    //$givenProductUrl = "https://api.allegro.pl.allegrosandbox.pl/offers/listing?phrase=";
    $givenProductUrl = "https://api.allegro.pl.allegrosandbox.pl/users/43544063/ratings-summary";
    $mode = $argv[1];

    if( $mode == "1" ){
        $token = getAccessToken();
        echo (strval($token));
    }
    if( $mode == "2" ){
        $token = $argv[2];
        $data = $argv[3];
        //echo $data;
        //$givenProductUrl = setProductName("t-shirt", $givenProductUrl);
        //$givenProductUrl = setMinPrice(1, $givenProductUrl);
        //$givenProductUrl = setMaxPrice(10000, $givenProductUrl);
        //$givenProductUrl = setSort("p", $givenProductUrl);
        //echo $givenProductUrl;
        $givenProduct = getGivenProduct($token, $givenProductUrl);
        echo (strval($givenProduct));
    }

}

main();
?>
