import React, {useMemo, useState} from 'react';

import {Game} from './src/components/Game';

type InitialStateProps = {
  gameId: number;
};

export const App = (): React.JSX.Element => {
  // Small hack to reset the game (re-assign the ID to remount it).
  const initialState = useMemo(
    () => ({
      gameId: 1,
    }),
    [],
  );

  const [initialStateValues, setInitialStateValues] =
    useState<InitialStateProps>(initialState);

  const resetGame = () =>
    setInitialStateValues(prevState => ({
      ...prevState,
      gameId: prevState.gameId + 1,
    }));

  return (
    <Game
      key={initialStateValues.gameId}
      randomNumberCount={6}
      initialSeconds={10}
      onPlayAgain={resetGame}
    />
  );
};
