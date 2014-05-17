var exec = require('child_process').exec;

module.exports = {
    fifo: [],


    addAlbum: function(albumId) {
        log.info('albumId pushed to queue : ' + albumId);
        var i = this.fifo.indexOf(albumId);
        if (i === 0) {
            this.process.kill();
        } else if (i === -1) {
            this.fifo.push(albumId);
            this.checkStart();
        }
    },

    checkStart: function() {
        if (!this.process && this.fifo.length) {
            process.nextTick(function() {
                var albumId = this.fifo[0];
                var zipFolder = config.uploadDir + '/' + albumId + '/' + config.originFolderName;
                var zipFileDestination = config.uploadDir + '/' + albumId + '/archive.zip';
                var zipCmd = 'cd ' + zipFolder + ' && zip -r ' + zipFileDestination + ' *';
                log.info('executing ' + zipCmd);
                this.process = exec(zipCmd, function(err, stdout, stderr) {
                    this.fifo.shift();
                    if (!err && !stderr) {
                        log.info(stdout);
                    }else{
                        log.error('Unable to create archive - ' + stderr, err);
                    }
                    delete this.process;
                    this.checkStart();
                }.bind(this));
            }.bind(this));
        }
    }
};