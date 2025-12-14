import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Query } from '../types';
import { executeQuery } from '../services/queryEngine';
import { fetchQueries } from '../services/queryService';
import { NewQueryModal } from '../components/NewQueryModal';
import { RootStackParamList } from '../types/navigation';

const formatDate = (dateString?: string | null) =>
  dateString ? new Date(dateString).toLocaleString() : 'Never refreshed';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadQueries = async () => {
    setLoading(true);
    const data = await fetchQueries();
    setQueries(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadQueries();
  }, []);

  const handleSubmit = async (prompt: string, location?: string) => {
    setCreating(true);
    try {
      const { query } = await executeQuery({ prompt, locationText: location });
      setQueries((prev) => [query, ...prev]);
      navigation.navigate('Results', { query });
    } finally {
      setCreating(false);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: Query }) => (
    <TouchableOpacity
      style={styles.queryCard}
      onPress={() => navigation.navigate('Results', { query: item })}
      activeOpacity={0.9}
    >
      <Text style={styles.queryTitle}>{item.title}</Text>
      <Text style={styles.querySubtitle}>{formatDate(item.last_refreshed_at)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Mission Control</Text>
        <Text style={styles.subHeading}>Saved queries ready to relaunch</Text>
      </View>
      <FlatList
        data={queries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadQueries} />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No saved queries yet.</Text> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} disabled={creating}>
        <Text style={styles.fabText}>{creating ? 'Running...' : '+'}</Text>
      </TouchableOpacity>
      <NewQueryModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  heading: {
    color: 'white',
    fontSize: 26,
    fontWeight: '800',
  },
  subHeading: {
    color: '#94a3b8',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  queryCard: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  queryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  querySubtitle: {
    color: '#94a3b8',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#22c55e',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: {
    color: '#0b1224',
    fontSize: 28,
    fontWeight: '800',
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 32,
  },
});
