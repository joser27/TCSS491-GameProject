class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
        this.fonts = [];
    };

    queueDownload(path) {
        console.log("Queueing " + path);
        if (path.toLowerCase().endsWith('.ttf')) {
            this.downloadQueue.push({ path, type: 'font' });
        } else if (path.toLowerCase().endsWith('.png')) {
            this.downloadQueue.push({ path, type: 'image' });
        } else if (path.toLowerCase().endsWith('.mp3')) {
            this.downloadQueue.push({ path, type: 'music' });
        }
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const item = this.downloadQueue[i];
            
            if (item.type === 'font') {
                fetch(item.path)
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                        const fontName = item.path.split('/').pop().split('.')[0];
                        const font = new FontFace(fontName, buffer);
                        return font.load();
                    })
                    .then(loadedFont => {
                        document.fonts.add(loadedFont);
                        this.fonts[item.path] = loadedFont;
                        console.log("Loaded font " + item.path);
                        this.successCount++;
                        if (this.isDone()) callback();
                    })
                    .catch(error => {
                        console.log("Error loading font " + item.path);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });
            } else if (item.type === 'image'){
                const img = new Image();
                img.addEventListener("load", () => {
                    console.log("Loaded " + img.src);
                    this.successCount++;
                    if (this.isDone()) callback();
                });

                img.addEventListener("error", () => {
                    console.log("Error loading " + img.src);
                    this.errorCount++;
                    if (this.isDone()) callback();
                });
                img.addEventListener("error", () => {
                    console.log("Error loading " + img.src);
                    this.errorCount++;
                    if (this.isDone()) callback();
                });

                img.src = item.path;
                this.cache[item.path] = img;
            } else if (item.type === 'music'){
                const aud = new Audio();
                aud.addEventListener("loadeddata", () => {
                    console.log("Loaded " + aud.src);
                    this.successCount++;
                    if (this.isDone()) callback();
                });
    
                aud.addEventListener("error", () => {
                    console.log("Error loading " + aud.src);
                    this.errorCount++;
                    if (this.isDone()) callback();
                });

                aud.addEventListener("ended", function () {
                    aud.pause();
                    aud.currentTime = 0;
                });

                aud.src = item.path;
                aud.load();
                this.cache[item.path] = aud;
            }
        }
    };

    getAsset(path) {
        return this.cache[path] || this.fonts[path];
    };

    playAsset(path) {
        let audio = this.cache[path];
        if (audio.currentTime != 0) {
            let bak = audio.cloneNode();
            bak.currentTime = 0;
            bak.volume = audio.volume;
            bak.muted = audio.muted;
            bak.play();
        } else {
            audio.currentTime = 0;
            audio.play();
        }
    };

    muteAudio(mute) {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.muted = mute;
            }
        }
    };

    adjustVolume(volume) {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.volume = volume;
            }
        }
    };

    pauseBackgroundMusic() {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    };

    autoRepeat(path) {
        var aud = this.cache[path];
        aud.addEventListener("ended", function () {
            aud.play();
        });
    };
};