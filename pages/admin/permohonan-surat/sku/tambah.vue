<template>
    <v-col cols="12">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title class="text-h5">
                    Tambah Data Permohonan SKU
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="primary" to="/admin/permohonan-surat/sku/">Kembali</v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <v-select v-if="$fetchState.pending"></v-select>
                <v-select v-else :items="pemohons" label="Pilih Pemohon" item-text="nama" item-value="nik"
                    v-model="select" @change="selectPemohon($event)">
                </v-select>
                <form @submit.prevent="submit" v-if="formVisible">
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Nama</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.nama" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">NIK</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.nik" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Jenis Kelamin</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.jenis_kelamin" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Tempat Lahir</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.tempat_lahir" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Tanggal Lahir</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.tanggal_lahir" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Kewarganegaraan</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.kewarganegaraan" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Agama</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.agama" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Alamat</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="pemohon.alamat" filled dense readonly>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Nama Usaha</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="values.nama_usaha" :error-messages="errors.nama_usaha"
                                @keypress="validate('nama_usaha')" @blur="validate('nama_usaha')" label="Nama Usaha"
                                solo dense>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Jenis Usaha</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="values.jenis_usaha" :error-messages="errors.jenis_usaha"
                                @keypress="validate('jenis_usaha')" @blur="validate('jenis_usaha')" label="Jenis Usaha"
                                solo dense>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Alamat Usaha</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="values.alamat_usaha" :error-messages="errors.alamat_usaha"
                                @keypress="validate('alamat_usaha')" @blur="validate('alamat_usaha')"
                                label="Alamat Usaha" solo dense>
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
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script>
import { object, string } from 'yup'

const skuSchema = object({
    nama_usaha: string().required('Nama Usaha harus diisi'),
    jenis_usaha: string().required('Jenis Usaha harus diisi'),
    alamat_usaha: string().required('Alamat Usaha harus diisi'),
})
export default {
    layout: 'admin',
    data() {
        return {
            formVisible: false,
            pemohons: [],
            pemohon: {},
            select: '',
            values: {
                nama_usaha: '',
                jenis_usaha: '',
                alamat_usaha: '',
            },
            errors: {
                nama_usaha: '',
                jenis_usaha: '',
                alamat_usaha: '',
            }
        }
    },
    async fetch() {
        this.$axios.$get('http://localhost:3333/pemohon/all')
            .then(res => {
                this.pemohons = res
            })
            .catch(() => {
            })
    },
    methods: {
        selectPemohon(evt) {
            this.$axios.$get(`http://localhost:3333/pemohon/${evt}`)
                .then(res => {
                    this.pemohon = res.pemohon
                    this.formVisible = true
                })
        },
        validate(field) {
            skuSchema
                .validateAt(field, this.values)
                .then(() => {
                    this.errors[field] = '';
                })
                .catch(err => {
                    this.errors[field] = err.message
                })
        },
        async submit() {
            skuSchema
                .validate(this.values, { abortEarly: false })
                .then(() => {
                    this.errors = {};

                    const fd = new FormData()
                    fd.append('pemohonNik', this.select)
                    fd.append('nama_usaha', this.values.nama_usaha)
                    fd.append('alamat_usaha', this.values.alamat_usaha)
                    fd.append('jenis_usaha', this.values.jenis_usaha)
                    this.$axios.$post('http://localhost:3333/sku ', fd)
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
                                title: 'Sukses tambah data SKU'
                            })
                            this.$router.push('/admin/permohonan-surat/sku')
                        })
                        .catch(({ response }) => {
                            this.errors = {};
                            console.log(response)
                            response.data.errors.map(e => {
                                this.$toast.error(e.message, {

                                });
                            })
                        })
                })
                .catch(err => {
                    err.inner.forEach(error => {
                        this.errors[error.path] = error.message;
                    });
                });
        }
    }
}
</script>