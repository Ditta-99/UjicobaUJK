document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-data-siswa');
    const tableBody = document.getElementById('data-siswa-body');

    let globalDataSiswa = [];

    // Fungsi untuk memuat data dari api.php
    async function loadData() {
        try {
            const response = await fetch('api.php');
            const dataSiswa = await response.json();

            globalDataSiswa = dataSiswa; 

            tableBody.innerHTML = '';
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
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    // Jika kita di halaman form, tambahkan event listener untuk submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newSiswa = {
                kodeSiswa: document.getElementById('kodeSiswa').value,
                namaSiswa: document.getElementById('namaSiswa').value,
                alamatSiswa: document.getElementById('alamatSiswa').value,
                tglSiswa: document.getElementById('tglSiswa').value,
                jurusanSiswa: document.getElementById('jurusanSiswa').value
            };
            
            try {
                const response = await fetch('api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newSiswa)
                });
                
                if (response.ok) {
                    alert('Data siswa berhasil ditambahkan!');
                    form.reset();
                    window.location.href = 'tabel_data_siswa.html';
                } else {
                    alert('Gagal menambahkan data.');
                }
            } catch (error) {
                console.error('Error posting data:', error);
            }
        });
    }

    // Jika kita di halaman tabel, muat datanya
    if (tableBody) {
        loadData();
    }

    // Fungsi global untuk menghapus data
    window.deleteData = async function(index) {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                const response = await fetch(`api.php?index=${index}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Data berhasil dihapus.');
                    loadData();
                } else {
                    alert('Gagal menghapus data.');
                }
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    };
    
    // Fungsi global untuk mengedit data (saat ini hanya alert)
    window.editData = function(index) {
        const siswa = globalDataSiswa[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editKodeSiswa').value = siswa.kodeSiswa;
        document.getElementById('editNamaSiswa').value = siswa.namaSiswa;
        document.getElementById('editAlamatSiswa').value = siswa.alamatSiswa;
        document.getElementById('editTglSiswa').value = siswa.tglSiswa;
        document.getElementById('editJurusanSiswa').value = siswa.jurusanSiswa;

        // Tampilkan modal
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    };
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const index = document.getElementById('editIndex').value;
    const updatedSiswa = {
        kodeSiswa: document.getElementById('editKodeSiswa').value,
        namaSiswa: document.getElementById('editNamaSiswa').value,
        alamatSiswa: document.getElementById('editAlamatSiswa').value,
        tglSiswa: document.getElementById('editTglSiswa').value,
        jurusanSiswa: document.getElementById('editJurusanSiswa').value
    };

    try {
        const response = await fetch(`api.php?index=${index}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSiswa)
        });

        if (response.ok) {
            alert('Data berhasil diperbarui!');
            location.reload();
        } else {
            alert('Gagal memperbarui data.');
        }
    } catch (error) {
        console.error('Error updating data:', error);
    }
});
