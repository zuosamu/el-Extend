<template>
  <el-cascader v-model="val" :options="option"  v-on="$listeners" v-bind="$attrs"/>
</template>
<script>
import { getHandle, flatData } from '../utils';

export default {
    data() {
        return {
            option: [],
            loading: false
        };
    },
    props: ['value', 'options'],
    computed: {
        val: {
            get() {
                return this.value;
            },
            set(val) {
                this.handlerValue(val);
            }
        }
    },
    async created() {
        this.option = await this.getOption(this.options);
    },
    methods: {
        handlerValue(val) {
            this.$emit('update:value', val);
        },
        async getOption(option) {
            const { handle, path, fn } = getHandle(option);
            const data = await handle();
            const dataCache = flatData(path, data);
            return dataCache.data.map(fn);
        }
    }
};
</script>

<style>
</style>
