<!--
  TODO
  - Make thermometer bar scale with temperature returned from api [X]
    - Remark: math scaling in fahrenheit (so other units converted first)
  - Make a slider for temperature unit
  - More data? Kind of like the compactness though.
  - Have colors change on time of day or weather condition?
  - Small animations of weather condition
  - Maybe indicate time or night / day somehow?
    - If night, background is dark
      - If cold, background is dark cool colors
      - Elseif hot, background is dark warm colors
    - If day, background is bright
      - If cold, background is bright cool colors
      - Elseif hot, background is bright warm colors
  - Fix so unit doesn't change on update [X]
  - How to deal with text that breaks boundaries? Ex. Long city names. Temp in 100s for F.
  - Make one where thermometer fits into container.
  - Refresh button? Will fetch temp from remote API and update. (Add debounce so API can't be spammed?)
-->

<template>
  <div class="temp-card">
    <svg>
      <circle cx="15" cy="150" r="20" class="no-top-stroke"/>
      <rect x="0" y="-10" ry="5" height="150" width="30" class="no-bottom-stroke"/>
      <!-- <rect x="2" y="10.7" ry="5" height="130" width="27" class="temp-indicator-bar"/> -->
      <rect x="1" :y="130 - Math.min(150 * (fahrenheit_temp / MAX_THERM_TEMP), 150) + 10.7" ry="5" :height="Math.min(150 * (fahrenheit_temp / MAX_THERM_TEMP), 150)" width="28" class="temp-indicator-bar"/>
    </svg>
    <div class="temp-info-container w-100">
      <div class="temp-display">
        <!-- Width varies depending on unit. Kelvin values
             typically larger (hundreds) so needs more width.
        -->
        <div
        :class="unit === 'C' || unit === 'F' ? 'temp-number-imperial-or-metric' : 'temp-number-kelvin'"
        >
          {{ temp | round }}
        </div>
        <div class="unit-container"
             v-on:click="getTemperature"
        >
          <span v-if="unit === 'C'" class="unit-display">&#8451;</span>
          <span v-else-if="unit === 'F'" class="unit-display">&#8457;</span>
          <span v-else-if="unit === 'K'" class="unit-display">&#8490;</span>
        </div>
      </div>
      <div class="temp-image-icons">
        <img class="weather-img"
            v-for="item in weather_items"
            :key="item.icon"
            :src="`https://openweathermap.org/img/w/${item.icon}.png`"
            :title="`${item.description}`"
        />
      </div>
      <footer class="metainfo">
        <span class="address-lbl">{{ city }}</span>
        <span class="updated-at"><i>Last updated at:</i> {{ updatedAt }}</span>
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
      updatedAt: '',
      city: ''
    }
  },
  computed: {
    // Returns the maximum temperature the
    // temperature indicator bar will scale up to (in fahrenheit)
    MAX_THERM_TEMP () {
      return 105;
    },
    fahrenheit_temp () {
      if (this.unit === 'F') {
        return this.temp;
      }
      else if (this.unit === 'C') {
        return this.temp * 1.8 + 32;
      }
      else if (this.unit === 'K') {
        return this.temp * 1.8 - 459.67;
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
          // TODO On update the temp unit will change to fahrenheit. Change so it adjusts to whatever
          //      unit is set (if there is one, else default to F)
          // DONE
          result.json().then(json => {
            // OpenWeatherMap API returns temp in Kelvin by default.
            // Kelvin -> Fahrenheit
            if (this.unit === '' || this.unit === 'F') {
              this.temp = json.main.temp * 1.8 - 459.67;
              this.unit = 'F';
            }
            else if (this.unit === 'C') {
              this.temp = json.main.temp - 273.15;
              this.unit = 'C';
            }
            else {
              this.temp = json.main.temp;
              this.unit = 'K';
            }
            this.weather_items = json.weather;
            this.city = json.name;
            this.updatedAt = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            console.log(json.weather);
            console.log(json.main.temp);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }, err => console.log(err));
    },
    getTemperature: function () {
      if (this.unit === 'F') {
        this.unit = 'C';
        this.temp = (this.temp - 32) / 1.8;
      }
      else if (this.unit === 'C') {
        // this.unit = 'F';
        // this.temp = Math.round(this.temp * 1.8 + 32);
        this.unit = 'K';
        this.temp = this.temp + 273.15;
      }
      else if (this.unit === 'K') {
        //this.unit = 'C';
        //this.temp = Math.floor(this.temp - 273.15);
        this.unit = 'F';
        this.temp = this.temp * 1.8 - 459.67;
      }
      return this.temp;
    }
  },
  filters: {
    round: function(value) {
      return Math.round(value);
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
  /* border: solid 1px rgba(60, 18, 247, 0.5); */
  border: solid 2px black;
  border-radius: 2px;
  box-shadow: 3px 2px rgba(0,0,0,.3);
  /* Cold */
  /*linear-gradient(to bottom right, rgba(195, 195, 255, 0.651), rgba(0, 0, 255, 0.527));*/
  /* Hot */
  /* linear-gradient(to bottom right, rgba(234, 20, 20, 0.651), rgba(255, 165, 0, 0.527)) */
  /* Temperate / Cloudy */
  /* linear-gradient(to bottom right, rgba(144, 151, 197, 0.651), rgba(11, 23, 112, 0.527)) */
  /*background-image: linear-gradient(to bottom right, rgba(236, 14, 155, 0.8), rgba(199,21,133, 0.6));*/
  background-image: linear-gradient(to top right, rgba(0, 55, 255, 0.8), rgba(21, 177, 199, 0.6));
}
.temp-info-container {
  display: block;
}
.w-100 {
  width: 100%;
}
.temp-display {
  display: flex;
  position: relative;
  font-size: 30px;
  top: 5px;
  font-weight: bolder;
  color: white
}
.temp-number-imperial-or-metric {
  width: 37px;
}
.temp-number-kelvin {
  width: 49px;
}
footer.metainfo {
  text-align: right;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
}
.address-lbl {
  color: white;
  text-shadow: 1px 1px black;
  font-weight: bold;
  padding-top: 30px;
}
.updated-at {
  font-size: 10px;
  color: white; 
  font-weight: bold;
  position: relative;
  right: 2px;
}
.weather-img {
  width: 35px;
  height: 42px;
}
.unit-container {
  display: inline-block;
  background-color: rgba(100,100,100,0.4);
  border: solid rgba(100,100,100,0.4) 1px;
  border-radius: 4px;
  margin-left: 2px;
  position: relative;
  top: -0.5px;
  box-shadow: 1px 2px rgba(0,0,0,0.3);
  cursor: pointer;
}
.unit-container:hover {
  text-shadow: black 2px 2px;
}
.unit-display {
  transition: text-shadow 0.3s;
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
/* rect.temp-indicator-bar-full {
  height: 150px;
  y: -9.3;
} */
</style>
