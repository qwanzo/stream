/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getEmbedUrl, getProviders } from './src/services/streaming';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return <><StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /><AppContent /></>;
}

function AppContent() {
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'torrent'>('movie');
  const [mediaId, setMediaId] = useState('550');
  const [season, setSeason] = useState('1');
  const [episode, setEpisode] = useState('1');
  const [providerId, setProviderId] = useState('main');
  const [magnet, setMagnet] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const embedUrl = getEmbedUrl(mediaType === 'torrent' ? 'torrent' : providerId, {
    type: mediaType,
    id: mediaId,
    magnet,
    season: Number(season) || 1,
    episode: Number(episode) || 1,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}><Text style={styles.brand}>PLIX</Text><Text style={styles.subtitle}>Watch anywhere</Text></View>
      <View style={styles.segment}><Pressable onPress={() => setMediaType('movie')} style={[styles.segmentButton, mediaType === 'movie' && styles.activeSegment]}><Text style={styles.segmentText}>Movie</Text></Pressable><Pressable onPress={() => setMediaType('tv')} style={[styles.segmentButton, mediaType === 'tv' && styles.activeSegment]}><Text style={styles.segmentText}>TV Series</Text></Pressable><Pressable onPress={() => setMediaType('torrent')} style={[styles.segmentButton, mediaType === 'torrent' && styles.activeSegment]}><Text style={styles.segmentText}>Torrent</Text></Pressable></View>
      {mediaType === 'torrent' ? <TextInput value={magnet} onChangeText={setMagnet} placeholder="Magnet link or infohash" placeholderTextColor="#71717a" style={styles.input} autoCapitalize="none" /> : <TextInput value={mediaId} onChangeText={setMediaId} keyboardType="number-pad" placeholder="TMDB ID" placeholderTextColor="#71717a" style={styles.input} />}
      {mediaType === 'tv' && <View style={styles.row}><TextInput value={season} onChangeText={setSeason} keyboardType="number-pad" placeholder="Season" placeholderTextColor="#71717a" style={[styles.input, styles.half]} /><TextInput value={episode} onChangeText={setEpisode} keyboardType="number-pad" placeholder="Episode" placeholderTextColor="#71717a" style={[styles.input, styles.half]} /></View>}
      <Text style={styles.sectionLabel}>Streaming provider</Text>
      {mediaType !== 'torrent' && <View style={styles.providerGrid}>{getProviders().filter((provider) => provider.id !== 'torrent').map((provider) => <Pressable key={provider.id} onPress={() => { if (provider.id === 'agg') { Alert.alert('Provider warning', 'Titan may not have this movie or episode available.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Continue', onPress: () => setProviderId(provider.id) }]); } else if (['streamsilu', 'vidsrc', 'vidlink', 'embed2', 'cdn'].includes(provider.id)) { Alert.alert('Provider warning', `${provider.name} may redirect or show popups. Continue?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Continue', onPress: () => setProviderId(provider.id) }]); } else setProviderId(provider.id); }} style={[styles.provider, providerId === provider.id && styles.activeProvider]}><Text style={styles.providerText}>{provider.name}</Text></Pressable>)}</View>}
      {mediaType === 'torrent' && <Text style={styles.phantomLabel}>Phantom: RiveStream torrent embed</Text>}
      <Pressable onPress={() => { if (!embedUrl) { setHasError(true); return; } setHasError(false); setIsPlaying(true); }} style={styles.playButton}><Text style={styles.playText}>{isPlaying ? 'Reload Stream' : 'Start Streaming'}</Text></Pressable>
      {isPlaying && <View style={styles.player}><WebView source={{ uri: embedUrl }} style={styles.webView} javaScriptEnabled domStorageEnabled allowsFullscreenVideo mediaPlaybackRequiresUserAction={false} setSupportMultipleWindows={false} onError={() => setHasError(true)} /></View>}
      {hasError && <Text style={styles.error}>This provider could not load. Choose another provider and try again.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 18,
  },
  contentContainer: { paddingTop: 24, paddingBottom: 24 },
  header: { marginBottom: 20 },
  brand: { color: '#ffffff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#a1a1aa', marginTop: 4 },
  segment: { flexDirection: 'row', backgroundColor: '#18181b', borderRadius: 10, padding: 4, marginBottom: 14 },
  segmentButton: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 7 },
  activeSegment: { backgroundColor: '#e50914' },
  segmentText: { color: '#ffffff', fontWeight: '700' },
  input: { backgroundColor: '#18181b', borderColor: '#3f3f46', borderWidth: 1, borderRadius: 9, color: '#ffffff', paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  sectionLabel: { color: '#d4d4d8', fontWeight: '700', marginTop: 8, marginBottom: 8 },
  providerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  provider: { backgroundColor: '#18181b', borderColor: '#3f3f46', borderWidth: 1, borderRadius: 9, paddingHorizontal: 22, paddingVertical: 11 },
  activeProvider: { backgroundColor: '#3f3f46', borderColor: '#e50914' },
  providerText: { color: '#ffffff', fontWeight: '700' },
  phantomLabel: { color: '#fbbf24', fontSize: 12, marginBottom: 4 },
  playButton: { backgroundColor: '#e50914', borderRadius: 9, alignItems: 'center', paddingVertical: 14, marginTop: 18 },
  playText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  player: { height: 230, marginTop: 18, backgroundColor: '#000000', borderRadius: 10, overflow: 'hidden' },
  webView: { flex: 1 },
  error: { color: '#f87171', marginTop: 12, textAlign: 'center' },
});

export default App;
