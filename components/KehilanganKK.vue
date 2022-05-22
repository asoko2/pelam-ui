<template>
    <v-card>
        <v-toolbar flat>
            <v-toolbar-title class="text-h5">
                Data Permohonan Kehilangan KK
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
                <v-data-table :headers="headers" :items="kks" disable-pagination :options.sync="options"
                    :server-items-length="totalKehilangans" :loading="loading" class="elevation-1 mb-2"
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
                            &nbsp;|&nbsp;
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
    name: 'KehilanganKKTable',
    data() {
        return {
            totalKehilangans: 0,
            kks: [],
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
                this.getKehilanganData()
            },
            deep: true,
        },
        search(value) {
            this.search = value
            this.page = 1
            this.getKehilanganData()
        }
    },
    methods: {
        async getKehilanganData() {
            this.loading = true
            await this.$axios.$get('http://localhost:3333/kehilangan-kk', {
                params: {
                    limit: this.pageSize,
                    page: this.page - 1,
                    search: this.search
                }
            }).then(res => {
                this.getDisplayKehilangan(res)
                this.totalKehilangans = res.meta.total
                this.loading = false
                this.totalPages = res.meta.last_page
            })
        },
        getDisplayKehilangan(data) {
            this.kks = data.data.map((kk, i) => {
                let no = (data.meta.current_page - 1) * data.meta.per_page + 1 + i
                const tgl = DateTime.fromISO(kk.created_at).toFormat('yyyy-LL-dd')
                const status = (kk.status == 1) ? 'Disetujui' : (kk.status == 2) ? 'Surat Sudah diambil' : 'Belum Diproses'
                return {
                    no: no,
                    id: kk.id,
                    nama: kk.nama,
                    statusCode: kk.status,
                    status: status,
                    nik: kk.nik,
                    tanggal: tgl
                };
            })
        },
        handlePageChange(value) {
            this.page = value;
            this.getKehilanganData();
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.getKehilanganData();
        },
        setuju(val) {
            const kk = val
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin menyetujui permohonan Kehilangan " + kk.nama,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '1')
                    return this.$axios.$put(`http://localhost:3333/kehilangan-kk/status/${kk.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + kk.nama, 'error')
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
                    this.getKehilanganData()
                }
            })
        },
        ambil(val) {
            const kk = val
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin mengubah status permohonan Kehilangan " + kk.nama + "menjadi sudah diambil?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '2')
                    return this.$axios.$put(`http://localhost:3333/kehilangan-kk/status/${kk.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + kk.nama, 'error')
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
                    this.getKehilanganData()
                }
            })
        },
        async cetak(id) {
            const data = await this.$axios.$get(`http://localhost:3333/kehilangan-kk/${id}`)
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
            doc.text('SURAT KETERANGAN', 85, 62)
            doc.line(85, 62.5, 134, 62.5)
            doc.text(`Nomor : 470/${data.kehilangan_kk[0].id}/413.313.06/${DateTime.now().year}`, 77, 67)
            doc.setFont('times', '', 400)
            doc.text('Yang Bertanda tangan di bawah ini :', 15, 78)
            doc.text('Nama', 20, 85)
            doc.text(':', 60, 85)
            doc.text('H. GATOT SUKOCO', 62, 85)
            doc.text('Alamat', 20, 91)
            doc.text(':', 60, 91)
            doc.text('Desa Karangtinggil, Kecamatan Pucuk, Kabupaten Lamongan', 62, 91)
            doc.text('Jabatan', 20, 97)
            doc.text(':', 60, 97)
            doc.text('Kepala Desa Karangtinggil, Kecamatan Pucuk, Kabupaten Lamongan', 62, 97)
            doc.text('Menerangkan dengan sebenarnya, bahwa : ', 20, 105)
            doc.text('Nama', 20, 112)
            doc.text(':', 60, 112)
            doc.text(data.kehilangan_kk[0].nama, 62, 112)
            doc.text('Tempat Lahir', 20, 119)
            doc.text(':', 60, 119)
            doc.text(data.kehilangan_kk[0].tempat_lahir, 62, 119)
            doc.text('Tanggal Lahir', 20, 126)
            doc.text(':', 60, 126)
            doc.text(DateTime.fromISO(data.kehilangan_kk[0].tanggal_lahir).toFormat('dd LLLL yyyy'), 62, 126)
            doc.text('NIK', 20, 133)
            doc.text(':', 60, 133)
            doc.text(data.kehilangan_kk[0].nik, 62, 133)
            doc.text('Jenis Kelamin', 20, 140)
            doc.text(':', 60, 140)
            doc.text(data.kehilangan_kk[0].jenis_kelamin, 62, 140)
            doc.text('Kewarganegaraan', 20, 147)
            doc.text(':', 60, 147)
            doc.text(data.kehilangan_kk[0].kewarganegaraan, 62, 147)
            doc.text('Agama', 20, 153)
            doc.text(':', 60, 153)
            doc.text(data.kehilangan_kk[0].agama, 62, 153)
            doc.text('Pekerjaan', 20, 160)
            doc.text(':', 60, 160)
            doc.text(data.kehilangan_kk[0].pekerjaan, 62, 160)
            doc.text('Alamat', 20, 167)
            doc.text(':', 60, 167)
            doc.text(data.kehilangan_kk[0].alamat, 62, 167)
            doc.text('Keterangan', 20, 173)
            doc.text(':', 60, 173)
            doc.text(data.kehilangan_kk[0].keterangan, 62, 173)
            doc.text('Demikian Surat Keterangan ini kami buat dengan sebenarnya dan untuk dipergunakan', 20, 180)
            doc.text('sebagaimana mestinya.', 15, 187)
            doc.text(`Karangtinggil, ${tanggal}`, 135, 193)
            doc.text('Pemohon', 25, 200)
            doc.text('Kepala Desa Karangtinggil', 135, 200)
            doc.text(data.kehilangan_kk[0].nama, 25, 230)
            doc.text('H. GATOT SUKOCO', 135, 230)
            const filename = `${tanggal} - Kehilangan KK - ${data.kehilangan_kk[0].nama}`
            doc.setDocumentProperties({ title: filename, subject: filename })
            window.open(doc.output('bloburl'), '_blank')
        },

    },
    mounted() {
        this.getKehilanganData()
    }
}
</script>