class GameState {
    constructor() {
        this.currentLevel = 1;
        this.playerStats = {
            health: 100,
            coins: 0,
            upgrades: {
                unlockGun: false,
                unlockSword: false,
                unlockJump: false
            }
        };
    }
}