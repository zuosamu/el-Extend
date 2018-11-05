<template>
<div class="datePicker" >
    <el-date-picker
		v-model="timePicker"
		:type="type"
		v-on="$listeners"
		v-bind="$attrs"
		style="width:100%; border:none;" >
	</el-date-picker>
    <div>
        <el-button
			v-for="(item,index) in days"
			:key="index"
			class="datePicker-btn"
			size="mini"
			:class="{actived:day===item}"
			@click="timePick(item)">
			{{`近${item}天`}}
		</el-button>
    </div>
    </div>
</template>

<script>
import {
  initTimes,
  initTimeSeconds,
  differenceDays
} from "../timePickerRestrict";

export default {
  data() {
    return {
      day: this.defaultDay
    };
  },
  props: ["value", "days", "defaultDay", "type"],
  computed: {
    timePicker: {
      get() {
        this.day = differenceDays(this.value);
        return this.value;
      },
      set(val) {
        // 2018年7月19日修改
        if (!val) {
          val = [];
        }
        this.formatTimePicker(val);
      }
    }
  },
  methods: {
    formatTimePicker(timePicker) {
      this.$emit("update:value", timePicker);
    },
    timePick(number) {
      this.day = number;
      this.timePicker =
        this.type === "daterange" ? initTimes(number) : initTimeSeconds(number);
    }
  }
};
</script>

<style>
.datePicker {
  display: flex;
  border: 1px solid rgb(201, 201, 201);
  justify-content: space-between;
  height: 32px;
  border-radius: 4px;
}
.datePicker > div:first-child {
  display: flex;
  flex: 1;
}
.datePicker > div:last-child {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.datePicker-btn {
  float: right;
  border: none;
  margin: 5px;
  border-radius: 4px;
  background: #ebecf0;
  color: #999999;
}
.datePicker-btn:hover {
  background: #3aa3ff;
  color: #fff;
}
.actived {
  color: #fff;
  background: #2d87ff;
}
</style>
