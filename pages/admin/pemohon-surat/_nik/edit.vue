<template>
    <v-col cols="9" class="mx-auto">
        <v-row class="d-flex justify-start pa-3">
            <v-btn :to="'/admin/pemohon-surat'" color="primary">KEMBALI</v-btn>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card elevation="4">
                    <v-card-title>Edit Data Pemohon Surat</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-col cols="12">
                            <form @submit.prevent="submit">
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">NIK</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.nik" :error-messages="errors.nik"
                                            @keypress="validate('nik'); isNik($event)" @blur="validate('nik')"
                                            label="NIK" solo dense readonly>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Nama</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.nama" :error-messages="errors.nama"
                                            @keypress="validate('nama')" @blur="validate('nama')" label="Nama" solo
                                            dense>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Jenis Kelamin</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-select :items="['Laki-laki', 'Perempuan']" v-model="values.jenis_kelamin"
                                            :error-messages="errors.jenis_kelamin" @change="validate('jenis_kelamin')"
                                            @blur="validate('jenis_kelamin')" label="Jenis Kelamin" solo></v-select>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Tempat Lahir</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.tempat_lahir"
                                            :error-messages="errors.tempat_lahir" @keypress="validate('tempat_lahir')"
                                            @blur="validate('tempat_lahir')" label="Tempat Lahir" solo dense>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Tanggal Lahir</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="values.tanggal_lahir" label="Tanggal Lahir"
                                                    prepend-icon="mdi-calendar" :error-messages="errors.tanggal_lahir"
                                                    readonly v-bind="attrs" v-on="on">
                                                </v-text-field>
                                            </template>
                                            <v-date-picker v-model="values.tanggal_lahir" @input="menu = false">
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Agama</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.agama" :error-messages="errors.agama"
                                            @keypress="validate('agama')" @blur="validate('agama')" label="Agama" solo
                                            dense>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Kewarganegaraan</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.kewarganegaraan"
                                            :error-messages="errors.kewarganegaraan"
                                            @keypress="validate('kewarganegaraan')" @blur="validate('kewarganegaraan')"
                                            label="Kewarganegaraan" solo dense>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Alamat</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.alamat" :error-messages="errors.alamat"
                                            @keypress="validate('alamat')" @blur="validate('alamat')" label="Alamat"
                                            solo dense>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">No. Handphone</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.telpon" :error-messages="errors.telpon"
                                            @keypress="validate('telpon'); isNumber($event)" @blur="validate('telpon')"
                                            label="No. Handphone" solo dense>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2">Pekerjaan</v-col>
                                    <v-col cols="1">:</v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="values.pekerjaan" :error-messages="errors.pekerjaan"
                                            @keypress="validate('pekerjaan')" @blur="validate('pekerjaan')"
                                            label="Pekerjaan" solo dense>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center" no-gutters dense>
                                    <v-col cols="2"></v-col>
                                    <v-col cols="1"></v-col>
                                    <v-col cols="9">
                                        <v-btn color="primary" type="submit">
                                            SIMPAN
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </v-col>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
import { object, string, date, mixed } from 'yup'

const loginSchema = object({
    nik: string().min(16, 'NIK Minimal 16 Karakter').required('NIK Harus Diisi'),
    nama: string().required('Nama harus diisi'),
    jenis_kelamin: string().required('Jenis Kelamin harus dipilih'),
    tempat_lahir: string().required('Tempat lahir harus diisi'),
    tanggal_lahir: date().required('Tanggal lahir harus diisi'),
    agama: string().required('Agama harus diisi'),
    kewarganegaraan: string().required('Kewarganegaraan harus diisi'),
    alamat: string().required('Alamat harus diisi'),
    telpon: string().required('No. Handphone harus diisi'),
    pekerjaan: string().required('Pekerjaan harus diisi'),
})
export default {
    name: 'TambahPemohon',
    layout: 'admin',
    data() {
        return {
            values: {
                nik: '',
                nama: '',
                jenis_kelamin: '',
                tempat_lahir: '',
                tanggal_lahir: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                agama: '',
                kewarganegaraan: '',
                alamat: '',
                telpon: '',
                pekerjaan: '',
            },
            errors: {
                nik: '',
                nama: '',
                jenis_kelamin: '',
                tempat_lahir: '',
                agama: '',
                kewarganegaraan: '',
                alamat: '',
                telpon: '',
                pekerjaan: '',
                tanggal_lahir: '',
            },
            menu: false,
            loading: false,
        }
    },
    async fetch() {
        await this.$axios.$get(`http://localhost:3333/pemohon/${this.$route.params.nik}`)
            .then(res => {
                this.values = {
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
                }
            })
    },
    methods: {
        async submit() {
            console.log('start update')
            loginSchema
                .validate(this.values, { abortEarly: false })
                .then(() => {
                    console.log('validate true')

                    const fd = new FormData()
                    fd.append('nik', this.values.nik)
                    fd.append('nama', this.values.nama)
                    fd.append('jenis_kelamin', this.values.jenis_kelamin)
                    fd.append('tempat_lahir', this.values.tempat_lahir)
                    fd.append('tanggal_lahir', this.values.tanggal_lahir)
                    fd.append('agama', this.values.agama)
                    fd.append('kewarganegaraan', this.values.kewarganegaraan)
                    fd.append('alamat', this.values.alamat)
                    fd.append('telpon', this.values.telpon)
                    fd.append('pekerjaan', this.values.pekerjaan)
                    fd.append('kk', this.values.kk)
                    console.log(fd)
                    this.$axios.$put(`http://localhost:3333/pemohon/${this.$route.params.nik}`, fd)
                        .then(() => {
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
                                title: 'Sukses edit data pemohon'
                            })
                            this.$router.push('/admin/pemohon-surat')
                        })
                        .catch(({ response }) => {
                            this.errors = {};
                            response.data.errors.map(e => {
                                this.$toast.error(e.message, {

                                });
                            })
                        })
                })
                .catch(err => {
                    console.log('validate false')
                    err.inner.forEach(error => {
                        this.errors[error.path] = error.message;
                    });
                });
        },
        isNik(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            var length = evt.target.value.length + 1;
            if (
                charCode > 31 &&
                (charCode < 48 || charCode > 57) &&
                charCode !== 46
            ) {
                if (charCode == 13) {
                    return true
                } else {
                    evt.preventDefault();
                }
            } else {
                if (length == 17) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        },
        isNumber(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (
                charCode > 31 &&
                (charCode < 48 || charCode > 57) &&
                charCode !== 46
            ) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        validate(field) {
            loginSchema
                .validateAt(field, this.values)
                .then(() => {
                    this.errors[field] = '';
                })
                .catch(err => {
                    this.errors[field] = err.message
                })
        }
    }
}
</script>