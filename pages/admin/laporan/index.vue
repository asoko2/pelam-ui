<template>
    <v-col cols="12">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title class="text-h5">
                    Laporan
                </v-toolbar-title>

                <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <v-row class="d-flex justify-space-around">
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/laporan/pemohon" color="primary" dark :elevation="hover ? 8 : 4"
                                height="175" class="d-flex flex-column pa-4" shaped>
                                <v-icon size=80>mdi-email</v-icon>
                                <!-- <v-img src="/surat.png" width="50"></v-img> -->
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">
                                    Pemohon
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/laporan/sktm" color="primary" dark :elevation="hover ? 8 : 4"
                                height="175" class="d-flex flex-column pa-4" shaped>
                                <v-icon size=80>mdi-email</v-icon>
                                <!-- <v-img src="/surat.png" width="50"></v-img> -->
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">
                                    SKTM
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/laporan/skck" color="primary" dark :elevation="hover ? 8 : 4"
                                height="175" class="d-flex flex-column pa-4" shaped>
                                <v-icon size=80>mdi-email</v-icon>
                                <!-- <v-img src="/surat.png" width="50"></v-img> -->
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">
                                    SKCK
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
                <v-row class="d-flex justify-space-around">
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/laporan/domisili" color="primary" dark :elevation="hover ? 8 : 4"
                                height="175" class="d-flex flex-column pa-4" shaped>
                                <v-icon size=80>mdi-email</v-icon>
                                <!-- <v-img src="/surat.png" width="50"></v-img> -->
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">
                                    Surat Domisili
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/laporan/sku" color="primary" dark :elevation="hover ? 8 : 4" height="175"
                                class="d-flex flex-column pa-4" shaped>
                                <v-icon size=80>mdi-email</v-icon>
                                <!-- <v-img src="/surat.png" width="50"></v-img> -->
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">
                                    SKU
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/laporan/surat-keterangan" color="primary" dark :elevation="hover ? 8 : 4"
                                height="175" class="d-flex flex-column pa-4" shaped>
                                <v-icon size=80>mdi-email</v-icon>
                                <!-- <v-img src="/surat.png" width="50"></v-img> -->
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">
                                    Surat Keterangan
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
                <v-row class="ml-13">
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/laporan/kehilangan-kk" color="primary" dark :elevation="hover ? 8 : 4"
                                height="175" class="d-flex flex-column pa-4" shaped>
                                <v-icon size=80>mdi-email</v-icon>
                                <!-- <v-img src="/surat.png" width="50"></v-img> -->
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">
                                    Surat Kehilangan KK
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script>
export default {
    layout: 'admin',
    name: 'LaporanView'
}
</script>