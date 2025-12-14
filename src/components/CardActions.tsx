import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
import { CardAction } from '../types';

interface Props {
  actions: CardAction[];
}

export const CardActions: React.FC<Props> = ({ actions }) => (
  <View style={styles.container}>
    {actions.map((action) => (
      <TouchableOpacity
        key={action.url}
        style={styles.button}
        onPress={() => Linking.openURL(action.url)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{action.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
