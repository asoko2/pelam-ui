<template>
    <v-col cols="12">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title class="text-h5">
                    Permohonan Surat
                </v-toolbar-title>

                <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <v-row class="d-flex justify-space-around">
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/permohonan-surat/sktm" color="primary" dark :elevation="hover ? 8 : 4"
                                height="100" class="d-flex align-center">
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">Permohonan
                                    SKTM
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/permohonan-surat/skck" color="primary" dark :elevation="hover ? 8 : 4"
                                height="100" class="d-flex align-center">
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">Permohonan
                                    SKCK
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/permohonan-surat/domisili" color="primary" dark
                                :elevation="hover ? 8 : 4" height="100" class="d-flex align-center">
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">Permohonan
                                    Surat Domisili
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
                <v-row class="d-flex justify-space-around">
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/permohonan-surat/sku" color="primary" dark :elevation="hover ? 8 : 4"
                                height="100" class="d-flex align-center">
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">Permohonan
                                    SKU
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/permohonan-surat/surat-keterangan" color="primary" dark
                                :elevation="hover ? 8 : 4" height="100" class="d-flex align-center">
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">Permohonan
                                    Surat
                                    Keterangan
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="3">
                        <v-hover v-slot="{ hover }">
                            <v-card to="/admin/permohonan-surat/kehilangan-kk" color="primary" dark
                                :elevation="hover ? 8 : 4" height="100" class="d-flex align-center">
                                <v-card-text class="d-flex justify-center white--text text-h5 text-center">Permohonan
                                    Kehilangan KK
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
    layout: 'admin'
}
</script>