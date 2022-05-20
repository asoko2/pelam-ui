<template>
    <v-col cols="12">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title class="text-h5">
                    Data Permohonan SKTM
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
                <SktmTable />

            </v-card-text>
        </v-card>
    </v-col>
</template>
<script>
import { DateTime } from 'luxon'
import SktmTableVue from '~/components/SktmTable.vue'
import SktmTable from '~/components/SktmTable.vue'

export default {
    layout: 'admin',
    components: {
        SktmTableVue,
        SktmTable
    },
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
                return {
                    no: no,
                    id: sktm.id,
                    nama: sktm.nama,
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
        hapus(val) {
            const sktm = val
            console.log(sktm)
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin untuk hapus data " + sktm.nama,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    return this.$axios.$delete(`http://localhost:3333/sktm/${sktm.id}`)
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
                    this.$swal.fire(
                        'Sukses!',
                        'Berhasil hapus data ' + sktm.nama,
                        'success'
                    )
                    this.getSKTMData()
                }
            })
        }
    },
    mounted() {
        this.getSKTMData()
    }

}
</script>