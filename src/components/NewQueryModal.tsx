import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, location?: string) => void;
}

export const NewQueryModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt.trim(), location.trim() || undefined);
    setPrompt('');
    setLocation('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>New Query</Text>
          <TextInput
            placeholder="Find tacos, fastest cars..."
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
          />
          <TextInput
            placeholder="Location (optional)"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.secondary]}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Save & Run</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#0b1224',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#111827',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  secondaryText: {
    color: '#cbd5e1',
  },
});
