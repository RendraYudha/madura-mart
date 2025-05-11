<?php

/*Install Midtrans PHP Library (https://github.com/Midtrans/midtrans-php)
composer require midtrans/midtrans-php

Alternatively, if you are not using **Composer**, you can download midtrans-php library 
(https://github.com/Midtrans/midtrans-php/archive/master.zip), and then require 
the file manually.   

require_once dirname(__FILE__) . '/pathofproject/Midtrans.php'; */
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';

//SAMPLE REQUEST START HERE

// Set your Merchant Server Key
\Midtrans\Config::$serverKey = 'SB-Mid-server-dTupt1k1b70QgnjT-zuDngko';
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
\Midtrans\Config::$isProduction = false;
// Set sanitization on (default)
\Midtrans\Config::$isSanitized = true;
// Set 3DS transaction for credit card to true
\Midtrans\Config::$is3ds = true;

// 1. Terima data JSON dari frontend
$rawData = file_get_contents('php://input');
$postData = json_decode($rawData, true);

// 2. Validasi data wajib
if (empty($postData['customer'])) {
    die(json_encode(['error' => 'Data customer tidak ditemukan']));
};

$params = array(
    'transaction_details' => array(
        'order_id' => $postData['customer']['customerOrderId'],
        'gross_amount' => $postData['customer']['customerTagihan']
    ),
    'item_details' => array_map(function ($item) {
        return [
            'id' => $item['id'],
            'price' => $item['price'],
            'quantity' => $item['quantity'],
            'name' => $item['name']
        ];
    }, $postData['items']),
    'customer_details' => [
        'first_name' => explode(' ', $postData['customer']['customerName'])[0],
        'last_name' => explode(' ', $postData['customer']['customerName'])[1] ?? '',
        'email' => $postData['customer']['customerEmail'],
        'phone' => $postData['customer']['customerPhone'],
        'billing_address' => [
            'address' => $postData['customer']['customerAddress']
        ]
    ]
);

// 5. Dapatkan Snap Token
try {
    $snapToken = Midtrans\Snap::getSnapToken($params);
    echo $snapToken;
} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => $e->getMessage()]);
}
