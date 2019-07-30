<template>
  <div id="app">
    <!-- <Todo items="./Todo.txt"/> -->
    <h2>TODO</h2>
    <hr>
    <Todo subtask-symbol='>' style="position:absolute"/>
    <Temperature-Slim />
  </div>
</template>

<script>
import TemperatureSlim from './components/TemperatureSlim.vue'
import Todo from './components/Todo.vue'

export default {
  name: 'app',
  components: {
    TemperatureSlim,
    Todo
  }
}
</script>

<style>
body {
  background-color: darkgray;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
