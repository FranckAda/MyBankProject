<?php

use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__).'/vendor/autoload.php';

if (method_exists(Dotenv::class, 'bootEnv')) {
    (new Dotenv())->bootEnv(dirname(__DIR__).'/.env');
}

if ($_SERVER['APP_DEBUG']) {
    umask(0000);
}

$jwtDir = dirname(__DIR__).'/config/jwt';
$privateKey = $jwtDir.'/private.pem';
$publicKey = $jwtDir.'/public.pem';
$passphrase = $_SERVER['JWT_PASSPHRASE'] ?? 'bankapp_jwt_passphrase';

if (!is_dir($jwtDir)) {
    mkdir($jwtDir, 0777, true);
}

if (!file_exists($privateKey) || !file_exists($publicKey)) {
    $key = openssl_pkey_new([
        'private_key_bits' => 4096,
        'private_key_type' => OPENSSL_KEYTYPE_RSA,
    ]);

    openssl_pkey_export($key, $privKeyStr, $passphrase);
    file_put_contents($privateKey, $privKeyStr);

    $pubKey = openssl_pkey_get_details($key);
    file_put_contents($publicKey, $pubKey['key']);
}
