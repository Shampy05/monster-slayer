function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: []
        }
    },
    computed: {
        monsterHealthBarStyles() {
            return this.monsterHealth >= 0 ? { width: this.monsterHealth + '%' } : { width: 0 }
        },

        playerHealthBarStyles() {
            return this.playerHealth >= 0 ? { width: this.playerHealth + '%' } : { width: 0 }
        },

        isSpecialAttackAvailable() {
            return this.currentRound % 3 !== 0
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw'
            } else if (value <= 0) {
                this.winner = 'monster'
            }
        },

        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw'
            } else if (value <= 0) {
                this.winner = 'player'
            }
        }
    },
    methods: {
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(0, 10);
            this.monsterHealth -= attackValue;
            this.attackPlayer();
            this.addLogMessage('player', 'attack', attackValue)
        },

        attackPlayer() {
            const attackValue = getRandomValue(7, 12);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue)
        },

        specialAttackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(10, 20);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'special-attack', attackValue)
            this.attackPlayer();
        },

        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(7, 12);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
                this.addLogMessage('player', 'heal', this.playerHealth + healValue - 100)
                return;
            }
            this.playerHealth += healValue;
            this.addLogMessage('player', 'heal', healValue)
            this.attackPlayer();
        },

        restartGame() {
            this.currentRound = 0;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.logMessages = []
        },

        surrender() {
            this.playerHealth = 0;
        },
        
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            })
        }
    }
});

app.mount('#game');