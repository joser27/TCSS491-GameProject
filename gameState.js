class GameState {
    constructor() {
        this.currentLevel = 1;
        this.playerStats = {
            health: 100,
            coins: 0,
            upgrades: {
                berserkerMode: false,
                titanGuard: false,
                sharpenedSteel: false,
                gunslinger: false,
                shadowStep: false
            }
        };
    }
}