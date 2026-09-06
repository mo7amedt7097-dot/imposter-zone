<?php
error_reporting(0);
ini_set('display_errors', '0');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$roomsDir = __DIR__ . '/rooms_data';
if (!file_exists($roomsDir)) {
    @mkdir($roomsDir, 0777, true);
}

// Security index file in rooms_data
if (file_exists($roomsDir) && !file_exists($roomsDir . '/index.html')) {
    @file_put_contents($roomsDir . '/index.html', 'Forbidden');
}

$action = $_GET['action'] ?? '';
$code = strtoupper(trim($_GET['code'] ?? ''));
$code = preg_replace('/[^A-Z0-9_-]/', '', $code);

if ($action === 'get' && !empty($code)) {
    $filePath = $roomsDir . '/' . $code . '.json';
    if (file_exists($filePath)) {
        $content = @file_get_contents($filePath);
        if ($content) {
            echo $content;
            exit();
        }
    }
    echo json_encode(['success' => true, 'room' => null]);
    exit();
}

if ($action === 'publish' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if ($payload) {
        $roomCode = strtoupper(trim($payload['code'] ?? $payload['roomCode'] ?? ''));
        $roomCode = preg_replace('/[^A-Z0-9_-]/', '', $roomCode);

        if (!empty($roomCode)) {
            $filePath = $roomsDir . '/' . $roomCode . '.json';
            $wrapped = [
                'success' => true,
                'room' => $payload,
                'code' => $roomCode,
                'players' => $payload['players'] ?? []
            ];
            $finalData = array_merge($payload, $wrapped);
            @file_put_contents($filePath, json_encode($finalData, JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'code' => $roomCode, 'room' => $payload]);
            exit();
        }
    }
    echo json_encode(['success' => false, 'error' => 'Invalid payload']);
    exit();
}

if ($action === 'delete' && !empty($code)) {
    $filePath = $roomsDir . '/' . $code . '.json';
    if (file_exists($filePath)) {
        @unlink($filePath);
    }
    echo json_encode(['success' => true]);
    exit();
}

// Fallback response
echo json_encode(['success' => true, 'status' => 'online']);
