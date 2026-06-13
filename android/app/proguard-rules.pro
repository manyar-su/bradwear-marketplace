# ============================================================
# Bradwear ProGuard Rules
# ============================================================

# Simpan info baris untuk crash reporting di Google Play
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ============================================================
# Capacitor Core - JANGAN dihapus R8
# ============================================================
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.PluginMethod public *;
}
-keep class com.getcapacitor.BridgeActivity { *; }
-keep class com.getcapacitor.BridgeFragment { *; }

# ============================================================
# WebView JavaScript Interface
# ============================================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface

# ============================================================
# Capacitor Plugins - semua plugin yang dipakai
# ============================================================
-keep class com.capacitorjs.plugins.** { *; }

# Media plugin (simpan gambar ke galeri)
-keep class com.capacitorjs.community.media.** { *; }
-keep class capacitor.android.plugins.** { *; }

# Filesystem plugin
-keep class com.capacitorjs.plugins.filesystem.** { *; }

# App plugin (back button)
-keep class com.capacitorjs.plugins.app.** { *; }

# Haptics plugin
-keep class com.capacitorjs.plugins.haptics.** { *; }

# ============================================================
# App sendiri
# ============================================================
-keep class com.bradwear.app.** { *; }
-keep class com.bradwear.app.MainActivity { *; }

# ============================================================
# AndroidX
# ============================================================
-keep class androidx.** { *; }
-dontwarn androidx.**
-keep class androidx.core.content.FileProvider { *; }

# ============================================================
# Annotations & Reflection
# ============================================================
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# ============================================================
# Networking (Supabase, OkHttp)
# ============================================================
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-keep interface okhttp3.** { *; }

# ============================================================
# Kotlin
# ============================================================
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**

# ============================================================
# Gson / JSON
# ============================================================
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# ============================================================
# Enum (sering dihapus R8 padahal dipakai)
# ============================================================
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
