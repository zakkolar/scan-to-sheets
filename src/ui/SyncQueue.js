const locks = require('locks');
class QueueJob{

        constructor(action, args, success, fail){
        this.action = action;
        this.args = args;
        this.success = success || function(){};
        this.fail = fail || function(){};

    }
}

export class SyncQueue {

    constructor(){
        this.running = locks.createMutex();
        this.jobs = [];
    }

    setGoogle(google){
        this.google = google;
        this.run();
    }


    addJob(action, args, success, fail){

    const job = new QueueJob(action, args, success || null, fail || null);
    this.jobs.push(job);
    this.run();
}


run(){
    const queue = this;
    this.running.lock(()=>{
        if(this.jobs.length>0 && this.google!=null){

            const job = this.jobs.shift();

            this.google.script.run.withSuccessHandler((result)=>{
                job.success(result);
                this.running.unlock();
                this.run();
            })
                .withFailureHandler((fail)=>{
                    this.jobs.unshift(job);
                    job.fail(fail);
                    this.running.unlock();
                })[job.action](job.args);

            // const promise = queue.google.call([{
            //     methodname: job.action,
            //     args:job.args
            // }]);
            //
            // promise[0].always(function(){
            //     queue.running.unlock();
            //     queue.run();
            // }).done(function(r){
            //     job.done(r);
            // });
        }
        else{
            this.running.unlock();
        }

    });
}

}
