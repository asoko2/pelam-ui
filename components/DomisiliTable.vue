<template>
    <v-card>
        <v-toolbar flat>
            <v-toolbar-title class="text-h5">
                Data Permohonan Domisili
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
                <v-data-table :headers="headers" :items="domisilis" disable-pagination :options.sync="options"
                    :server-items-length="totalDomisilis" :loading="loading" class="elevation-1 mb-2"
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
                            <!-- <a :href="'/admin/permohonan-surat/domisili/print/' + item.id" target="_blank" class="primary--text"
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
    name: 'DomisiliTable',
    data() {
        return {
            totalDomisilis: 0,
            domisilis: [],
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
                this.getDomisiliData()
            },
            deep: true,
        },
        search(value) {
            this.search = value
            this.page = 1
            this.getDomisiliData()
        }
    },
    methods: {
        async getDomisiliData() {
            this.loading = true
            await this.$axios.$get('http://localhost:3333/domisili', {
                params: {
                    limit: this.pageSize,
                    page: this.page - 1,
                    search: this.search
                }
            }).then(res => {
                this.getDisplayDomisili(res)
                this.totalDomisilis = res.meta.total
                this.loading = false
                this.totalPages = res.meta.last_page
            })
        },
        getDisplayDomisili(data) {
            this.domisilis = data.data.map((domisili, i) => {
                let no = (data.meta.current_page - 1) * data.meta.per_page + 1 + i
                const tgl = DateTime.fromISO(domisili.created_at).toFormat('yyyy-LL-dd')
                const status = (domisili.status == 1) ? 'Disetujui' : (domisili.status == 2) ? 'Surat Sudah diambil' : 'Belum Diproses'
                return {
                    no: no,
                    id: domisili.id,
                    nama: domisili.nama,
                    statusCode: domisili.status,
                    status: status,
                    nik: domisili.nik,
                    tanggal: tgl
                };
            })
        },
        handlePageChange(value) {
            this.page = value;
            this.getDomisiliData();
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.getDomisiliData();
        },
        setuju(val) {
            const domisili = val
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin menyetujui permohonan Domisili " + domisili.nama,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '1')
                    return this.$axios.$put(`http://localhost:3333/domisili/status/${domisili.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + domisili.nama, 'error')
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
                    this.getDomisiliData()
                }
            })
        },
        ambil(val) {
            const domisili = val
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin mengubah status permohonan Domisili " + domisili.nama + "menjadi sudah diambil?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '2')
                    return this.$axios.$put(`http://localhost:3333/domisili/status/${domisili.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + domisili.nama, 'error')
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
                    this.getDomisiliData()
                }
            })
        },
        async cetak(id) {
            const data = await this.$axios.$get(`http://localhost:3333/domisili/${id}`)
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
            doc.text('SURAT KETERANGAN DOMISILI', 72, 62)
            doc.line(72, 62.5, 145, 62.5)
            doc.text(`Nomor : 470/${data.domisili[0].id}/413.309.06/${DateTime.now().year}`, 80, 67)
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
            doc.text('NIK', 20, 115)
            doc.text(':', 60, 115)
            doc.text(data.domisili[0].nik, 62, 115)
            doc.text('Nama', 20, 122)
            doc.text(':', 60, 122)
            doc.text(data.domisili[0].nama, 62, 122)
            doc.text('Tempat Lahir', 20, 129)
            doc.text(':', 60, 129)
            doc.text(data.domisili[0].tempat_lahir, 62, 129)
            doc.text('Tanggal Lahir', 20, 136)
            doc.text(':', 60, 136)
            doc.text(DateTime.fromISO(data.domisili[0].tanggal_lahir).toFormat('dd LLLL yyyy'), 62, 136)
            doc.text('Jenis Kelamin', 20, 143)
            doc.text(':', 60, 143)
            doc.text(data.domisili[0].jenis_kelamin, 62, 143)
            doc.text('Kewarganegaraan', 20, 150)
            doc.text(':', 60, 150)
            doc.text(data.domisili[0].kewarganegaraan, 62, 150)
            doc.text('Agama', 20, 157)
            doc.text(':', 60, 157)
            doc.text(data.domisili[0].agama, 62, 157)
            doc.text('Pekerjaan', 20, 163)
            doc.text(':', 60, 163)
            doc.text(data.domisili[0].pekerjaan, 62, 163)
            doc.text('Alamat', 20, 170)
            doc.text(':', 60, 170)
            doc.text(data.domisili[0].alamat, 62, 170)
            doc.text('Keterangan', 20, 177)
            doc.text(':', 60, 177)
            let lastY = 177
            data.keterangan.forEach((ket, index) => {
                lastY = (index > 0) ? lastY + 8 : lastY
                const kets = ket.keterangan.split(' ')
                let ketSplit = 0
                let keteres = []
                if (kets.length > 1) {
                    const ketLt = kets.join(' ').length
                    ketSplit = Math.ceil(ketLt / 70)
                    for (let i = 0; i < ketSplit; i++) {
                        let ketrs = []
                        for (let j = 0; j < kets.length; j++) {
                            ketrs.push(kets[j])
                            if (ketrs.join(' ').length > 70) {
                                const newK = kets.splice(0, j)
                                keteres.push(newK)
                            } else {
                                if (j == kets.length - 1) keteres.push(ketrs)
                            }
                        }
                    }
                    keteres.forEach((e, i) => {
                        lastY = (i > 0) ? lastY + 8 : lastY
                        if (i == 0) doc.text(`${index + 1}.`, 62, lastY)
                        doc.text(e.join(' '), 67, lastY)
                    })
                } else {
                    doc.text(`${index + 1}.`, 62, lastY)
                    doc.text(ket.keterangan, 67, lastY)
                }
            })
            lastY = lastY + 7
            doc.text('Keperluan', 20, lastY)
            doc.text(':', 60, lastY)
            doc.text(data.domisili[0].keperluan, 62, lastY)
            lastY = lastY + 7
            doc.text('Demikian Surat Keterangan ini kami buat dengan sebenarnya dan untuk dipergunakan', 20, lastY)
            lastY = lastY + 7
            doc.text('sebagaimana mestinya.', 15, lastY)
            lastY = lastY + 10
            doc.text(`Karangtinggil, ${tanggal}`, 135, lastY)
            lastY = lastY + 7
            doc.text('Pemohon', 25, lastY)
            doc.text('Kepala Desa Karangtinggil', 135, lastY)
            lastY = lastY + 37
            doc.text(data.domisili[0].nama, 25, lastY)
            doc.text('H. GATOT SUKOCO', 135, lastY)
            const filename = `${tanggal} - SKTM - ${data.domisili[0].nama}`
            doc.setDocumentProperties({ title: filename, subject: filename })
            window.open(doc.output('bloburl'), '_blank')
            // doc.save()
        },

    },
    mounted() {
        this.getDomisiliData()
    }
}
</script>