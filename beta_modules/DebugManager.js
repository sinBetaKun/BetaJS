module.exports = class DebugManager {
    #debugMode = false;
    #sleeping = false;

    /**
     * 
     * @param {boolean} dbg_mode 
     */
    constructor (dbg_mode) {
        this.#debugMode = dbg_mode;
    }
    
    /**
     * このボットがイベント等に反応するかどうか
     * @returns {boolean}
     */
    isFrozen() {
        return !this.#debugMode && this.#sleeping;
    }

    isDebugging() {
        return this.#debugMode
    }

    sleep() {
        if (this.#sleeping) return false; 
        this.#sleeping = true;
        return true;
    }

    wakeUp() {
        if (!this.#sleeping) return false; 
        this.#sleeping = false;
        return true;
    }
}