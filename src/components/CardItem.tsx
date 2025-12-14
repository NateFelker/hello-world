import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { CardData } from '../types';
import { CardActions } from './CardActions';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  card: CardData;
}

export const CardItem: React.FC<Props> = ({ card }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={toggle} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>#{card.rank}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{card.title}</Text>
          {card.subtitle ? <Text style={styles.subtitle}>{card.subtitle}</Text> : null}
          {card.reason ? <Text style={styles.reason}>{card.reason}</Text> : null}
        </View>
        {typeof card.score === 'number' ? <Text style={styles.score}>{card.score.toFixed(2)}</Text> : null}
      </View>
      {expanded && (
        <View style={styles.expanded}>
          {card.data_json && (
            <View style={styles.dataBlock}>
              {Object.entries(card.data_json).map(([key, value]) => (
                <Text key={key} style={styles.dataText}>
                  <Text style={styles.dataKey}>{key.replace(/_/g, ' ')}: </Text>
                  {String(value)}
                </Text>
              ))}
            </View>
          )}
          {card.actions_json && card.actions_json.length > 0 ? <CardActions actions={card.actions_json} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0b1224',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#132040',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#22d3ee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  badgeText: {
    color: '#0b1224',
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 2,
  },
  reason: {
    color: '#94a3b8',
    marginTop: 4,
  },
  score: {
    color: '#22d3ee',
    fontWeight: '700',
  },
  expanded: {
    marginTop: 12,
  },
  dataBlock: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  dataText: {
    color: '#e2e8f0',
    marginBottom: 4,
  },
  dataKey: {
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
});
