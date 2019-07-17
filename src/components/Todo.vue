<template>
<div style="position:absolute;">
    <h2>TODO</h2>
    <hr>
    <ul>
        <!-- Am wrapping in span so I can use v-if in conjunction with v-for -->
        <span v-for="(item, index) in todoItems"
            :key="index"
        >
            <li v-if="!!item">{{ item }}</li>
        </span>
    </ul>
</div>
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
        let response = await fetch("/Todo");
        let text = await response.text();
        this.todoItems = text.split('-');
    }
}
</script>