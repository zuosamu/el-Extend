<template>
  <el-select v-model="val" :loading="loading" :remote-method="remoteMethod" v-on="$listeners" v-bind="$attrs">
    <el-option v-for="item in option"  :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
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
        const { remote, filterable } = this.$attrs;
        if (remote && filterable) return;
        const isPromise = this.options && this.options[0];
        if (!(typeof isPromise === 'function')) {
            this.option = isPromise;
        } else {
            this.option = await this.getOption(this.options);
        }
    },
    methods: {
        handlerValue(val) {
            this.$emit('update:value', val);
        },
        async getOption(option, param = '') {
            const { handle, path, fn } = getHandle(option);
            const data = await handle(param);
            const dataCache = flatData(path, data);
            return dataCache.data.map(fn);
        },
        async remoteMethod(param) {
            this.loading = true;
            this.option = await this.getOption(this.options, param);
            this.loading = false;
        }
    }
};
</script>

<style>
</style>
