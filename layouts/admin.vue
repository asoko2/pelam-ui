<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" class="pt-4" clipped app>
      <v-list nav>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" color="primary darken-1">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" clipped-left fixed app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="white" light v-bind="attrs" v-on="on">
            {{ $auth.user.nama }} <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list nav>
          <v-list-item @click="logout()">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container class="pa-6">
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'AdminLayout',
  middleware: ['auth', 'admin'],
  computed: {
    // ...mapGetters(['loggedInUser'])
  },
  data() {
    return {
      drawer: true,
      fixed: false,
      items: [
        { icon: 'mdi-view-dashboard', title: 'Dashboard', to: '/admin/dashboard' },
        { icon: 'mdi-account-group', title: 'Pemohon Surat', to: '/admin/pemohon-surat' },
        { icon: 'mdi-file-document-multiple', title: 'Permohonan Surat', to: '/admin/permohonan-surat' },
        { icon: 'mdi-order-bool-ascending-variant', title: 'Status Permohonan', to: '/admin/status-permohonan' },
        { icon: 'mdi-tray-full', title: 'Laporan', to: '/admin/laporan' },
      ],
      miniVariant: false,
      // right: true,
      title: 'KARANGTINGGIL'
    }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
      } catch (error) {
        console.log('gagal logout')
      }
    }
  },
}
</script>
