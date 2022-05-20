<template>
    <div>
        <v-col cols="12">
            <v-data-table :headers="headers" :items="sktms" disable-pagination :options.sync="options"
                :server-items-length="totalSKTMs" :loading="loading" class="elevation-1 mb-2"
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
                        <a href="javascript:void(0)" class="primary--text" @click="ambil(item)"
                            style="text-decoration: none;">Cetak Surat <v-icon color="primary">mdi-printer</v-icon></a>
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
    </div>
</template>


<script>
import { DateTime } from 'luxon'

export default {
    name: 'SktmTable',
    data() {
        return {
            totalSKTMs: 0,
            sktms: [],
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
                this.getSKTMData()
            },
            deep: true,
        },
        search(value) {
            this.search = value
            this.page = 1
            this.getSKTMData()
        }
    },
    methods: {
        async getSKTMData() {
            this.loading = true
            await this.$axios.$get('http://localhost:3333/sktm', {
                params: {
                    limit: this.pageSize,
                    page: this.page - 1,
                    search: this.search
                }
            }).then(res => {
                this.getDisplaySKTM(res)
                this.totalSKTMs = res.meta.total
                this.loading = false
                this.totalPages = res.meta.last_page
            })
        },
        getDisplaySKTM(data) {
            this.sktms = data.data.map((sktm, i) => {
                let no = (data.meta.current_page - 1) * data.meta.per_page + 1 + i
                const tgl = DateTime.fromISO(sktm.created_at).toFormat('yyyy-LL-dd')
                const status = (sktm.status == 1) ? 'Disetujui' : (sktm.status == 2) ? 'Surat Sudah diambil' : 'Belum Diproses'
                return {
                    no: no,
                    id: sktm.id,
                    nama: sktm.nama,
                    statusCode: sktm.status,
                    status: status,
                    nik: sktm.nik,
                    tanggal: tgl
                };
            })
        },
        handlePageChange(value) {
            this.page = value;
            this.getSKTMData();
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.getSKTMData();
        },
        setuju(val) {
            const sktm = val
            console.log(sktm)
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin menyetujui permohonan SKTM " + sktm.nama,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '1')
                    return this.$axios.$put(`http://localhost:3333/sktm/status/${sktm.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + sktm.nama, 'error')
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
                    this.getSKTMData()
                }
            })
        },
        ambil(val) {
            const sktm = val
            console.log(sktm)
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin mengubah status permohonan SKTM " + sktm.nama + "menjadi sudah diambil?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    const fd = new FormData()
                    fd.append('status', '2')
                    return this.$axios.$put(`http://localhost:3333/sktm/status/${sktm.id}`, fd)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + sktm.nama, 'error')
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
                    this.getSKTMData()
                }
            })
        },

    },
    mounted() {
        this.getSKTMData()
    }
}
</script>