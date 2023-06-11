<template>
  <div :class="device.desktop ? `home pa-6 grey lighten-4`:`home pa-0 grey lighten-4`">
    <v-row>
      <v-col cols="12">
        <v-card class="animated animate__fadeInUp rounded-0">
          <v-card-title :class="`flex flex-row-reverse ` + theme.color + ` lighten-1`">
            <v-tooltip
              :color="theme.color"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                  v-show="page.actions.add"
                >
                  <v-icon
                    :color="theme.mode == 'dark' ? `white` : `black`"
                    @click="openVideo"
                  >add_circle</v-icon>
                </v-btn>
              </template>
              <span>Tambah Data</span>
            </v-tooltip>
            <v-tooltip
              :color="theme.color"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                  v-show="page.actions.refresh"
                >
                  <v-icon
                    :color="theme.mode == 'dark' ? `white` : `black`"
                    @click="stopVideo"
                  >refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh Data</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pencarian"
              single-line
              hide-details
              solo
              dense
              :color="theme.color"
              style="max-width: 350px"
            ></v-text-field>
          </v-card-title>

        </v-card>
      </v-col>
      <v-col>
        <div>
          <div>AREA CIKUPA</div>
          <canvas
            id="video"
            style="width: 500px;height: 300px; background-color: grey ;"
          ></canvas>
        </div>

      </v-col>

    </v-row>

  </div>
</template>
        
 <script>
import { mapActions, mapState } from "vuex";
import "animate.css";
import JSMpeg from "@cycjimmy/jsmpeg-player";

export default {
  name: "pilar",
  components: {},
  data: () => ({
    num: 1,
    headers: [
      {
        text: "PERIODE",
        align: "start",
        sortable: false,
        value: "periode",
      },
      {
        text: "PILAR",
        align: "start",
        sortable: false,
        value: "pilar",
      },
      {
        text: "PROGRAM",
        align: "start",
        sortable: false,
        value: "program",
      },
      {
        text: "KEGIATAN",
        align: "start",
        sortable: false,
        value: "kegiatan",
      },
      {
        text: "TAHUN KE-",
        align: "center",
        sortable: false,
        value: "target",
      },
      {
        text: "Capaian (%)",
        align: "center",
        sortable: false,
        value: "persentasi",
      },

      {
        text: "AKSI",
        value: "id",
        width: 100,
        sortable: false,
        align: "center",
      },
    ],
    search: null,
    path: null,
    filename: null,
    pilars: [],
    programs: [],
    kegiatans: [],
    targets: [
      { text: "Tahun Ke 1", value: 1 },
      { text: "Tahun Ke 2", value: 2 },
      { text: "Tahun Ke 3", value: 3 },
      { text: "Tahun Ke 4", value: 4 },
      { text: "Tahun Ke 5", value: 5 },
    ],
    periodes: [],
    formrealisasi: {
      show: false,
      record: {},
    },

    Options: {
      techOrder: ["flash", "html5"],
    },
    player: null,
  }),
  computed: {
    ...mapState([
      "page",
      "theme",
      "http",
      "device",
      "record",
      "records",
      "loading",
      "event",
      "snackbar",
      "form",
      "table",
    ]),
    filterItems() {
      if (this.search != null) {
        return this.records.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.nip.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      } else {
        return this.records;
      }
    },
  },
  created() {
    this.setPage({
      crud: true,
      dataUrl: "api/keselamatan/renaksi",
      pagination: false,
      title: "PANTAUAN CCTV",
      subtitle: "Berikut Daftar Seluruh Pantauan CCTV Yang Tersedia",
      showtable: true,
      breadcrumbs: [
        {
          text: "Daftar Renaksi",
          disabled: true,
          href: "",
        },
      ],
      actions: {
        refresh: true,
        add: true,
        edit: true,
        delete: true,
        bulkdelete: false,
        print: false,
        export: false,
        help: false,
      },
    });
    this.fetchPilars();
    this.fetchPeriodes();
    this.fetchRecords();
  },
  mounted() {},
  methods: {
    ...mapActions([
      "setPage",
      "fetchRecords",
      "postAddNew",
      "postEdit",
      "postUpdate",
      "postConfirmDelete",
      "assignFileBrowse",
      "setLoading",
      "setRecord",
      "setForm",
    ]),
    openVideo: function (rstp) {
      try {
        this.setForm({
          add: true,
          edit: false,
        });
        // let canvas = document.getElementById("video");
        // let url = `ws://localhost:9999?url=${encodeURIComponent(rstp)}`;
        // this.player = new JSMpeg.Player(url, { canvas: canvas });

        // console.log(this.player);
      } catch (error) {
        console.log("catched error", error);
      }
    },
    stopVideo: function () {
      this.player.destroy();
    },
    openForm: function () {
      this.setForm({
        add: true,
        edit: false,
      });
      this.setRecord({});
      this.filename = null;
    },
    closeForm: function () {
      this.setForm({
        add: false,
        edit: false,
      });
    },
    postAddNewRecord: function () {
      this.postAddNew(this.record).then(() => {
        this.closeForm();
      });
    },
    editRecord: function (val) {
      this.postEdit(val).then(() => {
        this.filename = this.record.filename;
      });
      this.setForm({
        add: true,
        edit: true,
      });
    },
    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.closeForm();
        this.closeFormRealisasi();
      });
    },
    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },
    postDownload(val) {
      window.open(val, "__blank");
    },
    uploadFile: function () {
      this.assignFileBrowse({
        fileType: [".pdf"],
        query: {
          doctype: "documents",
        },
        callback: (response) => {
          setTimeout(() => {
            this.filename = response.name;
            this.record.filename = response.name;
          }, 500);
        },
      });
    },
    fetchPilars: async function () {
      try {
        let { data } = await this.http.get("api/combo/pilar");
        this.pilars = data;
      } catch (error) {}
    },
    fetchPrograms: async function () {
      try {
        let { data } = await this.http.get(
          "api/combo/program/" + this.record.pilar_uuid
        );
        this.programs = data;
      } catch (error) {}
    },
    fetchKegiatans: async function () {
      try {
        let { data } = await this.http.get(
          "api/combo/kegiatan/" + this.record.program_uuid
        );
        this.kegiatans = data;
      } catch (error) {}
    },
    fetchPeriodes: async function () {
      try {
        let { data } = await this.http.get("api/combo/periode");
        this.periodes = data;
      } catch (error) {}
    },
    openFormRealisasi: function (val) {
      this.postEdit(val).then(() => {
        this.filename = this.record.filename;
      });
      this.formrealisasi.show = true;
    },
    closeFormRealisasi: function () {
      this.formrealisasi.show = false;
    },
  },
  watch: {
    "record.pilar_uuid": {
      handler() {
        this.fetchPrograms();
      },
    },
    "record.program_uuid": {
      handler() {
        this.fetchKegiatans();
      },
    },
  },
};
</script>

<style>
canvas {
  width: 90%;
}
</style>