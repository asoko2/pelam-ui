<template>
    <v-row class="d-flex justify-center">
        <v-col cols="10">
            <v-card elevation="4" class="mx-auto">
                <v-toolbar flat>
                    <v-toolbar-title class="">
                        Data Pemohon
                    </v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-text-field solo append-icon="mdi-magnify" v-model="search" label="Cari kata kunci" single-line
                        hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" to="/admin/pemohon-surat/tambah-pemohon">Tambah Pemohon</v-btn>
                </v-toolbar>

                <v-divider></v-divider>

                <v-card-text>
                    <v-col cols="12">
                        <v-data-table :headers="headers" :items="pemohons" disable-pagination :options.sync="options"
                            :server-items-length="totalPemohons" :loading="loading" class="elevation-1 mb-2"
                            :hide-default-footer="true">
                            <template v-slot:[`item.actions`]="{ item }">
                                <router-link :to="'/admin/pemohon-surat/' + item.nik" class="primary--text"
                                    style="text-decoration: none;">
                                    Selengkapnya</router-link>
                                |
                                <router-link :to="'/admin/pemohon-surat/' + item.nik + '/edit'" class="primary--text"
                                    style="text-decoration: none;">
                                    Edit</router-link>
                                |
                                <a href="javascript:void(0)" class="primary--text" @click="hapus(item)"
                                    style="text-decoration: none;">Hapus</a>
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
                                <v-pagination v-model="page" :length="totalPages" total-visible="7"
                                    next-icon="mdi-menu-right" prev-icon="mdi-menu-left" @input="handlePageChange">
                                </v-pagination>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'PemohonSurat',
    layout: 'admin',
    data() {
        return {
            totalPemohons: 0,
            pemohons: [],
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
                { text: 'NIK', value: 'nik' },
                { text: 'Nama', value: 'nama' },
                { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
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
                this.getPemohonData()
            },
            deep: true,
        },
        search(value) {
            this.search = value
            this.page = 1
            this.getPemohonData()
        }
    },
    methods: {
        async getPemohonData() {
            this.loading = true
            await this.$axios.$get('http://localhost:3333/pemohon', {
                params: {
                    limit: this.pageSize,
                    page: this.page - 1,
                    search: this.search
                }
            }).then(res => {
                this.getDisplayPemohon(res)
                this.totalPemohons = res.meta.total
                this.loading = false
                this.totalPages = res.meta.last_page
            })
        },
        getDisplayPemohon(data) {
            this.pemohons = data.data.map((pemohon, i) => {
                let no = (data.meta.current_page - 1) * data.meta.per_page + 1 + i
                return {
                    no: no,
                    nama: pemohon.nama,
                    nik: pemohon.nik,
                    jenis_kelamin: pemohon.jenis_kelamin,
                };
            })
        },
        handlePageChange(value) {
            this.page = value;
            this.getPemohonData();
        },
        handlePageSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.getPemohonData();
        },
        hapus(pemohon) {
            const pem = pemohon
            this.$swal.fire({
                title: 'Peringatan?',
                text: "Apakah anda yakin untuk hapus data " + pemohon.nama,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#459EED',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (hapus) => {
                    return this.$axios.$delete(`http://localhost:3333/pemohon/${pem.nik}`)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            this.$swal.fire('Gagal!', 'Gagal hapus data' + pem.nama, 'error')
                        })
                },
            }).then((result) => {
                this.$swal.showLoading()
                if (result.isConfirmed) {
                    this.$swal.fire(
                        'Sukses!',
                        'Berhasil hapus data ' + pem.nama,
                        'success'
                    )
                    this.getPemohonData()
                }
            })
        }
    },
    mounted() {
        this.getPemohonData()
    }
}
</script>