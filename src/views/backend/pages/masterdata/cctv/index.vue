
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
              color="orange darken-3"
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

            <template v-slot:item.public_access="{ value }">
              <v-chip
                :color="value.color"
                small
              >{{ value.text }}</v-chip>
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
                      <v-icon
                        color="orange"
                        class="mr-1"
                      >mdi-pencil-circle</v-icon>Ubah Data
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="postDeleteRecord(value)"
                    v-show="page.actions.delete"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
                        color="red"
                      >mdi-delete-circle</v-icon>Hapus Data
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
          <v-list
            subheader
            three-line
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
                    <v-list-item-subtitle>{{ item.description }} </v-list-item-subtitle>
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
                        <v-list-item
                          @click="editRecord(item.id)"
                          v-show="page.actions.edit"
                        >
                          <v-list-item-title>
                            <v-icon
                              class="mr-1"
                              color="orange"
                            >mdi-pencil-circle</v-icon>
                            Ubah Data
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="postDeleteRecord(item.id)"
                          v-show="page.actions.delete"
                        >
                          <v-list-item-title>
                            <v-icon
                              class="mr-1"
                              color="red"
                            >mdi-delete-circle</v-icon>
                            Hapus Data
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
            >mdi-circle</v-icon> Formulir Data CCTV
          </v-toolbar>
          <v-card-text class="mt-2">
            <v-col cols="12">
              <v-select
                label="Area"
                outlined
                dense
                hide-details
                :color="theme.color"
                v-model="record.area_uuid"
                :items="areas"
              />
            </v-col>
            <v-col col="12">
              <v-text-field
                outlined
                :color="theme.color"
                :hide-details="device.desktop"
                label="Nama Kamera"
                placeholder=""
                v-model="record.name"
                :filled="record.name"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Alamat"
                :color="theme.color"
                v-model="record.address"
                outlined
                dense
                hide-details
                rows="3"
              ></v-textarea>
            </v-col>
            <v-col cols=12>
              <v-text-field
                outlined
                :color="theme.color"
                :hide-details="device.desktop"
                label="Kontak"
                placeholder="Kontak yang bisa dihubungi"
                v-model="record.contact_person"
                :filled="record.contact_person"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols=12>
              <v-text-field
                outlined
                :color="theme.color"
                :hide-details="device.desktop"
                label="Nomor Telpon (WA)"
                placeholder=""
                v-model="record.phone"
                :filled="record.phone"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols=12>
              <v-text-field
                outlined
                :color="theme.color"
                :hide-details="device.desktop"
                label="URL RSTP"
                placeholder=""
                v-model="record.url"
                :filled="record.url"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="File Photo"
                append-outer-icon="attachment"
                v-model="filename"
                :color="theme.color"
                outlined
                dense
                @click:append-outer="uploadFile"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Kondisi"
                outlined
                dense
                hide-details
                :color="theme.color"
                v-model="record.status"
                :items="status"
              />
            </v-col>
            <v-col>
              <v-img
                height="100%"
                width="100%"
              >

                <l-map
                  style="height: 300px;width: 100%;z-index:9999; "
                  :zoom="zoom"
                  :center="center"
                  @update:center="centerUpdated"
                >
                  <v-geosearch
                    :options="geosearchOptions"
                    style="width:100px; border: 1px;"
                  ></v-geosearch>
                  <l-tile-layer
                    :url="url"
                    :attribution="attribution"
                  ></l-tile-layer>
                  <l-marker
                    :key="marker.id"
                    :visible="marker.visible"
                    :draggable="marker.draggable"
                    :lat-lng.sync="marker.position"
                  >

                    <l-icon
                      iconSize=32
                      icon-url="/images/icon-marker-merah.png"
                    />
                    <l-popup :content="marker.tooltip" />
                    <l-tooltip :content="marker.tooltip" />
                  </l-marker>
                </l-map>
              </v-img>

            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col :cols="device.desktop ? `6`:`12`">
                  <v-text-field
                    label="Garis Lintang"
                    outlined
                    dense
                    hide-details
                    v-model="record.lat"
                  ></v-text-field>
                </v-col>
                <v-col :cols="device.desktop ? `6`:`12`">
                  <v-text-field
                    label="Garis Bujur"
                    outlined
                    dense
                    hide-details
                    v-model="record.lng"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col>
                  <v-switch
                    label="Dapat diakses oleh public"
                    :color="theme.color"
                    v-model="record.public_access"
                    hide-details
                  ></v-switch>
                </v-col>
              </v-row>
            </v-col>

          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn
              outlined
              :color="theme.color"
              v-show=" !form.edit"
              @click="postAddNewRecord"
            >Tambah</v-btn>
            <v-btn
              outlined
              :color="theme.color"
              v-show="form.edit"
              @click="postUpdateRecord"
            >Ubah</v-btn>
            <v-btn
              outlined
              color="grey"
              @click="closeForm"
            >Batal</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>
    
