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

    return $tokenObject->access_token;
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

function main()
{
    $token = getAccessToken();
    var_dump(getMainCategories($token));

}

main();
?>
