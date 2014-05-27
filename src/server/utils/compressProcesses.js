var exec = require('child_process').exec;
var gm = require("gm").subClass({ imageMagick: true });
var AlbumFactory = require(config.serverDir + '/model/album/AlbumFactory');

module.exports = {
    fifo: [],


    addImage: function(_id, file) {
        object = {albumId:_id, image:file};
        log.info('image pushed to queue : ', object);
        var i = this.fifo.indexOf(object);
        if (i === 0) {
            log.warning('image already being treated', object);
        } else if (i === -1) {
            log.info('image not in queue, pushing it ', object);
            this.fifo.push(object);
            this.checkStart();
        }else{
            log.info('image already in queue', object);
        }
    },

    checkStart: function() {
        log.info('Entering checkstart image');
        if (!this.process && this.fifo.length) {
            setTimeout(function(){
                process.nextTick(function() {
                    log.info('Entering nexTick');
                    if (!this.process && this.fifo.length) {
                        this.process = true;
                        var object = this.fifo.shift();
                        var image = object.image;
                        // compress image
                        Promise.all([

                            // Image Size
                            new Promise(function(resolve, reject) {
                                // size of image
                                gm(image.thumbnails.origin.dir).size(function(err, val) {
                                    image.thumbnails.origin.size = val;
                                    log.info('size', val);
                                    resolve();
                                })
                            }.bind(this)),

                            new Promise(function(resolve, reject) {
                                // miniature
                                gm(image.thumbnails.origin.dir)
                                    .autoOrient()
                                    .resize(null, 300)
                                    .gravity('Center')
                                    .write(image.thumbnails.miniature.dir, function(err) {
                                        if (err) {
                                            reject(err);
                                            log.error('error for mini', err);
                                            return;
                                        }
                                        log.info ("writing : " + image.thumbnails.miniature.dir);

                                        // size
                                        gm(image.thumbnails.miniature.dir).size(function(err, val) {
                                            image.thumbnails.miniature.size = val;
                                            log.info('size', val);
                                            resolve();
                                        })
                                    }.bind(this))
                            }.bind(this)),

                            new Promise(function(resolve, reject) {
                                // slideshow
                                gm(image.thumbnails.origin.dir)
                                    .autoOrient()
                                    .resize(null, 1000 + '>')
                                    .write(image.thumbnails.slideshow.dir, function(err) {
                                        if (err) {
                                            reject(err);
                                            log.error('error for slideshow', err);
                                            return;
                                        }
                                        log.info ("writing : " + image.thumbnails.slideshow.dir);
                                        // size
                                        gm(image.thumbnails.slideshow.dir).size(function(err, val) {
                                            image.thumbnails.slideshow.size = val;
                                            log.info('size', val);
                                            resolve();
                                        })
                                    }.bind(this))
                            }.bind(this))
                        ]).then(function(){
                            //todo save image !!
                            log.success('Image completely treated', object);
                            var albumFactory = new AlbumFactory(this.db);
                            return albumFactory.updateFile(object.albumId, image).then(function(){
                                this.process = false;
                                this.checkStart();
                            }.bind(this));

                        }.bind(this)).catch(function(err){
                            log.error(err);
                            this.process = false;
                            this.checkStart();
                        }.bind(this));


                    }else{
                        log.warning('Exiting checkStart without treatment - after nextTick');
                    }
                }.bind(this));
            }.bind(this), 1000);
        }else{
            log.warning('Exiting checkStart without treatment - before nextTick');
        }
    }
};

