import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import RandomNumber from './RandomNumber';

import shuffle from 'lodash.shuffle';

class Game extends Component {
  //add type checking
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };
  gameStatus = 'PLAYING';

  //Generate a list of random numbers
  randomNumbers = Array
    //the number of items will equal the number from passed into randomnumbercount
    .from({ length: this.props.randomNumberCount })
    //generate a random number for each of
    .map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers
    //get the sum of only the first 4 numbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
    shuffledRandomNumbers = shuffle(this.randomNumbers);

    componentDidMount() {
      this.intervalId = setInterval(() => {
        this.setState(
          prevState => {
            return { remainingSeconds: prevState.remainingSeconds - 1 };
          },
          () => {
            if (this.state.remainingSeconds === 0) {
              clearInterval(this.intervalId);
            }
          }
        );
      }, 1000);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId);
    }

    // UNSAFE_componentWillUpdate(nextProps, nextState) {
    //   if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0) {
    //     this.gameStatus = this.calcGameStatus(nextState);
    //     if(this.gameStatus !== 'PLAYING') {
    //       clearInterval(this.intervalId);
    //     }
    //   }
    // }

    shouldComponentUpdate(nextProps, nextState) {
      let returnValue;
      if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0) {
        this.gameStatus = this.calcGameStatus(nextState);
        if(this.gameStatus !== 'PLAYING') {
          clearInterval(this.intervalId);
        }
        returnValue = true;
      }
      return [returnValue];
    }
  

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = numberIndex => {
    this.setState(prevState => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            <RandomNumber key={index} id={index} number={randomNumber} onPress={this.selectNumber} isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'} />
          ))}
        </View>
        <Button title="Play Again" onPress={this.props.onPlayAgain}></Button>
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 50,
  },
  target: {
    fontSize: 50,
    backgroundColor: '#bbb',
    margin: 50,
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  STATUS_PLAYING: {
    backgroundColor: '#ddd',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
