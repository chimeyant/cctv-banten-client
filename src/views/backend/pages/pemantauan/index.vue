<template>
  <div :class="device.desktop ? `home pa-6 grey lighten-4`:`home pa-0 grey lighten-4`">

    <v-row>
      <v-col cols="12">
        <v-card class="animated animate__bounceIn rounded-0">
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
                    @click="openForm"
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
                    @click="fetchRecords"
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
              color="orange dark-3"
              style="max-width: 350px"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-show="device.desktop"
            :headers="headers"
            :items="records"
            :items-per-page="table.options.itemsPerPage"
            :page.sync="table.options.page"
            class="elevation-2 mb-1"
            :color="theme.color"
            :loading="loading.table"
            loading-text="Loading... Please wait"
            :search="search"
            hide-default-footer
            @page-count="table.options.pageCount = $event"
            show-select
          >
            <v-progress-linear
              slot="progress"
              :color="theme.color"
              height="1"
              indeterminate
            ></v-progress-linear>
            <template v-slot:item.progress="{ value }">
              <v-progress-linear
                :color="theme.color"
                v-model="value"
                height="25"
              >
                <strong>{{ value }}%</strong>
              </v-progress-linear>
            </template>

            <template v-slot:item.url="{ value }">
              <v-icon @click="openVideo(value)">mdi-cctv</v-icon>
            </template>
            <template v-slot:item.id="{ value }">
              <v-menu
                bottom
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    :color="theme.color"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-dots-vertical-circle-outline
                  </v-icon>
                </template>

                <v-list>
                  <v-list-item
                    @click="editRecord(value)"
                    v-show="page.actions.edit"
                  >
                    <v-list-item-title>
                      <v-icon color="orange">mdi-pencil-circle</v-icon>Ubah Data
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="postDeleteRecord(value)"
                    v-show="page.actions.delete"
                  >
                    <v-list-item-title>
                      <v-icon color="red">mdi-delete-circle</v-icon>Hapus Data
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
          <v-list
            subheader
            v-show="device.mobile"
          >
            <v-list-item-group
              multiple
              active-class=""
            >
              <v-list-item
                v-for="item in filterItems"
                :key="item.id"
                style="border: ;1px solid"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.nip }} </v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.gol }} </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu
                      bottom
                      origin="center center"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          :color="theme.color"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-dots-vertical-circle-outline
                        </v-icon>
                      </template>

                      <v-list>

                        <v-divider v-if="page.delete || page.edit"></v-divider>
                        <v-list-item @click="openVideo(item.url)">
                          <v-list-item-title>
                            <v-icon color="orange">mdi-cctv</v-icon>
                            Pantau CCTV
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>

                </template>
              </v-list-item>

            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="form.add"
        :max-width="device.desktop ? `600px` : `100%`"
        persistent
        :fullscreen="device.mobile"
      >
        <v-card>
          <v-toolbar
            :color="theme.color"
            :dark="theme.mode"
          >
            <v-icon
              small
              class="mr-1 orange--text animate__animated animate__flash animate__infinite"
            >mdi-circle</v-icon> Pantau CCTV
          </v-toolbar>
          <v-card-text class="mt-2">
            <div class="mt-10 flex justify-center">

              <div
                v-show="progressbar"
                style=""
              >
                <v-progress-circular
                  indeterminate
                  :color="theme.color"
                  style="position: absolute;left: 290px;top: 230px;"
                >
                  <span style="margin-top: 75px;">
                    Loading..
                  </span>
                </v-progress-circular>
              </div>

              <div>
                <canvas
                  id="video"
                  style="width:100%;height: 100%; background-color: grey ;"
                >
                </canvas>

              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn
              outlined
              color="grey"
              @click="stopVideo"
            >Tutup</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>
    
<script>
import { mapActions, mapState } from "vuex";
import "animate.css";
import JSMpeg from "@cycjimmy/jsmpeg-player";

export default {
  name: "pemantauan-cctv",
  data: () => ({
    num: 1,
    headers: [
      {
        text: "AREA",
        align: "start",
        sortable: false,
        value: "area",
      },
      { text: "CCTV", value: "name" },
      { text: "ALAMAT", value: "address" },
      {
        text: "PLAY",
        value: "url",
        width: 100,
        sortable: false,
        align: "center",
      },
    ],
    search: null,
    path: null,
    player: null,
    progressbar: false,
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
      dataUrl: "api/pemantauan/cctv",
      pagination: false,
      title: "PEMANTAUAN CCTV",
      subtitle: "Berikut Daftar Seluruh Pemantauan CCTV Yang Tersedia",
      showtable: true,
      breadcrumbs: [
        {
          text: "PEMANTAUAN",
          disabled: true,
          href: "",
        },
        {
          text: "CCTV",
          disabled: false,
          href: "",
        },
      ],
      actions: {
        refresh: true,
        add: false,
        edit: false,
        delete: true,
        bulkdelete: false,
        print: false,
        export: false,
        help: false,
      },
    });
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
    openForm: function () {
      this.setForm({
        add: true,
        edit: false,
      });
      this.setRecord({});
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
      this.postEdit(val);
      this.setForm({
        add: true,
        edit: true,
      });
    },
    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.closeForm();
      });
    },
    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },
    postDownload(val) {
      window.open(val, "__blank");
    },
    openVideo: function (rstp) {
      try {
        this.progressbar = true;
        this.setForm({
          add: true,
          edit: false,
        }).then(() => {
          let canvas = document.getElementById("video");
          //let url = `ws://localhost:9999?url=${encodeURIComponent(rstp)}`;

          //production
          let url = `wss://cctv.bantenprov.go.id:9999?url=${encodeURIComponent(
            rstp
          )}`;
          this.player = new JSMpeg.Player(url, {
            canvas: canvas,
            onSourceEstablished: (val) => this.onSourceCompleted(val),
          });
        });
      } catch (error) {
      } finally {
      }
    },
    stopVideo: function () {
      this.closeForm();
      this.player.destroy();
    },

    onSourceCompleted(source) {
      this.progressbar = false;
    },
  },
};
</script>