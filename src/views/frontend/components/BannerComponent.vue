<template>
  <div
    class="mt-100"
    style="background-color: green;"
  >
    <img
      src="/images/city.jpeg"
      alt=""
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
        >

          <l-icon
            iconSize=32
            icon-url="/images/icon-marker-merah.png"
          />
          <l-popup :content="item.tooltip" />
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
    <v-col cols=12>

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
    zoom: 11,
    //-6.1716001, 106.6405384
    center: [-6.1716001, 106.6405384],

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

    markers: [],

    formcctv: {},
  }),
  mounted() {
    this.setPage({
      crud: false,
    });
    this.fetchSliders();
    this.fetchBerita();
    this.fetchLatestVideo();
    this.fetchVideos();
  },

  computed: {
    ...mapState(["device", "http", "info"]),
    player() {
      return this.$refs.youtube.player;
    },
  },
  methods: {
    ...mapActions(["setPage"]),
    fetchSliders: async function () {
      try {
        let { data } = await this.http.get("sliders");
        this.sliders = data;
      } catch (error) {}
    },
    playVideo() {
      this.player.playVideo();
    },
    playing() {
      console.log("o/ we are watching!!!");
    },
    fetchBerita: async function () {
      try {
        let { data } = await this.http.get("berita-kabupaten");
        this.beritas = data;
      } catch (error) {}
    },
    fetchFoto: async function () {
      try {
        let { data } = await this.http.get("api/gallery-foto");
        this.fotos = data;
      } catch (error) {}
    },
    fetchLatestVideo: async function () {
      try {
        let { data } = await this.http.get("show-latest-video");
        this.video = data;
      } catch (error) {}
    },
    fetchVideos: async function () {
      try {
        let { data } = await this.http.get("show-video");
        this.videos = data;
      } catch (error) {}
    },
    openDetailBerita: function (val) {
      window.open(
        "https://tangerangkab.go.id/detail-konten/show-berita/" + val
      );
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