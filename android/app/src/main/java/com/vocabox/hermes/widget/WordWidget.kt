package com.vocabox.hermes.widget

import android.content.Context
import android.graphics.BitmapFactory
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.text.FontWeight
import androidx.glance.text.TextAlign
import androidx.glance.unit.ColorProvider
import com.vocabox.hermes.R
import java.io.File

class WordWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val (word, meaning, backgroundUri) = WordWidgetReceiver.getWidgetData(context)

        android.util.Log.d("WordWidget", "provideGlance called - word=$word, meaning=$meaning, backgroundUri=$backgroundUri")

        provideContent {
            WidgetContent(context, word, meaning, backgroundUri)
        }
    }

    @Composable
    private fun WidgetContent(context: Context, word: String, meaning: String, backgroundUri: String?) {
        android.util.Log.d("WordWidget", "WidgetContent rendering - backgroundUri=$backgroundUri")

        // Intentar cargar imagen de fondo personalizada (de galería)
        val customBitmap = loadBackgroundBitmap(context, backgroundUri)

        // Si no es custom, obtener el drawable predefinido
        val backgroundDrawableId = if (customBitmap == null) {
            val drawableId = getBackgroundDrawableId(context, backgroundUri)
            android.util.Log.d("WordWidget", "Using drawable ID: $drawableId for backgroundUri: $backgroundUri")
            drawableId
        } else {
            android.util.Log.d("WordWidget", "Using custom bitmap from: $backgroundUri")
            0
        }

        val backgroundModifier = if (customBitmap != null) {
            // Usar imagen personalizada de galería
            GlanceModifier
                .fillMaxSize()
                .background(ImageProvider(customBitmap))
                .padding(16.dp)
        } else if (backgroundDrawableId != 0) {
            // Usar imagen predefinida (amarillo, azul, etc.)
            GlanceModifier
                .fillMaxSize()
                .background(ImageProvider(backgroundDrawableId))
                .padding(16.dp)
        } else {
            // Fallback color
            GlanceModifier
                .fillMaxSize()
                .background(Color(0xFF9B59B6))
                .padding(16.dp)
        }

        Box(
            modifier = backgroundModifier,
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = GlanceModifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Palabra
                Text(
                    text = word,
                    style = TextStyle(
                        color = ColorProvider(Color.White),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                )

                Spacer(modifier = GlanceModifier.height(12.dp))

                // Significado
                Text(
                    text = meaning,
                    style = TextStyle(
                        color = ColorProvider(Color(0xFFE0E0E0)),
                        fontSize = 18.sp,
                        textAlign = TextAlign.Center
                    )
                )
            }
        }
    }

    private fun getBackgroundDrawableId(context: Context, backgroundId: String?): Int {
        return when (backgroundId) {
            "amarillo" -> context.resources.getIdentifier("amarillo", "drawable", context.packageName)
            "azul" -> context.resources.getIdentifier("azul", "drawable", context.packageName)
            "naranja" -> context.resources.getIdentifier("naranja", "drawable", context.packageName)
            "negro" -> context.resources.getIdentifier("negro", "drawable", context.packageName)
            "verde" -> context.resources.getIdentifier("verde", "drawable", context.packageName)
            else -> context.resources.getIdentifier("azul", "drawable", context.packageName) // Default
        }
    }

    private fun loadBackgroundBitmap(context: Context, backgroundUri: String?): android.graphics.Bitmap? {
        if (backgroundUri != null && backgroundUri.startsWith("file://")) {
            val filePath = backgroundUri.replace("file://", "")
            val file = File(filePath)

            if (file.exists()) {
                try {
                    return BitmapFactory.decodeFile(filePath)
                } catch (e: Exception) {
                    android.util.Log.e("WordWidget", "Error loading background image: ${e.message}")
                }
            }
        }
        return null
    }
}
