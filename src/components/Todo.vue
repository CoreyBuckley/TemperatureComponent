<template>
<ul>
    <li v-for="(index, item) in todoItems" 
        :key="index"
    >
        {{ item }}
    </li>
</ul>
</template>

<script>
export default {
    name: "Todo",
    data () {
        return {
            todoItems: []
        }
    },
    async mounted () {
        let response = await fetch("/TodoItems");
        this.todoItems = response.json().items;
    }
}
</script>