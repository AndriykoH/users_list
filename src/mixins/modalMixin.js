export default {
    props: {
        visible: {
            require: true
        }
    },
    computed: {
        visibility: {
            get() {
                return this.visible;
            },
            set() {
                this.$emit('close')
            }
        }
    }
}