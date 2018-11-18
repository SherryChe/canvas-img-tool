<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
	name: 'App',
};
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
[v-cloak] {
	display: none;
}
.box {
	z-index: 99999 !important;
}
.colorBtn {
	width: 25px !important;
	height: 25px !important;
	box-shadow: inset 0 0 7px rgba(0, 0, 0, 0.3);
	cursor: pointer;
}
</style>
