<template>
  <div id="app">
    <!-- <Todo items="./Todo.txt"/> -->
    <h2>TODO</h2>
    <hr>
    <Todo task-symbol='-' style="position:absolute"/>
    <Temperature />
  </div>
</template>

<script>
import Temperature from './components/Temperature.vue'
import Todo from './components/Todo.vue'

export default {
  name: 'app',
  components: {
    Temperature,
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
