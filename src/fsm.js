class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    this.config = config;
    this.state = this.config.initial;
    this.history = {
      index: 0,
      states: []
    }
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.state;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (this.config.states[state]) {
      this.state = state;
      this.history.states.splice(this.history.index + 1);
      this.history.states.push(this.state);
      this.history.index++;
    } else {
      throw new Error();
    }
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (this.config.states[this.state].transitions[event]) {
      this.state = this.config.states[this.state].transitions[event];
      this.history.states.splice(this.history.index + 1);
      this.history.states.push(this.state);
      this.history.index++;
    } else {
      throw new Error();
    }
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.state = this.config.initial;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    let states = this.config.states;
    let statesArray = Object.keys(states);

    if (event === undefined) {
      return statesArray;
    } else {
      return statesArray.filter((elem) => {
        return states[elem].transitions.hasOwnProperty(event);
      });
    }
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this.history.states.length && this.history.index > 0) {
      this.history.index--;
      if (!this.history.index) {
        this.state = this.config.initial;
      } else {
        this.state = this.history.states[this.history.index];
      }
      return true;
    }
    return false;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (this.history.states.length && this.history.index < this.history.states.length) {
      this.state = this.history.states[this.history.index++];
      return true;
    }
    return false;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.history = {
      index: 0,
      states: []
    }
  }
}

module.exports = FSM;
