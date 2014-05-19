var exec = require('child_process').exec;

module.exports = {
    fifo: [],


    addAlbum: function(albumId) {
        log.info('albumId pushed to queue : ' + albumId);
        var i = this.fifo.indexOf(albumId);
        if (i === 0) {
            log.info('albumId already being treated - kill process ' + albumId);
            this.process.kill();
        } else if (i === -1) {
            log.info('albumId not in queue, pushing it ' + albumId);
            this.fifo.push(albumId);
            this.checkStart();
        }else{
            log.info('albumId '+ albumId +' already in queue in position ' + i);
        }
    },

    checkStart: function() {
        log.info('Entering checkstart');
        if (!this.process && this.fifo.length) {
            setTimeout(function(){
                process.nextTick(function() {
                    log.info('Entering nexTick');
                    if (!this.process && this.fifo.length) {
                        var albumId = this.fifo[0];
                        var zipFolder = config.uploadDir + '/' + albumId + '/' + config.originFolderName;
                        var zipFileDestination = config.uploadDir + '/' + albumId + '/archive.zip';
                        var zipCmd = 'cd ' + zipFolder + ' && zip -r ' + zipFileDestination + ' *';
                        log.info('executing ' + zipCmd);
                        this.process = exec(zipCmd, function(err, stdout, stderr) {
                            this.fifo.shift();
                            if (!err && !stderr) {
                                log.info('Archive successfully created for album ' + albumId);
                                log.info(stdout);
                            }else{
                                log.error('Unable to create archive - ' + stderr, err);
                            }
                            log.info('Deleting process and relaunch checkStart');
                            delete this.process;
                            this.checkStart();
                        }.bind(this));
                    }else{
                        log.warning('Exiting checkStart without treatment - after nextTick');
                    }
                }.bind(this));
            }, 1000);
        }else{
            log.warning('Exiting checkStart without treatment - before nextTick');
        }
    }
};