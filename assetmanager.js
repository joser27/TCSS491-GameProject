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
        } else {
            this.downloadQueue.push({ path, type: 'image' });
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
            } else {
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

                img.src = item.path;
                this.cache[item.path] = img;
            }
        }
    };

    getAsset(path) {
        return this.cache[path] || this.fonts[path];
    };
};

