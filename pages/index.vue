<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h2>KARANGTINGGIL</h2>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row class="d-flex text-center justify-center mt-6">
          <v-col cols="12">
            <div class="mb-3">
              <h1 class="text-black">PELAYANAN ADMINISTRASI MASYARAKAT <br />DESA KARANGTINGGIL</h1>
            </div>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-col cols="6">
            <v-card elevation="5" class="pa-3 d-flex justify-center">
              <v-col cols="8" class="">
                <h2 class="mb-8 text-center">LOGIN</h2>
                <validation-observer ref="observer" v-slot="{}">
                  <form @submit.prevent="submit">
                    <validation-provider v-slot="{ errors }" name="Username" rules="required">
                      <v-text-field v-model="username" :error-messages="errors" label="Username">
                      </v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Password" rules="required">
                      <v-text-field type="password" v-model="password" :error-messages="errors" label="Password">
                      </v-text-field>
                    </validation-provider>
                    <v-btn color="primary" block type="submit" :loading="loading">
                      Login
                    </v-btn>
                  </form>
                </validation-observer>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import { required } from 'vee-validate/dist/rules.umd.js'
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate'
// import { mapGetters } from 'vuex'

extend('required', {
  ...required,
  message: '{_field_} harus diisi'
})
export default {
  name: 'LoginView',
  middleware: 'auth',
  auth: 'guest',
  layout: 'login',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      username: '',
      password: '',
      loading: false,
    }
  },
  methods: {
    async submit() {
      const val = await this.$refs.observer.validate()
      if (val) {
        this.loading = true
        try {
          let response = await this.$auth.loginWith('local', {
            data: {
              username: this.username,
              password: this.password
            }
          })
          // this.$router.push('/admin/dashboard')
          this.$toast.success('Berhasil login')
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$toast.error(err.response.data.message)
        }
      }
    }
  },
}
</script>