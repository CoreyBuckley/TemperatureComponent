<template>
    <ul>
        <!-- Am wrapping in span so I can use v-if in conjunction with v-for -->
        <span v-for="(item, index) in todoItems"
            :key="index"
        >
            <li v-if="!!item && !item.startsWith('//') && !item.startsWith('>>')"
                :class="item.toLowerCase().indexOf('[x]') == -1 ? 'unchecked' : 'checked'"
            >
                    {{ item | removeSemantics }}
                    <Todo v-if="item.indexOf('>>') != -1" :data="item.substr(item.indexOf('>> ') + 3).split(' >')" />
                    <!-- <ul v-if="item.indexOf('>>') != -1">
                        <li
                    </ul> -->
            </li>
            <li v-else-if="item.startsWith('>>')">
                <Todo :data="todoItems.filter(item => item.startsWith('>>')).map(item => item.substr('>>'.length + 1))" />
            </li>
        </span>
    </ul>
</template>

<script>
export default {
    name: "Todo",
    props: {
        taskSymbol: String,
        data: Array
    },
    data () {
        return {
            todoItems: [],
            depth: 1
        }
    },
    async mounted () {
        console.log("task symbol is: " + this.taskSymbol);
        if (this.data === undefined) {
            let response = await fetch("/Todo");
            let text = await response.text();
            this.todoItems = text.split(this.taskSymbol);
            // this.todoItems = this.todoItems.map(item => item.split('>>')).flat();
        }
        else {
            this.todoItems = this.data;
        }
    },
    filters: {
        removeSemantics (value) {
            let lowerResult = value.split('[x]');
            let upperResult = value.split('[X]');
            let scrubbedItem = value;
            // Remove syntax for marking a todo item as complete.
            if (lowerResult.length > 1) {
                scrubbedItem = lowerResult[0].trim();
            }
            else if (upperResult.length > 1) {
                scrubbedItem = upperResult[0].trim();
            }
            // Remove any sublist syntax.
            scrubbedItem = scrubbedItem.split('>').join('');
            // Remove any comments / remarks.
            scrubbedItem = scrubbedItem.split('*');
            return scrubbedItem[0].trim();
        }
    }
}
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}
li {
    margin-top: 2px;
    padding: 3px 0px 3px 25px;
    margin: 0;
}
.checked {
    background: url('../assets/checkedbox.png') no-repeat left top;
}
.unchecked {
    background: url('../assets/uncheckedbox.png') no-repeat left top;
}
</style>