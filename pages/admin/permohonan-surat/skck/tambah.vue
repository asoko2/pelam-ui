<template>
    <v-col cols="12">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title class="text-h5">
                    Tambah Data Permohonan SKCK
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="primary" to="/admin/permohonan-surat/skck/">Kembali</v-btn>
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
                    <v-row class="d-flex align-start mb-4" no-gutters dense>
                        <v-col cols="2" class="d-flex justify-between">
                            Keterangan
                            <v-spacer></v-spacer>
                            <v-btn color="secondary" @click="plusKeterangan">
                                <v-icon>mdi-plus-thick</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <!-- <v-textarea v-model="keterangan" :error-messages="errors.keterangan"
                                @keypress="validate('keterangan')" @blur="validate('keterangan')" solo name="input-7-4"
                                label="Keterangan">
                            </v-textarea> -->
                            <!-- <vue-editor v-model="keterangan" @text-change="validate('keterangan')"
                                @blur="validate('keterangan')"></vue-editor> -->
                            <div v-for="(ket, index) in keterangan" :key="index" class="d-flex justify-between mb-0">
                                <v-text-field v-model="ket.value" :name="`keterangan[${index}]`"
                                    @keypress="checkKeterangan" :label="`Keterangan ` + (index + 1)" class="mr-4" solo
                                    dense></v-text-field>
                                <v-btn color="error" @click="removeKeterangan(index)">
                                    <v-icon>mdi-minus-thick</v-icon>
                                </v-btn>
                            </div>
                            <span v-if="this.errors.keterangan !== ''" class="red--text text-caption ml-2">{{
                                    this.errors.keterangan
                            }}</span>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center" no-gutters dense>
                        <v-col cols="2">Keperluan</v-col>
                        <v-col cols="1">:</v-col>
                        <v-col cols="9">
                            <v-text-field v-model="values.keperluan" :error-messages="errors.keperluan"
                                @keypress="validate('keperluan')" @blur="validate('keperluan')" label="Keperluan" solo
                                dense>
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
import { forEach } from 'lodash'
import { object, string } from 'yup'

const skckSchema = object({
    // keterangan: string().required('Keterangan harus diisi'),
    keperluan: string().required('Keperluan harus diisi'),
})
export default {
    layout: 'admin',
    data() {
        return {
            formVisible: false,
            pemohons: [],
            pemohon: {},
            select: '',
            keterangan: [],
            values: {
                keperluan: '',
            },
            errors: {
                keterangan: '',
                keperluan: '',
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
        plusKeterangan() {
            this.keterangan.push({ value: '' })
        },
        removeKeterangan(index) {
            this.keterangan.splice(index, 1)
        },
        checkKeterangan() {
            console.log(this.keterangan)
        },
        validate(field) {
            skckSchema
                .validateAt(field, this.values)
                .then(() => {
                    this.errors[field] = '';
                })
                .catch(err => {
                    this.errors[field] = err.message
                })
        },
        async submit() {
            if (this.keterangan.length > 0) {
                this.keterangan.forEach(element => {
                    if (element.value === '') {
                        this.errors['keterangan'] = 'Semua kolom keterangan harus diisi'
                        console.log('keterangan error')
                        return
                    } else {
                        console.log('keterangan tidak error')
                        this.errors['keterangan'] = ''
                    }
                });
                skckSchema
                    .validate(this.values, { abortEarly: false })
                    .then(() => {
                        this.errors = {};

                        console.log('create FormData')
                        const fd = new FormData()
                        console.log(this.keterangan)
                        console.log('Iterate keterangan')
                        for (let ketKey in this.keterangan) {
                            fd.append('keterangan[]', this.keterangan[ketKey].value)
                        }
                        fd.append('pemohonNik', this.select)

                        // fd.append('keterangan', this.keterangan)
                        fd.append('keperluan', this.values.keperluan)
                        console.log('post submit data')
                        this.$axios.$post('http://localhost:3333/skck ', fd)
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
                                    title: 'Sukses tambah data SKCK'
                                })
                                this.$router.push('/admin/permohonan-surat/skck')
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
                        console.log(err)
                        err.inner.forEach(error => {
                            this.errors[error.path] = error.message;
                        });
                    });
            } else {
                alert('Harus mengisi setidaknya 1 keterangan')
            }
        }
    }
}
</script>