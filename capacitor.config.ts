import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bradwear.app',
  appName: 'Bradwear',
  webDir: 'dist',
  android: {
    // Aktifkan mixed content untuk semua brand (Tecno, Vivo, Xiaomi, dll)
    allowMixedContent: true,
    // Capture input untuk keyboard yang lebih baik di semua brand
    captureInput: true,
    // WebContentsDebuggingEnabled hanya untuk debug, false di production
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#050505',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
  server: {
    // Hostname yang konsisten untuk semua device
    androidScheme: 'https',
    cleartext: true,
  },
};

export default config;
