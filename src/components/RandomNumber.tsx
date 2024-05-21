import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type RandomNumberProps = {
  id: number;
  number: number;
  isDisabled: boolean;
  onPress: (id: number) => void;
};

export const RandomNumber = ({
  id,
  number,
  isDisabled,
  onPress,
}: RandomNumberProps) => {
  const handlePress = () => !isDisabled && onPress(id);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.random, isDisabled && styles.disabled]}>
        {number}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  random: {
    backgroundColor: '#999',
    width: 100,
    marginHorizontal: 15,
    marginVertical: 25,
    fontSize: 35,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});
