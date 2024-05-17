import React from 'react';

import {Game} from './src/components/Game';

export const App = (): React.JSX.Element => {
  return <Game randomNumberCount={6} />;
};
