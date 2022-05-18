<template>
    <v-col cols="9" class="mx-auto">
        <v-row class="d-flex justify-start pa-3">
            <v-btn :to="'/admin/permohonan-surat/surat-keterangan'" color="primary">KEMBALI</v-btn>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card elevation="4">
                    <v-card-title>Data Surat Keterangan</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-col cols="12">
                            <div v-if="$fetchState.pending">
                                <v-skeleton-loader type="table" loading></v-skeleton-loader>
                            </div>
                            <div v-else>
                                <v-simple-table>
                                    <template v-slot:default>
                                        <tbody>
                                            <tr v-for="(item, index) in title" :key="item.field">
                                                <td class="text-h6">{{ item.name }} </td>
                                                <td class="text-h6">:</td>
                                                <td v-if="index == title.length - 1" class="text-h6"><a
                                                        :href="surat_keterangans['kk']" target="_blank">Lihat KK</a>
                                                </td>
                                                <td v-else class="text-h6">{{ surat_keterangans[item.field] }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </div>
                        </v-col>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-col>
</template>
<script>
import { DateTime } from 'luxon'
export default {
    layout: 'admin',
    data() {
        return {
            surat_keterangans: {
            },
            title: [
                { field: 'nik', name: 'NIK', },
                { field: 'nama', name: 'Nama' },
                { field: 'jenis_kelamin', name: 'Jenis Kelamin' },
                { field: 'tanggal_lahir', name: 'Tanggal Lahir' },
                { field: 'tempat_lahir', name: 'Tempat Lahir' },
                { field: 'agama', name: 'Agama' },
                { field: 'kewarganegaraan', name: 'Kewarganegaraan' },
                { field: 'alamat', name: 'Alamat' },
                { field: 'keterangan', name: 'Keterangan' },
                { field: 'kk', name: 'KK' },
            ]
        }
    },
    async fetch() {
        await this.$axios.$get(`http://localhost:3333/surat-keterangan/${this.$route.params.id}`)
            .then(res => {
                this.surat_keterangans = {
                    nik: res.surat_keterangan[0].nik,
                    nama: res.surat_keterangan[0].nama,
                    jenis_kelamin: res.surat_keterangan[0].jenis_kelamin,
                    tanggal_lahir: DateTime.fromISO(res.surat_keterangan[0].tanggal_lahir).toFormat('yyyy-LL-dd'),
                    tempat_lahir: res.surat_keterangan[0].tempat_lahir,
                    agama: res.surat_keterangan[0].agama,
                    kewarganegaraan: res.surat_keterangan[0].kewarganegaraan,
                    alamat: res.surat_keterangan[0].alamat,
                    keterangan: res.surat_keterangan[0].keterangan,
                    kk: res.kk_link
                }
            })
    },
}
</script>