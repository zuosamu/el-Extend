<template>
	<div class="customHourMin">
		<el-input :min="0" v-model.number="day" @change="computeTime(day,hour)"></el-input>天<el-input v-model.number="hour" @change="computeTime(day,hour)"></el-input>小时及以上
		<span v-show="false">{{value}}</span>
	</div>
</template>

<script>
export default {
  data() {
    return {
      hour: "",
      day: ""
    };
  },
  props: ["value"],
  methods: {
    formatterTime(time) {
      let hour = time / 3600;
      const day = Math.floor(hour / 24);
      hour %= 24;
      this.day = day;
      this.hour = hour;
    },
    computeTime(day, hour) {
      if (Number.isNaN(day)) {
        this.day = 0;
        return;
      }
      if (Number.isNaN(hour)) {
        this.hour = 0;
        return;
      }
      const second = day * 24 * 3600 + hour * 3600;
      this.$emit("update:value", second);
      this.formatterTime(second);
    }
  }
};
</script>

<style>
.customHourMin {
  display: flex;
}
.customHourMin > div {
  flex: 1;
}
</style>
