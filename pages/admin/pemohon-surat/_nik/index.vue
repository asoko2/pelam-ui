<template>
    <v-col cols="9" class="mx-auto">
        <v-row class="d-flex justify-start pa-3">
            <v-btn :to="'/admin/pemohon-surat'" color="primary">KEMBALI</v-btn>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card elevation="4">
                    <v-card-title>Data Pemohon Surat</v-card-title>
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
                                                        :href="pemohons['kk']" target="_blank">Lihat KK</a></td>
                                                <td v-else class="text-h6">{{ pemohons[item.field] }}</td>
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
export default {
    layout: 'admin',
    data() {
        return {
            pemohons: {
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
                { field: 'telpon', name: 'No. Handphone' },
                { field: 'pekerjaan', name: 'Pekerjaan' },
                { field: 'kk', name: 'KK' },
            ]
        }
    },
    async fetch() {
        await this.$axios.$get(`http://localhost:3333/pemohon/${this.$route.params.nik}`)
            .then(res => res.json()).then((res) => {
                this.pemohons = {
                    nik: res.pemohon.nik,
                    nama: res.pemohon.nama,
                    jenis_kelamin: res.pemohon.jenis_kelamin,
                    tanggal_lahir: res.pemohon.tanggal_lahir,
                    tempat_lahir: res.pemohon.tempat_lahir,
                    agama: res.pemohon.agama,
                    kewarganegaraan: res.pemohon.kewarganegaraan,
                    alamat: res.pemohon.alamat,
                    telpon: res.pemohon.telpon,
                    pekerjaan: res.pemohon.pekerjaan,
                    kk: res.kk_link
                }
            })
    },
}
</script>