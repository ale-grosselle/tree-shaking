<template>
    <div class="btn waves-effect waves-light" @click="onclick">
        <slot></slot>
        <i v-if="materialIconName" class="material-icons" :class="cssClassIcon">
            {{materialIconName}}
        </i>
    </div>
</template>

<script type="application/javascript">
// @flow

const name = "th-modal";

//Button has only css, not JS.
export default {
	install: function(Vue){
		Vue.component(name, BtnComponent);
    },
	// declare the props
	props: {
		materialIconName: String,
		iconClass: {
			type: String,
			default: ""
		},
		iconPosition: {
			type: String,
			validator: function(value: string): boolean {
				return value === "left" || value === "right";
			},
			default: "left"
		}
	},
	computed: {
		cssClassIcon(): string {
			return this.iconClass + " " + this.iconPosition;
		}
	},
	methods: {
		onclick(e: Event) {
			this.$emit("click", e);
		}
	},
	mounted: function() {
		console.log("I AM MODAL");
	}
};
</script>

<style lang="scss">
    h1.modal{
        background-color: red;
    }
</style>
