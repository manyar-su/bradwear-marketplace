# ============================================================
# Bradwear ProGuard Rules
# ============================================================

# Simpan info baris untuk crash reporting di Google Play
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ============================================================
# Capacitor Core
# ============================================================
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.PluginMethod public *;
}

# ============================================================
# WebView JavaScript Interface (wajib untuk Capacitor WebView)
# ============================================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface

# ============================================================
# Capacitor Plugins
# ============================================================
-keep class com.capacitorjs.plugins.** { *; }
-keep class com.capacitorjs.community.media.** { *; }

# ============================================================
# AndroidX & Support Library
# ============================================================
-keep class androidx.** { *; }
-dontwarn androidx.**

# ============================================================
# Jangan hapus class yang dipakai via reflection
# ============================================================
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# ============================================================
# Supabase / OkHttp / Retrofit (networking)
# ============================================================
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# ============================================================
# Gson / JSON serialization
# ============================================================
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# ============================================================
# Jangan obfuscate nama app sendiri
# ============================================================
-keep class com.bradwear.app.** { *; }
