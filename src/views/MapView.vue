<template>
  <div class="about" style="height: 800px">
    <l-map ref="map" v-model:zoom="zoom" :center="center" @click="addMarker">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <template v-for="(marker, index) in markers" :key="index">
        <l-marker :lat-lng="marker" :name="marker.title">
          <l-tooltip :content="marker.title" />
        </l-marker>
      </template>
    </l-map>
    <modal-window ref="markerModal">
      <div class="mb-2">
        <label for="">Назва</label>
        <div>
          <input
            type="text"
            name="title"
            v-model="marker.title"
            ref="titleInput"
            @keydown.enter="$refs.markerModal.confirm"
          />
        </div>
      </div>
      <div class="mb-2">
        <label for="">Широта</label>
        <div>
          <input type="text" name="lat" v-model="marker.lat" disabled />
        </div>
      </div>
      <div class="mb-2">
        <label for="">Довгота</label>
        <div>
          <input type="text" name="lng" v-model="marker.lng" disabled />
        </div>
      </div>
    </modal-window>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";

import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import ModalWindow from "@/components/Modal";

export default {
  name: "MapView",
  components: {
    ModalWindow,
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
  },
  data: () => ({
    zoom: 6,
    center: [47.823125, 32.71153],
    markers: [],
    marker: {},
  }),
  created() {
    this.markers = JSON.parse(localStorage.getItem("markers")) || [];
  },
  methods: {
    addMarker(e) {
      if (!e.latlng) return;
      this.marker = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      this.$refs.markerModal
        .open(() => {
          this.$nextTick(() => {
            this.$refs.titleInput.focus();
          });
        })
        .then(() => {
          this.markers.push({
            title: this.marker.title,
            lat: this.marker.lat,
            lng: this.marker.lng,
          });
          this.updateLocalStorage();
        })
        .finally(() => {
          this.marker = {};
        });
    },
    updateLocalStorage() {
      localStorage.setItem("markers", JSON.stringify(this.markers));
    },
  },
};
</script>
