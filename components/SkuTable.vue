<template>
    <v-card>
        <v-toolbar flat>
            <v-toolbar-title class="text-h5">
                Data Permohonan SKU
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field solo append-icon="mdi-magnify" v-model="search" label="Cari kata kunci" single-line
                hide-details>
            </v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" to="/admin/permohonan-surat/">Kembali</v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <v-col cols="12">
                <v-data-table :headers="headers" :items="skus" disable-pagination :options.sync="options"
                    :server-items-length="totalSKUs" :loading="loading" class="elevation-1 mb-2"
                    :hide-default-footer="true">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-row>
                            <div v-if="item.statusCode == 0">
                                <a href="javascript:void(0)" class="primary--text" @click="setuju(item)"
                                    style="text-decoration: none;">Disetujui</a>
                            </div>
                            <div v-else-if="item.statusCode == 1">
                                <a href="javascript:void(0)" class="primary--text" @click="ambil(item)"
                                    style="text-decoration: none;">Ambil Surat</a>
                            </div>
                            |&nbsp;
                            <!-- <a :href="'/admin/permohonan-surat/sku/print/' + item.id" target="_blank" class="primary--text"
                            style="text-decoration: none;">Cetak Surat <v-icon color="primary">
                                mdi-printer</v-icon></a> -->
                            <a href="javascript:void(0)" @click="cetak(item.id)" class="primary--text"
                                style="text-decoration: none;">Cetak Surat
                                <v-icon color="primary">
                                    mdi-printer</v-icon>
                            </a>
                        </v-row>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12">
                <v-row class="d-flex justify-between align-center">
                    Tampilkan
                    <v-col cols="1" sm="1">
                        <v-select v-model="pageSize" :items="pageSizes" @change="handlePageSizeChange">
                        </v-select>
                    </v-col>
                    <v-col cols="1">baris</v-col>
                    <v-col cols="8" sm="8" class="d-flex justify-end">
                        <v-pagination v-model="page" :length="totalPages" total-visible="7" next-icon="mdi-menu-right"
                            prev-icon="mdi-menu-left" @input="handlePageChange">
                        </v-pagination>
                    </v-col>
                </v-row>
            </v-col>
        </v-card-text>
    </v-card>
</template>


<script>
import { DateTime } from 'luxon'
import { jsPDF } from 'jspdf'

