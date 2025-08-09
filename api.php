<?php
header('Content-Type: application/json');

$data_file = 'data_siswa.json';

// Fungsi untuk membaca data dari file JSON
function readData($file) {
    if (file_exists($file)) {
        return json_decode(file_get_contents($file), true);
    }
    return [];
}

// Fungsi untuk menulis data ke file JSON
function writeData($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];
$data_siswa = readData($data_file);

switch ($method) {
    case 'GET':
        // Mengirimkan semua data siswa
        echo json_encode($data_siswa);
        break;

    case 'POST':
        // Menambahkan data siswa baru
        $new_siswa = json_decode(file_get_contents('php://input'), true);
        if ($new_siswa) {
            $data_siswa[] = $new_siswa;
            writeData($data_file, $data_siswa);
            http_response_code(201); // Created
            echo json_encode(['message' => 'Data siswa berhasil ditambahkan']);
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => 'Data tidak valid']);
        }
        break;

    case 'DELETE':
        // Menghapus data siswa berdasarkan indeks
        $index = $_GET['index'] ?? null;
        if ($index !== null && isset($data_siswa[$index])) {
            array_splice($data_siswa, $index, 1);
            writeData($data_file, $data_siswa);
            echo json_encode(['message' => 'Data siswa berhasil dihapus']);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['message' => 'Data tidak ditemukan']);
        }
        break;
        
    case 'PUT':
        // Mengedit data siswa berdasarkan indeks
        $index = $_GET['index'] ?? null;
        $updated_siswa = json_decode(file_get_contents('php://input'), true);
        if ($index !== null && isset($data_siswa[$index]) && $updated_siswa) {
            $data_siswa[$index] = array_merge($data_siswa[$index], $updated_siswa);
            writeData($data_file, $data_siswa);
            echo json_encode(['message' => 'Data siswa berhasil diperbarui']);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['message' => 'Data tidak ditemukan atau tidak valid']);
        }
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['message' => 'Metode tidak diizinkan']);
        break;
}