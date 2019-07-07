<!--
  TODO
  - Make thermometer bar scale with temperature returned from api
  - Make a slider for temperature unit
  - More data? Kind of like the compactness though.
  - Have colors change on time of day or weather condition?
  - Small animations of weather condition
-->

<template>
  <div class="temp-card">
    <svg>
      <circle cx="15" cy="150" r="20" class="no-top-stroke"/>
      <rect x="0" y="-10" ry="5" height="150" width="30" class="no-bottom-stroke"/>
      <rect x="2" y="10.7" ry="5" height="130" width="26" class="temp-indicator-bar"/>
    </svg>
    <div class="temp-info-container w-100">
      <div class="temp-display">
        {{ temperature }}<span v-if="unit === 'C'">&#8451;</span>
                        <span v-else-if="unit === 'F'">&#8457;</span>
      </div>
      <div class="temp-image-icons">
        <img class="weather-img"
            v-for="item in weather_items"
            :key="item.icon"
            :src="`https://openweathermap.org/img/w/${item.icon}.png`"
            :title="`${item.description}`"
        />
      </div>
      <footer class="address-lbl">
      {{ city }}
      </footer>
    </div>
    </div>
</template>

<script>
/* eslint-disable */

import {apiKey} from '../config.js';

// API docs: https://openweathermap.org/current
const WEATHER_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?APPID=${apiKey}&`

export default {
  name: 'Temperature',
  data () {
    return {
      temp: '',
      unit: '',
      weather_items: [],
      city: ''
    }
  },
  computed: {
    temperature: function () {
      if (this.unit === 'F') {
        this.unit = 'C';
        this.temp = Math.round((this.temp - 32) / 1.8);
      }
      else if (this.unit === 'C') {
        this.unit = 'F';
        this.temp = Math.round(this.temp * 1.8 + 32);
      }
      else if (this.unit === 'K') {
        //this.unit = 'C';
        //this.temp = Math.floor(this.temp - 273.15);
        this.unit = 'F';
        this.temp = Math.round(this.temp * 1.8 - 459.67);
      }
      return this.temp;
    }
  },
  mounted () {
    // Every 10 mins temp is updated via API call and reactive data binding.
    this.updateData();
    setInterval(this.updateData, 1000*60*10);
    $(".temp-card").draggable();
  },
  methods: {
    updateData: function () {
      window.navigator.geolocation.getCurrentPosition(pos => {
        fetch(WEATHER_ENDPOINT + `lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`).then(result => {
          result.json().then(json => {
            // OpenWeatherMap API returns temp in Kelvin by default.
            // Kelvin -> Celsius
            this.unit = 'K';
            this.temp = json.main.temp;
            this.weather_items = json.weather;
            this.city = json.name;
            console.log(json.weather);
            console.log(json.main.temp);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }, err => console.log(err));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.temp-card {
  display: flex;
  flex-direction: row;
  /*width: 20em;*/
  width: 7em;
  min-width: 7em;
  height: 10em;
  margin: auto;
  border: solid 1px rgba(60, 18, 247, 0.5);
  border-radius: 2px;
  box-shadow: 3px 2px rgba(0,0,0,.3);
  /* Cold */
  /*linear-gradient(to bottom right, rgba(195, 195, 255, 0.651), rgba(0, 0, 255, 0.527));*/
  /* Hot */
  /* linear-gradient(to bottom right, rgba(234, 20, 20, 0.651), rgba(255, 165, 0, 0.527)) */
  /* Temperate / Cloudy */
  /* linear-gradient(to bottom right, rgba(144, 151, 197, 0.651), rgba(11, 23, 112, 0.527)) */
  background-image: linear-gradient(to bottom right, rgba(236, 14, 155, 0.8), rgba(199,21,133, 0.6));
}
.temp-info-container {
  
}
.w-100 {
  width: 100%;
}
.temp-display {
  position: relative;
  font-size: 30px;
  font-weight: bolder;
  color: white
}
.address-lbl {
  color: white;
  text-shadow: 1px 1px black;
  padding-top: 60px;
  padding-left: 2px;
}
.weather-img {
  /* position: relative;
  width: 50px;
  top: -112px;
  left: 25px; */
  width: 35px;
  height: 42px;
}
rect {
  fill: rgba(206, 191, 191, 0.493);
  stroke: black;
  stroke-width: 2px;
}
circle {
  fill: red;
  stroke: black;
  stroke-width: 2px;
}
svg {
  overflow: visible;
  width: 35px;
}
/* https://stackoverflow.com/questions/8976791/how-to-set-a-stroke-width1-on-only-certain-sides-of-svg-shapes */
rect.no-bottom-stroke { stroke-dasharray: 170.5,30; }
circle.no-top-stroke { stroke-dasharray: 78,34; }
rect.temp-indicator-bar {
  fill: red;
  stroke: none;
}
</style>
