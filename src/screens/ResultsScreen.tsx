import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CardData } from '../types';
import { RootStackParamList } from '../types/navigation';
import { fetchCards } from '../services/queryService';
import { refreshExistingQuery } from '../services/queryEngine';
import { CardItem } from '../components/CardItem';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Results'> {}

export const ResultsScreen: React.FC<Props> = ({ route }) => {
  const { query } = route.params;
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCards = async () => {
    const cached = await fetchCards(query.id);
    setCards(cached);
    setLoading(false);
    if (!query.last_refreshed_at || Date.now() - new Date(query.last_refreshed_at).getTime() > 24 * 60 * 60 * 1000) {
      await refresh();
    }
  };

  useEffect(() => {
    void loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id]);

  const refresh = async () => {
    setRefreshing(true);
    const next = await refreshExistingQuery(query);
    setCards(next);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: CardData }) => <CardItem card={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{query.title}</Text>
        <Text style={styles.subtitle}>{query.prompt}</Text>
      </View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#22d3ee" />
          <Text style={styles.loaderText}>Loading cards...</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: '#1f2937',
    borderBottomWidth: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loaderText: {
    color: '#cbd5e1',
  },
});
