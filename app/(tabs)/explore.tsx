import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
   <ParallaxScrollView
  headerBackgroundColor={{ light: '#101010', dark: '#000' }}
  headerImage={
    <Image
      source={{ uri: 'https://i.imgur.com/8GVG6Zp.jpeg' }}
      style={styles.headerImage}
    />
  }
>
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="title">Movie Catalog</ThemedText>
  </ThemedView>
  <ThemedText>
    Browse our curated collection of open movies and demo clips. Select a title to see details, read the description, and start watching instantly.
  </ThemedText>

  <Collapsible title="Big Buck Bunny (HLS)">
    <ThemedText>
      Short animated film used as a demo stream. Duration: 596s.
    </ThemedText>
    <ExternalLink href="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8">
      <ThemedText type="link">Watch Now</ThemedText>
    </ExternalLink>
  </Collapsible>

  <Collapsible title="Sintel (MP4)">
    <ThemedText>
      Open movie — MP4 fallback. Duration: 888s.
    </ThemedText>
    <ExternalLink href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4">
      <ThemedText type="link">Watch Now</ThemedText>
    </ExternalLink>
  </Collapsible>

  <Collapsible title="Tears of Steel (HLS)">
    <ThemedText>
      Open movie — HLS stream. Duration: 734s.
    </ThemedText>
    <ExternalLink href="https://test-streams.mux.dev/tears-of-steel/playlist.m3u8">
      <ThemedText type="link">Watch Now</ThemedText>
    </ExternalLink>
  </Collapsible>

  <Collapsible title="Elephant Dream (MP4)">
    <ThemedText>
      Open movie — MP4 demo. Duration: 653s.
    </ThemedText>
    <ExternalLink href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4">
      <ThemedText type="link">Watch Now</ThemedText>
    </ExternalLink>
  </Collapsible>

  <Collapsible title="For Bigger Joyrides (MP4)">
    <ThemedText>
      Short demo clip. Duration: 75s.
    </ThemedText>
    <ExternalLink href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4">
      <ThemedText type="link">Watch Now</ThemedText>
    </ExternalLink>
  </Collapsible>
</ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
