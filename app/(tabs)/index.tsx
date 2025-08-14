import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native"
import { Video, ResizeMode } from "expo-av"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const baseTileWidth = Math.min(250, screenWidth / 3)
const fontScale = screenWidth / 1080

const MOCK = {
  items: [
    {
      id: "bbb-hls",
      title: "Big Buck Bunny (HLS)",
      description: "Short animated film used as a demo stream.",
      thumbnail: "https://i.imgur.com/8GVG6Zp.jpeg",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      mp4Fallback: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 596,
    },
    {
      id: "sintel-mp4",
      title: "Sintel (MP4)",
      description: "Open movie — MP4 fallback.",
      thumbnail: "https://i.imgur.com/DvpvklR.png",
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      duration: 888,
    },
    {
      id: "tears-hls",
      title: "Tears of Steel (HLS)",
      description: "Open movie — HLS stream.",
      thumbnail: "https://i.imgur.com/fHyEMsl.png",
      streamUrl: "https://test-streams.mux.dev/tears-of-steel/playlist.m3u8",
      mp4Fallback: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      duration: 734,
    },
    {
      id: "elephants-mp4",
      title: "Elephant Dream (MP4)",
      description: "Open movie — MP4 demo.",
      thumbnail: "https://i.imgur.com/Yo3j8kG.png",
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      duration: 653,
    },
    {
      id: "bbb-mp4",
      title: "Big Buck Bunny (MP4)",
      description: "MP4 fallback of BBB.",
      thumbnail: "https://i.imgur.com/8GVG6Zp.jpeg",
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 596,
    },
    {
      id: "for-bigger-joyrides",
      title: "For Bigger Joyrides (MP4)",
      description: "Short demo clip.",
      thumbnail: "https://i.imgur.com/DvpvklR.png",
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      duration: 75,
    },
  ],
}

type ScreenState =
  | { screen: "home" }
  | { screen: "details"; itemId: string }
  | { screen: "player"; streamUrl: string; title: string; mp4Fallback?: string }

export default function App() {
  const [catalog, setCatalog] = useState<typeof MOCK | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [state, setState] = useState<ScreenState>({ screen: "home" })
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const videoRef = useRef<Video>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await new Promise((r) => setTimeout(r, 300))
        if (mounted) setCatalog(MOCK)
      } catch {
        if (mounted) setCatalogError("Failed to load catalog.")
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (state.screen === "home") {
    if (catalogError) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>❌ {catalogError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setCatalog(null)
              setCatalogError(null)
              setTimeout(() => setCatalog(MOCK), 300)
            }}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (!catalog) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading catalog…</Text>
        </View>
      )
    }

    const numColumns = Math.max(2, Math.floor(screenWidth / (baseTileWidth + 20)))

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <FlatList
          data={catalog.items}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <View style={styles.tile}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <Text style={styles.tileTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.tileMeta}>{formatDuration(item.duration)}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => {
                    setVideoError(null)
                    setIsVideoLoading(true)
                    setState({
                      screen: "player",
                      streamUrl: item.streamUrl,
                      title: item.title,
                      mp4Fallback: (item as any).mp4Fallback,
                    })
                  }}
                >
                  <Text style={styles.buttonText}>▶ Play</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => setState({ screen: "details", itemId: item.id })}
                >
                  <Text style={styles.buttonText}>ℹ Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    )
  }

  if (state.screen === "details") {
    const item = catalog?.items.find((v) => v.id === state.itemId)
    if (!item) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>❌ Video not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => setState({ screen: "home" })}>
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollView style={styles.detailsContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.detailsImage} />
          <Text style={styles.detailsTitle}>{item.title}</Text>
          <Text style={styles.detailsDescription}>{item.description}</Text>
          <Text style={styles.detailsInfo}>Duration: {formatDuration(item.duration)}</Text>

          <TouchableOpacity
            style={styles.playButtonLarge}
            onPress={() => {
              setVideoError(null)
              setIsVideoLoading(true)
              setState({
                screen: "player",
                streamUrl: item.streamUrl,
                title: item.title,
                mp4Fallback: (item as any).mp4Fallback,
              })
            }}
          >
            <Text style={styles.buttonText}>▶ Play Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => setState({ screen: "home" })}>
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }


  if (state.screen === "player") {
    return (
      <View style={styles.playerContainer}>
        <StatusBar hidden />
        {isVideoLoading && (
          <View style={styles.overlayLoader} pointerEvents="none">
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Buffering…</Text>
          </View>
        )}
        {videoError && <Text style={styles.errorText}>⚠ {videoError}</Text>}
        <Video
          key={state.streamUrl}
          ref={videoRef}
          source={{ uri: state.streamUrl }}
          style={styles.fullscreenVideo}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false} 
          onLoadStart={() => setIsVideoLoading(true)}
          onLoad={async () => {
            setIsVideoLoading(false)

            try {
              await videoRef.current?.playAsync()
            } catch (err) {
              console.warn("PlayAsync failed:", err)
            }
          }}
          onError={(e) => {
            console.error("Video error:", e)
            setIsVideoLoading(false)
            if (state.mp4Fallback && state.streamUrl !== state.mp4Fallback) {
              setState({
                screen: "player",
                streamUrl: state.mp4Fallback!,
                title: state.title + " (Fallback)",
              })
            } else {
              setVideoError("Unable to play this stream.")
            }
          }}
        />
        {/* Overlay title & back button */}
        <View style={styles.videoOverlay} pointerEvents="box-none">
          <TouchableOpacity style={styles.overlayBackButton} onPress={() => setState({ screen: "home" })}>
            <Text style={styles.overlayButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.playerTitle} numberOfLines={1}>
            {state.title}
          </Text>
        </View>
      </View>
    )
  }

  return null
}

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  gridContent: {
    padding: 12,
    justifyContent: "center",
    flexGrow: 1,
  },
  tile: {
    flex: 1,
    margin: 8,
    backgroundColor: "#111",
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    paddingBottom: 12,
    minWidth: (screenWidth - 48) / Math.max(2, Math.floor(screenWidth / 250)),
    maxWidth: 320,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    resizeMode: "cover",
  },
  tileTitle: {
    color: "#fff",
    marginTop: 8,
    fontSize: Math.max(14, 14 * fontScale),
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  tileMeta: {
    color: "#9aa0a6",
    fontSize: Math.max(11, 11 * fontScale),
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginTop: 4,
    gap: 8,
  },
  playButton: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  detailsButton: {
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  detailsImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 14,
    marginBottom: 16,
    resizeMode: "cover",
  },
  detailsTitle: {
    color: "#fff",
    fontSize: Math.max(24, 24 * fontScale),
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsDescription: {
    color: "#d0d0d0",
    fontSize: Math.max(16, 16 * fontScale),
    marginBottom: 8,
    lineHeight: Math.max(22, 22 * fontScale),
  },
  detailsInfo: {
    color: "#9aa0a6",
    fontSize: Math.max(14, 14 * fontScale),
    marginBottom: 16,
  },
  playButtonLarge: {
    backgroundColor: "#1a73e8",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  playerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenVideo: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  overlayLoader: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  videoOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 44 : 20,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 5,
  },
  overlayBackButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  overlayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  playerTitle: {
    color: "#fff",
    fontSize: Math.max(18, 18 * fontScale),
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  loadingText: {
    color: "#9aa0a6",
    marginTop: 8,
    fontSize: Math.max(14, 14 * fontScale),
  },
  errorText: {
    color: "#ff4d4d",
    marginBottom: 12,
    textAlign: "center",
    fontSize: Math.max(14, 14 * fontScale),
  },
})
