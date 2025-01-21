<template>
	<ul class="container-aside">
		<li v-for="(funcs, index) of asideFunctionalities" :key="index">
			<router-link :to="funcs.link" active-class="active">{{ funcs.name }}</router-link>
		</li>
	</ul>
</template>

<script>
export default {
	props: {

	},
	data() {
		return {
			asideFunctionalities: [
				{
					name: "Convenios Universidades",
					link: "/convenios-universidades",
				},
				{
					name: "Comparar Universidades",
					link: "/comparar-universidades",
				},
			],
		}
	}
}

</script>

<style scoped>
.container-aside{
	width: 20%;
	background-color: #DDDDDD;
}

ul {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
	width: auto;
	list-style: none;
}

li {
	width: auto;
	list-style-type: none;
}

a {
	display: block;
	text-decoration: none;
	color: black;
	padding: 2em 1em;
}

a:hover {
	background-color: #d3d3d3;
	font-weight: bold;
}

a:active {
	background-color: #d3d3d3;
}

.active {
	background-color: #bcbcbc;
	font-weight: bold;
}

</style>