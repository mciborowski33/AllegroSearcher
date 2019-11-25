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

function getGivenProduct(String $token, String $givenProductUrl): stdClass
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
    return $jsonSearchResult;
}


function setProductName(string $productName): string
{
  $givenProductUrl .= $productName;
  return $productName;
}

function setMinPrice(float $minPrice): string
{
  $minPriceString = "&price.from=";
  $minPriceString .= $minPrice;
  $givenProductUrl .= $minPriceString;
  return $minPriceString;
}

function setMaxPrice(float $maxPrice): string
{
  $maxPriceString = "&price.to=";
  $maxPriceString .= $maxPrice;
  $givenProductUrl .= $maxPriceString;
  return $maxPriceString;
}

function setSort(string $sortType): string
{
  $sortTypeString = "&sort=+";
  $sortTypeString .= $sortType;
  $givenProductUrl .= $sortTypeString;
  return $sortTypeString;
}

function main()
{
    global $argc, $argv;
    $givenProductUrl = "https://api.allegro.pl.allegrosandbox.pl/offers/listing?phrase="

    $mode = $argv[1];

    if( $mode == "1" ){
        $token = getAccessToken();
        echo (strval($token));
    }
    if( $mode == "2" ){
        $token = $argv[2];
        $data = $argv[3];
        echo $data;
    }

    setProductName("samsung");
    setMinPrice(1000);
    setMaxPrice(1400.55);
    setSort("price");

    $givenProduct = getGivenProduct($token, $givenProductUrl);
    var_dump($givenProduct);
    //var_dump(getMainCategories($token));
}

main();
?>