export default {
    name: 'SkuTable',
    data() {
        return {
            totalSKUs: 0,
            skus: [],
            loading: true,
            options: {},
            search: '',
            headers: [
                {
                    text: 'No',
                    align: 'start',
                    sortable: false,
                    value: 'no',
                },
                { text: 'Tanggal', value: 'tanggal' },
                { text: 'NIK', value: 'nik' },
                { text: 'Nama Lengkap', value: 'nama' },
                { text: 'Status', value: 'status' },
                { text: 'Aksi', value: 'actions' },
            ],
            pageSize: 5,
            pageSizes: [5, 10, 20, 50, 100],
            page: 1,
            totalPages: 0,
        }
    },
    watch: {
        options: {
            handler() {
                // this.getDataFromApi()
                this.getSKUData()
            },
            deep: true,
        },
        search(value) {
            this.search = value
            this.page = 1
            this.getSKUData()
        }
    },
    methods: {
        async getSKUData() {
            this.loading = true
            await this.$axios.$get('http://localhost:3333/sku', {
                params: {
                    limit: this.pageSize,
                    page: this.page - 1,
                    search: this.search
                }
            }).then(res => {
                this.getDisplaySKU(res)
                this.totalSKUs = res.meta.total
                this.loading = false
                this.totalPages = res.meta.last_page
            })
        },
        getDisplaySKU(data) {
            this.skus = data.data.map((sku, i) => {
                let no = (data.meta.current_page - 1) * data.meta.per_page + 1 + i
                const tgl = DateTime.fromISO(sku.created_at).toFormat('yyyy-LL-dd')
                const status = (sku.status == 1) ? 'Disetujui' : (sku.status == 2) ? 'Surat Sudah diambil' : 'Belum Diproses'
                return {
                    no: no,
                    id: sku.id,
                    nama: sku.nama,
                    statusCode: sku.status,
                    status: status,
                    nik: sku.nik,
                    tanggal: tgl
                };
            })
        },
        handlePageChange(value) {
            this.page = value;
            this.getSKUData();
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.getSKUData();
        },
        setuju(val) {
            const sku = val
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin menyetujui permohonan SKU " + sku.nama,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '1')
                    return this.$axios.$put(`http://localhost:3333/sku/status/${sku.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + sku.nama, 'error')
                            this.$swal.hideLoading()
                        })
                },
            }).then((result) => {
                this.$swal.showLoading()
                if (result.isConfirmed) {
                    const Toast = this.$swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        showCloseButton: true,
                        background: '#7C9885',
                        color: 'white',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', this.$swal.stopTimer)
                            toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'success',
                        title: 'Sukses menyetujui permohonan'
                    })
                    this.getSKUData()
                }
            })
        },
        ambil(val) {
            const sku = val
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin mengubah status permohonan SKU " + sku.nama + "menjadi sudah diambil?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '2')
                    return this.$axios.$put(`http://localhost:3333/sku/status/${sku.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + sku.nama, 'error')
                            this.$swal.hideLoading()
                        })
                },
            }).then((result) => {
                this.$swal.showLoading()
                if (result.isConfirmed) {
                    const Toast = this.$swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        showCloseButton: true,
                        background: '#7C9885',
                        color: 'white',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', this.$swal.stopTimer)
                            toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'success',
                        title: 'Sukses menyetujui permohonan'
                    })
                    this.getSKUData()
                }
            })
        },
        async cetak(id) {
            const data = await this.$axios.$get(`http://localhost:3333/sku/${id}`)
            const doc = new jsPDF('p', 'mm', [330, 210])
            const tanggal = DateTime.now().toFormat('yyyy-LL-dd')
            doc.addImage("/logo.png", 'PNG', 10, 10, 35, 40)
            doc.setFont('times', '', 700)
            doc.setFontSize(14)
            doc.text('PEMERINTAH KABUPATEN LAMONGAN', 60, 15)
            doc.text('KECAMATAN PUCUK', 87, 23)
            doc.text('DESA KARANGTINGGIL', 83, 31)
            doc.text('Jalan Karya No 37 Karangtinggil 62257', 67, 39)
            doc.text('Email : pemdeskarangtinggil@gmail.com', 65, 47)
            doc.line(10, 52, 200, 52)
            doc.line(10, 53, 200, 53)
            doc.setFont('times', '', 700)
            doc.setFontSize(13)
            doc.text('SURAT KETERANGAN USAHA', 77, 62)
            doc.line(77, 62.5, 144, 62.5)
            doc.text(`Nomor : 470/${data.sku[0].id}/413.303.06/${DateTime.now().year}`, 80, 67)
            doc.setFont('times', '', 400)
            doc.text('Yang Bertanda tangan di bawah ini Kepala Desa Karangtinggil, Kecamatan Pucuk', 20, 78)
            doc.text('Kabupaten Lamongan, Dengan ini menerangkan bahwa : ', 15, 85)
            doc.text('NIK', 20, 92)
            doc.text(':', 60, 92)
            doc.text(data.sku[0].nik, 62, 92)
            doc.text('Nama', 20, 99)
            doc.text(':', 60, 99)
            doc.text(data.sku[0].nama, 62, 99)
            doc.text('Tempat Lahir', 20, 106)
            doc.text(':', 60, 106)
            doc.text(data.sku[0].tempat_lahir, 62, 106)
            doc.text('Tanggal Lahir', 20, 113)
            doc.text(':', 60, 113)
            doc.text(DateTime.fromISO(data.sku[0].tanggal_lahir).toFormat('dd LLLL yyyy'), 62, 113)
            doc.text('Kewarganegaraan', 20, 120)
            doc.text(':', 60, 120)
            doc.text(data.sku[0].kewarganegaraan, 62, 120)
            doc.text('Agama', 20, 127)
            doc.text(':', 60, 127)
            doc.text(data.sku[0].agama, 62, 127)
            doc.text('Alamat', 20, 133)
            doc.text(':', 60, 133)
            doc.text(data.sku[0].alamat, 62, 133)
            doc.text('Benar nama tersebut mempunyai Usaha dengan Keterangan sebagai berikut', 20, 140)
            doc.text('Nama Usaha', 20, 147)
            doc.text(':', 60, 147)
            doc.text(data.sku[0].nama_usaha, 62, 147)
            doc.text('Jenis Usaha', 20, 153)
            doc.text(':', 60, 153)
            doc.text(data.sku[0].jenis_usaha, 62, 153)
            doc.text('Alamat Usaha', 20, 160)
            doc.text(':', 60, 160)
            doc.text(data.sku[0].alamat_usaha, 62, 160)
            doc.text('Demikian Surat Keterangan Usaha ini kami buat dengan sebenarnya dan untuk dipergunakan', 20, 167)
            doc.text('sebagaimana mestinya.', 15, 173)
            doc.text(`Karangtinggil, ${tanggal}`, 135, 180)
            doc.text('Pemohon', 25, 187)
            doc.text('Kepala Desa Karangtinggil', 135, 187)
            doc.text(data.sku[0].nama, 25, 220)
            doc.text('H. GATOT SUKOCO', 135, 220)
            const filename = `${tanggal} - SKU - ${data.sku[0].nama}`
            doc.setDocumentProperties({ title: filename, subject: filename })
            window.open(doc.output('bloburl'), '_blank')
            // doc.save()
        },

    },
    mounted() {
        this.getSKUData()
    }
}
</script>