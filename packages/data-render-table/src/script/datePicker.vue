<template>
    <el-date-picker  v-model="timePicker" v-on="$listeners" v-bind="$attrs"></el-date-picker>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: ['value'],
    computed: {
        timePicker: {
            get() {
                return this.value;
            },
            set(val) {
                this.formatTimePicker(val);
            }
        }
    },
    methods: {
        formatTimePicker(timePicker) {
            this.$emit('update:value', timePicker);
        }
    }
};
</script>

<style>
</style>