<script >
import { mapActions, mapState } from "vuex";
import "animate.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPopup,
  LTooltip,
} from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import "leaflet/dist/leaflet.css";

export default {
  name: "pos",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    VGeosearch,
    LIcon,
    LPopup,
    LTooltip,
  },
  data: () => ({
    num: 1,
    headers: [
      {
        text: "NAMA",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "ALAMAT",
        value: "address",
        align: "start",
        sortable: false,
      },
      {
        text: "AREA",
        align: "start",
        sortable: false,
        value: "area",
      },
      {
        text: "AKSES PUBLIK",
        align: "center",
        sortable: false,
        value: "public_access",
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
    areas: [],
    status: [
      { text: "Baik", value: "baik" },
      { text: "Rusak", value: "rusak" },
    ],

    //map property
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="" style="color:brown">Pemerintahan Provinsi Banten</a>',
    zoom: 13,
    //-6.1716001, 106.6405384
    center: [-6.172895740201568, 106.15642547732148],

    geosearchOptions: {
      // Important part Here
      provider: new OpenStreetMapProvider(),
    },
    marker: {
      id: "m1",
      position: { lat: -6.1716001, lng: 106.6405384 },
      tooltip: "Pilih lokasi perlintasan",
      draggable: true,
      visible: true,
    },
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
      dataUrl: "api/superadmin/master-data/cctv",
      pagination: false,
      title: "MASTER DATA CCTV",
      subtitle: "Berikut Daftar Seluruh Data CCTV Yang Tersedia",
      showtable: true,
      breadcrumbs: [
        {
          text: "Data Master",
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
        add: true,
        edit: true,
        delete: true,
        bulkdelete: false,
        print: false,
        export: false,
        help: false,
      },
    });
    this.fetchRecords();
    this.fetchAreas();
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
      this.filename = null;
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 250);
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
        this.filename = this.record.foto;
        this.center = [this.record.lat, this.record.lng];
        this.marker.position = {
          lat: this.record.lat,
          lng: this.record.lng,
        };
        setTimeout(function () {
          window.dispatchEvent(new Event("resize"));
        }, 250);
      });
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
    uploadFile: function () {
      this.assignFileBrowse({
        fileType: [".jpg", ".jpeg", ".png"],
        query: {
          doctype: "apps",
        },
        callback: (response) => {
          setTimeout(() => {
            this.filename = response.name;
            this.record.foto = response.name;
          }, 500);
        },
      });
    },
    centerUpdated(center) {
      this.center = center;
    },
    getUserPosition: async function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          this.center = [pos.coords.latitude, pos.coords.longitude];
          this.marker.position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        });
      }
    },
    fetchAreas: async function () {
      try {
        let { data } = await this.http.get("api/combo/area");
        this.areas = data;
      } catch (error) {}
    },
  },
  watch: {
    "marker.position": {
      handler() {
        this.record.lat = this.marker.position.lat;
        this.record.lng = this.marker.position.lng;
      },
      deep: true,
    },
  },
};
</script>