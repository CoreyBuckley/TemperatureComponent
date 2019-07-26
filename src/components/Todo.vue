<template>
    <ul>
        <!-- Am wrapping in span so I can use v-if in conjunction with v-for -->
        <span v-for="(item, index) in todoItems"
            :key="index"
        >
            <li v-if="!!item && typeof item === 'string' && !item.startsWith('//')"
                :class="getTaskItemType(item)"
            >
                    {{ item | removeSemantics }}
            </li>
            <li v-else-if="typeof item === 'object'">
                <Todo :data="item" />
            </li>
        </span>
    </ul>
</template>

<script>
export default {
    name: "Todo",
    props: {
        subtaskSymbol: String,
        data: Array
    },
    data () {
        return {
            todoItems: [],
        }
    },
    async mounted () {
        if (this.data === undefined) {
            let response = await fetch("/Todo");
            let text = await response.text();
            this.todoItems = this.prepareNestings(text);
            // this.todoItems = this.todoItems.map(item => item.split('>>')).flat();
        }
        else {
            this.todoItems = this.data;
        }
    },
    methods: {
        prepareNestings (taskText) {
            let newArr = [];
            let items = taskText.split('\n').splice(1).filter(item => !!item && !item.startsWith('//')).map(item => item.trim());
            return this.constructNestings(items, this.subtaskSymbol);
        },
        constructNestings (items, subtaskSymbol) {
            let newArr = [];
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item.startsWith(subtaskSymbol + ' ')) {
                    let subitemsBlock = this.startsWithSequence(items, subtaskSymbol, i);
                    newArr.push(this.constructNestings(subitemsBlock, subtaskSymbol + subtaskSymbol[0]));
                    i += subitemsBlock.length - 1;
                }
                else {
                    newArr.push(item);
                }
            }
            return newArr;
        },
        startsWithSequence (arr, pattern, i) {
            if (i === undefined) i = 0;
            let newArr = [];
            while (i < arr.length) {
                if (arr[i].startsWith(pattern)) {
                    newArr.push(arr[i]);
                }
                else {
                    break;
                }
                i++;
            }
            return newArr;
        },
        getTaskItemType(item) {
            if (item.startsWith('*')) {
                return "remark";
            }
            else if (item.toLowerCase().indexOf('[x]') == -1) {
                return "unchecked";
            }
            else {
                return "checked";
            }
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
            // Remove any task syntax.
            scrubbedItem = scrubbedItem.split('-').join('');
            // Remove any sublist syntax.
            scrubbedItem = scrubbedItem.split('>').join('');
            // Remove any comments / remarks.
            scrubbedItem = scrubbedItem.split('*').join('');
            return scrubbedItem.trim();
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
.remark {
    font-style: italic;
    text-indent: 2%;
}
</style>