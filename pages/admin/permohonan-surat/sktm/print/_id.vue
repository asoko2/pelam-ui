<template>
    <v-app>
        <v-main>
            <v-container style="font-family: serif">
                <v-col cols="12" class="d-flex justify-between">
                    <v-row>
                        <v-col cols="4">
                            <v-img src="/logo.png" width="200"></v-img>
                        </v-col>
                        <v-col cols="6" class="">
                            <!-- <v-row> -->
                            <h1 class="text-center" style="font-family: serif">PEMERINTAH KABUPATEN LAMONGAN</h1>
                            <h1 class="text-center" style="font-family: serif">KECAMATAN PUCUK</h1>
                            <h1 class="text-center" style="font-family: serif">DESA KARANGTINGGIL</h1>
                            <h1 class="text-center" style="font-family: serif">Jalan Karya No 37. Karangtinggil 62257
                            </h1>
                            <h1 class="text-center" style="font-family: serif">Email : pemdeskarangtinggil@gmail.com
                            </h1>
                            <!-- </v-row> -->
                        </v-col>
                    </v-row>
                </v-col>
                <v-divider color="black"></v-divider>
                <v-divider color="black"></v-divider>
                <v-spacer></v-spacer>
                <v-divider color="black"></v-divider>
                <v-divider color="black"></v-divider>
                tes
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    async asyncData({ $axios, params }) {
        const sktms = await $axios.$get(`http://localhost:3333/sktm/${params.id}`).then(res => {
            console.log(res)
            return res
        })
        return sktms
    },
    // mounted(){

    // }
}
</script>