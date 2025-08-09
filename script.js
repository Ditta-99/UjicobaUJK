// Tunggu sampai seluruh konten halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen form dan tbody tabel
    const form = document.getElementById('form-data-siswa');
    const tableBody = document.getElementById('data-siswa-body');

    // Variabel global untuk menyimpan data siswa yang sudah dimuat
    let globalDataSiswa = [];

    // Fungsi untuk memuat data siswa dari file api.php (GET request)
    async function loadData() {
        try {
            // Kirim permintaan untuk mendapatkan data
            const response = await fetch('api.php');
            const dataSiswa = await response.json(); // Parsing JSON dari response

            globalDataSiswa = dataSiswa; // Simpan data ke variabel global

            // Bersihkan isi tabel sebelum menampilkan data baru
            tableBody.innerHTML = '';

            // Loop data dan tampilkan di dalam tabel
            dataSiswa.forEach((siswa, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${siswa.kodeSiswa}</td>
                    <td>${siswa.namaSiswa}</td>
                    <td>${siswa.alamatSiswa}</td>
                    <td>${siswa.tglSiswa}</td>
                    <td>${siswa.jurusanSiswa}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editData(${index})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteData(${index})">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(row); // Tambahkan baris ke tabel
            });
        } catch (error) {
            console.error('Error fetching data:', error); // Tangani error
        }
    }

    // Cek apakah ada form pada halaman (jika kita di halaman form)
    if (form) {
        // Tambahkan event listener ketika form disubmit
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Cegah reload halaman

            // Ambil nilai dari input form
            const newSiswa = {
                kodeSiswa: document.getElementById('kodeSiswa').value,
                namaSiswa: document.getElementById('namaSiswa').value,
                alamatSiswa: document.getElementById('alamatSiswa').value,
                tglSiswa: document.getElementById('tglSiswa').value,
                jurusanSiswa: document.getElementById('jurusanSiswa').value
            };

            try {
                // Kirim data baru ke API (POST request)
                const response = await fetch('api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newSiswa)
                });

                if (response.ok) {
                    alert('Data siswa berhasil ditambahkan!');
                    form.reset(); // Reset form setelah submit
                    window.location.href = 'tabel_data_siswa.html'; // Redirect ke halaman tabel
                } else {
                    alert('Gagal menambahkan data.');
                }
            } catch (error) {
                console.error('Error posting data:', error);
            }
        });
    }

    // Jika kita di halaman tabel, jalankan fungsi loadData
    if (tableBody) {
        loadData();
    }

    // Fungsi global untuk menghapus data
    window.deleteData = async function (index) {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                // Kirim permintaan DELETE ke API
                const response = await fetch(`api.php?index=${index}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Data berhasil dihapus.');
                    loadData(); // Muat ulang data setelah hapus
                } else {
                    alert('Gagal menghapus data.');
                }
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    };

    // Fungsi global untuk mengisi form edit dan menampilkan modal edit
    window.editData = function (index) {
        // Ambil data siswa berdasarkan index
        const siswa = globalDataSiswa[index];

        // Isi nilai ke dalam form edit
        document.getElementById('editIndex').value = index;
        document.getElementById('editKodeSiswa').value = siswa.kodeSiswa;
        document.getElementById('editNamaSiswa').value = siswa.namaSiswa;
        document.getElementById('editAlamatSiswa').value = siswa.alamatSiswa;
        document.getElementById('editTglSiswa').value = siswa.tglSiswa;
        document.getElementById('editJurusanSiswa').value = siswa.jurusanSiswa;

        // Tampilkan modal edit menggunakan Bootstrap
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    };
});

// Tambahkan event listener ketika form edit disubmit
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Cegah reload halaman

    // Ambil data yang telah diubah dari form
    const index = document.getElementById('editIndex').value;
    const updatedSiswa = {
        kodeSiswa: document.getElementById('editKodeSiswa').value,
        namaSiswa: document.getElementById('editNamaSiswa').value,
        alamatSiswa: document.getElementById('editAlamatSiswa').value,
        tglSiswa: document.getElementById('editTglSiswa').value,
        jurusanSiswa: document.getElementById('editJurusanSiswa').value
    };

    try {
        // Kirim data yang sudah diedit ke server (PUT request)
        const response = await fetch(`api.php?index=${index}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSiswa)
        });

        if (response.ok) {
            alert('Data berhasil diperbarui!');
            location.reload(); // Reload halaman agar data baru muncul
        } else {
            alert('Gagal memperbarui data.');
        }
    } catch (error) {
        console.error('Error updating data:', error);
    }
});


// // Penjelasan Singkat Perintah Kodingan
// | Bagian                                | Fungsi                                                    |
// | ------------------------------------- | --------------------------------------------------------- |
// | `loadData()`                          | Mengambil dan menampilkan data siswa ke tabel             |
// | `form.addEventListener('submit')`     | Menambahkan data baru                                     |
// | `deleteData(index)`                   | Menghapus data berdasarkan index                          |
// | `editData(index)`                     | Mengisi form edit dengan data siswa dan menampilkan modal |
// | `editForm.addEventListener('submit')` | Menyimpan perubahan data siswa yang diedit                |
