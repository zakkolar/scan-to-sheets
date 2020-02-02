<template>
    <div>
        <loader v-if="loading"></loader>
        <div class="sidebar" v-show="!loading">
            <scan-to-row v-on:loading="loading = true" v-on:loaded="loading = false"></scan-to-row>
        </div>
    </div>
</template>

<script>
    import ScanToRow from "./ScanToRow.vue";
    import Loader from "../../shared/Loader.vue";
    export default {
        components: {
            ScanToRow,
            Loader
        },
        data(){
            return {
                loading:false
            }
        }
    }
</script>
<style lang="scss">

</style>
