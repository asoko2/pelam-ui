<template>
    <v-col cols="12" class="d-flex flex-column align-center justify-space-between">
        <h1>Daftar Permohonan Surat SKTM</h1>
        <v-col cols="6">
            <v-card class="mb-2">
                <v-card-text>
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td>Urut Berdasarkan</td>
                                    <td>:</td>
                                    <td>
                                        <v-select solo></v-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tanggal</td>
                                    <td>:</td>
                                    <td>
                                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="tanggal_lahir" label="Tanggal Lahir"
                                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" solo>
                                                </v-text-field>
                                            </template>
                                            <v-date-picker v-model="tanggal_lahir" @input="menu = false">
                                            </v-date-picker>
                                        </v-menu>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Bulan</td>
                                    <td>:</td>
                                    <td>
                                        <v-select :items="months" item-text="text" item-value="value" v-model="bulan"
                                            solo label="Bulan"></v-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tahun</td>
                                    <td>:</td>
                                    <td class="">
                                        <v-select :items="years" v-model="tahun" label="Tahun" solo>
                                        </v-select>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
            <v-btn color="primary">Tampilkan</v-btn>
            <v-btn color="secondary">Reset</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="10" class="d-flex justify-end">
            <v-btn color="primary" @click="cetak">
                <vueJsonExcelUmd class="btn btn-default" :data="json_data" :fields="json_fields"
                    worksheet="My Worksheet" :name="filename">CETAK</vueJsonExcelUmd>
            </v-btn>
        </v-col>
        <v-col cols="10">
            <v-card>
                <v-card-text>
                    <v-col cols="12">
                        <v-data-table :headers="headers" :items="sktms" disable-pagination :options.sync="options"
                            :server-items-length="totalSKTMs" :loading="loading" class="elevation-1 mb-2"
                            :hide-default-footer="true">
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
    </v-col>
</template>

<script>
import { DateTime } from 'luxon'
import vueJsonExcelUmd from 'vue-json-excel';

export default {
    layout: 'admin',
    mounted() {
        this.getSKTMData()
        const date = new Date()
        const year = date.getFullYear()
        this.years = this.getYear(year - 50)
        this.generateFileName()
    },
    components: {
        vueJsonExcelUmd
    },
    data() {
        return {
            filename: '',
            // json_fields: {
            //     'Complete name': 'name',
            //     City: 'city',
            //     Telephone: 'phone.mobile',
            //     'Telephone 2': {
            //         field: 'phone.landline',
            //         callback: (value) => {
            //             return `Landline Phone - ${value}`
            //         },
            //     },
            // },
            json_fields: {
                No: 'no',
                'Tanggal': 'tanggal',
                'NIK': 'nik',
                'Nama': 'nama',
                'Keperluan': 'keperluan',
                'Status': 'status'
            },
            // json_data: [
            //     {
            //         name: 'Tony Peña',
            //         city: 'New York',
            //         country: 'United States',
            //         birthdate: '1978-03-15',
            //         phone: {
            //             mobile: '1-541-754-3010',
            //             landline: '(541) 754-3010',
            //         },
            //     },
            //     {
            //         name: 'Thessaloniki',
            //         city: 'Athens',
            //         country: 'Greece',
            //         birthdate: '1987-11-23',
            //         phone: {
            //             mobile: '+1 855 275 5071',
            //             landline: '(2741) 2621-244',
            //         },
            //     },
            // ],
            json_data: [],
            json_meta: [
                [
                    {
                        key: 'charset',
                        value: 'utf-8',
                    },
                ],
            ],
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
            ],
            pageSize: 5,
            pageSizes: [5, 10, 20, 50, 100],
            page: 1,
            totalPages: 0,
            tanggal_lahir: '',
            months: [
                { text: 'Januari', value: 1 },
                { text: 'Februari', value: 2 },
                { text: 'Maret', value: 3 },
                { text: 'April', value: 4 },
                { text: 'Mei', value: 5 },
                { text: 'Juni', value: 6 },
                { text: 'Juli', value: 7 },
                { text: 'Agustus', value: 8 },
                { text: 'September', value: 9 },
                { text: 'Oktober', value: 10 },
                { text: 'November', value: 11 },
                { text: 'Desember', value: 12 },
            ],
            years: [],
            bulan: '',
            tahun: '',
            jenis_kelamin: ['Laki-laki', 'Perempuan'],
            menu: false,
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
        generateFileName() {
            this.filename = `${DateTime.now().toISODate()}_SKTM.xls`
        },
        async fetchData() {
            const response = await this.$axios.$get(
                'https://jsonplaceholder.typicode.com/users'
            )
            console.log(response)
            return response
        },
        startDownload() {
            alert('show loading')
        },
        finishDownload() {
            alert('hide loading')
        },
        getYear(startYear) {
            var currentYear = new Date().getFullYear(), years = [];
            startYear = startYear || 1980;
            while (currentYear >= startYear) {
                years.push(currentYear--);
            }
            return years
        },
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
            this.json_data = data.data.map((sktm, i) => {
                let no = (data.meta.current_page - 1) * data.meta.per_page + 1 + i
                const tgl = DateTime.fromISO(sktm.created_at).toFormat('yyyy-LL-dd')
                const status = (sktm.status == 1) ? 'Disetujui' : (sktm.status == 2) ? 'Surat Belum diambil' : (sktm.status == 3) ? 'Surat diambil' : 'Belum Diproses'
                return {
                    no: no,
                    tanggal: tgl,
                    nik: sktm.nik,
                    nama: sktm.nama,
                    keperluan: sktm.keperluan,
                    status: status,
                };
            })
            this.sktms = data.data.map((sktm, i) => {
                let no = (data.meta.current_page - 1) * data.meta.per_page + 1 + i
                const tgl = DateTime.fromISO(sktm.created_at).toFormat('yyyy-LL-dd')
                const status = (sktm.status == 1) ? 'Disetujui' : (sktm.status == 2) ? 'Surat Belum diambil' : (sktm.status == 3) ? 'Surat diambil' : 'Belum Diproses'
                return {
                    no: no,
                    id: sktm.id,
                    nama: sktm.nama,
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
        hapus(val) {
            const sktm = val
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
        },
        cetak() {
            console.log(this.filename)
        }
    },

}
</script>