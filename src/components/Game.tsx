import React, {useState, useMemo, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {RandomNumber} from './RandomNumber';

type GameProps = {
  randomNumberCount: number;
};

export const Game = ({randomNumberCount}: GameProps) => {
  const initialState = {
    numberIds: [],
  };

  const [initialStateValues, setInitialStateValues] = useState<{
    numberIds: number[];
  }>(initialState);

  // Use `useMemo` to memoize the `randomNumbers` and `target` (it ensures that these values are only recalculated if randomNumberCount changes).
  const randomNumbers = useMemo(
    () =>
      Array.from({length: randomNumberCount}).map(
        () => 1 + Math.floor(10 * Math.random()),
      ),
    [randomNumberCount],
  );

  const target = useMemo(
    () =>
      randomNumbers
        .slice(0, randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0),
    [randomNumbers, randomNumberCount],
  );

  // Use `useCallback` to prevent unnecessary re-renders.
  const isNumberDisabled = useCallback(
    (numberIndex: number) =>
      initialStateValues.numberIds.indexOf(numberIndex) >= 0,
    [initialStateValues],
  );

  const selectNumber = useCallback(
    (numberIndex: number) =>
      setInitialStateValues(prevState => ({
        numberIds: [...prevState.numberIds, numberIndex],
      })),
    [],
  );

  const getGameStatus = useCallback(() => {
    const selectedNumbersSum = initialStateValues.numberIds.reduce(
      (acc, curr) => acc + randomNumbers[curr],
      0,
    );

    if (selectedNumbersSum === target) {
      return 'WON';
    }

    if (selectedNumbersSum > target) {
      return 'GAME OVER';
    }

    return 'PLAYING';
  }, [initialStateValues, randomNumbers, target]);

  const targetPanelStyle = useCallback((gameStatus: string) => {
    if (gameStatus === 'PLAYING') {
      return styles.statusPlaying;
    }

    if (gameStatus === 'WON') {
      return styles.statusWon;
    }

    if (gameStatus === 'GAME OVER') {
      return styles.statusGameOver;
    }
  }, []);

  const gameStatus = getGameStatus();

  return (
    <View style={styles.container}>
      <Text style={[styles.target, targetPanelStyle(gameStatus)]}>
        {target}
      </Text>

      <View style={styles.randomContainer}>
        {randomNumbers.map((randomNumber, index) => (
          <RandomNumber
            key={index}
            id={index}
            number={randomNumber}
            isDisabled={isNumberDisabled(index) || gameStatus !== 'PLAYING'}
            onPress={selectNumber}
          />
        ))}
      </View>
      <Text>{gameStatus}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
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
  statusPlaying: {
    backgroundColor: '#bbb',
  },
  statusWon: {
    backgroundColor: 'green',
  },
  statusGameOver: {
    backgroundColor: 'red',
  },
});
