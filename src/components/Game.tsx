import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import {shuffle} from 'lodash';

import {RandomNumber} from './RandomNumber';

type GameProps = {
  randomNumberCount: number;
  initialSeconds: number;
  onPlayAgain: () => void;
};

type InitialStateProps = {
  numberIds: number[];
  remainingSeconds: number;
};

export const Game = ({
  randomNumberCount,
  initialSeconds,
  onPlayAgain,
}: GameProps) => {
  const initialState = useMemo(
    () => ({
      numberIds: [],
      remainingSeconds: initialSeconds,
    }),
    [initialSeconds],
  );

  const [initialStateValues, setInitialStateValues] =
    useState<InitialStateProps>(initialState);

  const gameStatusRef = useRef('PLAYING');

  // Use `useMemo` to memoize the `randomNumbers` and `target` (it ensures that these values are only recalculated if randomNumberCount changes).
  const randomNumbers = useMemo(
    () =>
      shuffle(
        Array.from({length: randomNumberCount}).map(
          () => 1 + Math.floor(10 * Math.random()),
        ),
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

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Store the interval id in a variable to clear it later.
    intervalIdRef.current = setInterval(() => {
      setInitialStateValues(prevState => {
        if (prevState.remainingSeconds === 0) {
          if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
          }
          return prevState; // return the current state without decrementing remainingSeconds
        }

        return {
          ...prevState,
          remainingSeconds: prevState.remainingSeconds - 1,
        };
      });
    }, 1000);

    // Return a cleanup function.
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  // Use `useCallback` to prevent unnecessary re-renders.
  const isNumberDisabled = useCallback(
    (numberIndex: number) =>
      initialStateValues.numberIds.indexOf(numberIndex) >= 0,
    [initialStateValues],
  );

  const selectNumber = useCallback(
    (numberIndex: number) =>
      setInitialStateValues(prevState => ({
        ...prevState,
        numberIds: [...prevState.numberIds, numberIndex],
      })),
    [],
  );

  const getGameStatus = useCallback(
    (stateValues: InitialStateProps) => {
      const selectedNumbersSum = stateValues.numberIds.reduce(
        (acc, curr) => acc + randomNumbers[curr],
        0,
      );

      if (stateValues.remainingSeconds === 0) {
        return 'GAME OVER';
      }

      if (selectedNumbersSum === target) {
        return 'WON';
      }

      if (selectedNumbersSum > target) {
        return 'GAME OVER';
      }

      return 'PLAYING';
    },
    [randomNumbers, target],
  );

  useEffect(() => {
    if (
      initialStateValues.numberIds !== initialState.numberIds ||
      initialStateValues.remainingSeconds === 0
    ) {
      gameStatusRef.current = getGameStatus(initialStateValues);
      if (
        gameStatusRef.current !== 'PLAYING' &&
        intervalIdRef.current !== null
      ) {
        clearInterval(intervalIdRef.current);
      }
    }
  }, [initialStateValues, initialState, getGameStatus]);

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

  const currentGameStatus = getGameStatus(initialStateValues);

  const handlePlayAgain = () => onPlayAgain();

  return (
    <View style={styles.container}>
      <Text style={[styles.target, targetPanelStyle(currentGameStatus)]}>
        {target}
      </Text>

      <View style={styles.randomContainer}>
        {randomNumbers.map((randomNumber, index) => (
          <RandomNumber
            key={index}
            id={index}
            number={randomNumber}
            isDisabled={
              isNumberDisabled(index) || currentGameStatus !== 'PLAYING'
            }
            onPress={selectNumber}
          />
        ))}
      </View>
      {currentGameStatus !== 'PLAYING' && (
        <Button title="Play Again" onPress={handlePlayAgain} />
      )}
      <Text>Remaining seconds: {initialStateValues.remainingSeconds}</Text>
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
