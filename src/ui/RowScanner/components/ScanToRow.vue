<template>
    <div>
        <h1>Scan to Row</h1>
        <div class="form-group block" v-for="(column, index) in columns">
            <label :for="`column-${index}`">{{column}}</label>
            <input type="text"
                   :id="`column-${index}`"
                   v-model="responses[index]"
                   v-focus="currentColumn === index"
                   @focus="currentColumn = index"
                   @keypress = "checkEnter($event, index)"
            >
        </div>
        <div class="block">
            <button class="blue" @click="submit">Add row</button>
            <button @click="loadColumns">Reload columns</button>
        </div>
        <div v-if="!columns.length">
            No columns detected. Make sure your header rows are labeled.
        </div>
        <div v-if="queue>0">
            {{saved}} of {{queue}} rows saved.
        </div>
        <div v-if="offline">
            <p>You are currently working offline. You can continue scanning, but your data will not be saved to the spreadsheet until you reconnect. Do not close this sidebar until you reconnect and all of your rows have saved.</p>
            <p><a href="#" @click.prevent="restartQueue">Try to reconnect</a>.</p>
        </div>

        <div id="queueError" v-if="queueError && !offline">

            Connection error

            <div class="block">
                <button class="blue" @click="restartQueue">Try again</button>
                <button @click="workOffline">Work offline</button>
            </div>
        </div>

    </div>
</template>
<script>
    import {focus} from "vue-focus";
    import Loader from "../../shared/Loader.vue";
    import {bigSuccess, error, success} from "../sounds";
    import {mapState} from "vuex";
    import {RowScanner} from "../../RowScanner";

    export default {
        components: {Loader},
        directives: {focus: focus},
        data(){
            return {
                columns: [],
                responses: [],
                currentColumn: 0,
                saved: 0,
                queue: 0,
                queueError: false,
                offline: false,
            }
        },
        mounted(){
          this.loadColumns();
        },
        computed: mapState({
          currentSheet: state => state.currentSheet,
        }),
        methods:{
            loadColumns(){
                this.$emit('loading');
                google.script.run.withSuccessHandler(result=>{
                    this.$emit('loaded');
                    this.currentColumn = 0;
                    this.columns.length = 0;
                    this.responses.length = 0;
                    for(let column of result){
                        this.columns.push(column);
                    }
                }).withFailureHandler(fail=>{
                    this.$emit('loaded');
                }).getColumnList();
            },
            checkEnter(e,index){
                if(e.keyCode === 13){
                    if(this.currentColumn+1 < this.columns.length){
                        this.currentColumn++;
                        this.playSound(success);
                    }
                    else{
                        this.submit();
                    }
                }
            },
            submit(){
                this.playSound(bigSuccess);
                this.queue++;
                RowScanner.addJob('addRow',this.responses,(e)=>{
                    this.saved++;
                    this.offline = false;
                    this.queueError = false;
                },(e)=>{
                    console.log(e);
                    if(!this.offline){
                        this.playSound(error);
                    }
                    this.queueError = true;

                });
                this.responses = [];
                this.currentColumn = 0;
            },
            playSound(sound){
                const audio = new Audio(sound);
                audio.play();
            },
            restartQueue(){
                this.queueError = false;
                this.offline = false;
                RowScanner.run();
            },
            workOffline(){
                this.offline = true;
                this.attemptReconnection();
            },
            attemptReconnection(){
                RowScanner.run();
                console.log('attempting to reconnect...');
                if(this.offline){
                    setTimeout(this.attemptReconnection, 10000);
                }
            }
        }
    }
</script>
<style lang="scss">
    #queueError{
        box-sizing: border-box;
        width:90%;
        position: fixed;
        height:150px;
        top:40px;
        left:5%;
        background: white;
        padding:10px;
        border-style:solid;
        border-width:1px;
        border-color: #888;
    }
</style>
