<template>
  <div
    class="mt-100"
    style="background-color:green;"
  >

    <img
      src="/images/bg-cctv-banten.jpg"
      alt="bg cctv"
      class="banner-hero"
      style="border-bottom-left-radius: 30px;"
    >
    <div style="width: 100%; border-top-right-radius: 30px; overflow: hidden;">
      <l-map
        style="height: 700px ; z-index:0 ;"
        :zoom="zoom"
        :center="center"
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
          v-for="item in markers"
          :key="item.id"
          :visible="item.visible"
          :draggable="item.draggable"
          :lat-lng.sync="item.position"
          @click="openVideo(item)"
        >

          <l-icon
            :icon-url="item.icon"
            :iconSize="item.size"
          />
          <l-tooltip :content="item.tooltip" />
        </l-marker>

      </l-map>
    </div>
    <div style="display: flex;width: 100%; justify-content: center;">
      <div style="top:400px; height: 100px; width: 200px; position: absolute;font-size: 20; background-color: red; border-radius: 40px; overflow: hidden;border: 5px solid green;">
        <img
          src="images/cctv.png"
          alt=""
          style="width: 100%;height: 100%;"
        >
      </div>
    </div>
    <v-col cols="12">
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="formcctv.show"
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
            >mdi-circle</v-icon> Pantau CCTV Provinsi Banten
          </v-toolbar>
          <v-card-text class="mt-1">
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
                <v-col
                  cols="12"
                  class="mt-3"
                >
                  <v-row>
                    <tbody>
                      <tr>
                        <td>Nama</td>
                        <td>&nbsp;:&nbsp;</td>
                        <td style="font-weight: bold;">{{ formcctv.record.name}}</td>
                      </tr>
                      <tr>
                        <td>Alamat</td>
                        <td>&nbsp;:&nbsp;</td>
                        <td>{{ formcctv.record.address}}</td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>&nbsp;:&nbsp;</td>
                        <td>
                          <div>
                            <v-chip
                              class="white--text"
                              small
                              :color="formcctv.record.status.color"
                            >{{ formcctv.record.status.text }}</v-chip>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-row>
                </v-col>
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
import { mapState, mapActions } from "vuex";
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
import JSMpeg from "@cycjimmy/jsmpeg-player";

export default {
  name: "banner-component",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    VGeosearch,
    LIcon,
    LPopup,
    LTooltip,
  },
  props: {},
  data: () => ({
    sliders: [],
    beritas: [],
    fotos: [],
    videos: [],
    video: {},
    //property map
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a style="color:green" target="_blank" href="#">Pemerintah Provinsi Banten</a>',
    zoom: 13,
    //-6.1716001, 106.6405384
    center: [-6.172895740201568, 106.15642547732148],

    geosearchOptions: {
      // Important part Here
      provider: new OpenStreetMapProvider(),
    },

    marker: {
      id: 1,
      position: { lat: -6.1716001, lng: 106.6405384 },
      tooltip: "KOTA TANGERANG OKE",
      draggable: false,
      visible: true,
    },

    progressbar: false,
    player: null,
    markers: [],

    formcctv: {
      show: false,
      record: {
        name: "",
        address: "",
        status: "",
      },
    },
  }),
  mounted() {
    this.setPage({
      crud: false,
    });
    this.fetchCctv();
  },

  computed: {
    ...mapState(["device", "http", "info", "theme"]),
  },
  methods: {
    ...mapActions(["setPage"]),
    fetchCctv: async function () {
      try {
        let { data } = await this.http.get("cctv-lists");
        this.markers = data;
      } catch (error) {}
    },
    openVideo: function (item) {
      try {
        this.formcctv.show = true;
        setTimeout(() => {
          this.progressbar = true;
          let canvas = document.getElementById("video");
          let url = `ws://localhost:9999?url=${encodeURIComponent(item.rstp)}`;
          //let url = `wss://cctv.bantenprov.go.id:9999?url=${encodeURIComponent(
          //   item.rstp
          // )}`;
          this.player = new JSMpeg.Player(url, {
            canvas: canvas,
            onSourceEstablished: (val) => this.onSourceCompleted(val),
          });

          this.formcctv.record.name = item.name;
          this.formcctv.record.address = item.address;
          this.formcctv.record.status = item.status;
        }, 500);
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
    closeForm: function () {
      this.formcctv.show = false;
    },
  },
};
</script>
  
  <style>
.number-statistik {
  font-size: 60px;
  color: white;
  text-align: center;
  font-weight: 600;
}
.title-statistik {
  font-size: 25px;
  color: white;
  text-align: center;
  font-weight: 600;
}
.slider-right {
  background-color: rgba(red, green, blue);
  height: 100vh;
}
.bg-black {
  --tw-bg-opacity: 1;
  background: linear-gradient(
    90deg,
    rgb(18, 18, 26) 0%,
    rgba(1, 1, 1, 1) 50%,
    rgba(52, 53, 57, 0) 100%
  );
  height: 100vh;
  width: 100%;
}

.container-title {
  margin-left: 7%;
  display: flex;
  position: absolute;
  height: 500px;
  margin-top: 100px;
  margin-bottom: 100px;
}

.slider-title {
  font-size: 40px;
  margin-top: 30px;
  font-weight: bold;
}
.slider-sub-title {
  max-width: 450px;
}

.slider-action {
  margin-top: 200px;
}

.digit {
  font-size: 60px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0;
}

.counter {
  margin-top: 50px;
  text-align: center;
}

.gallery-foto {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  flex-wrap: wrap;
}

.jmlpeserta {
  color: white;
  font-size: 30px;
  font-weight: 700;
}
.text-statistik-title {
  text-align: center;
}
.banner-hero {
  width: 100%;
  height: 450px;
}
</style>