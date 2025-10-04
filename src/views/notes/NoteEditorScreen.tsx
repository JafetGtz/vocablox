import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/AppStackNavigator'
import { useAppDispatch } from '@/store/hooks'
import { updatePersonalNote } from '@/features/notes/models/personalNotesSlice'
import type { PersonalNote } from '@/features/notes/models/types'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'NoteEditor'>
type RouteType = RouteProp<AppStackParamList, 'NoteEditor'>

const TEXT_COLORS = [
  '#000000', '#FF6B6B', '#E74C3C', '#C0392B',
  '#9B59B6', '#8E44AD', '#3498DB', '#2980B9',
  '#1ABC9C', '#16A085', '#2ECC71', '#27AE60',
  '#F39C12', '#E67E22', '#95A5A6', '#7F8C8D'
]

const HIGHLIGHT_COLORS = [
  'transparent', '#FFFF00', '#FFE5B4', '#FFB6C1',
  '#E6E6FA', '#B0E0E6', '#98FB98', '#DDA0DD',
  '#F0E68C', '#FFDAB9', '#E0BBE4', '#C7CEEA'
]

export default function NoteEditorScreen() {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<RouteType>()
  const dispatch = useAppDispatch()

  const { note } = route.params

  const richText = useRef<RichEditor>(null)
  const [title, setTitle] = useState(note.title)
  const [htmlContent, setHtmlContent] = useState(note.richContent?.[0]?.text || note.content || '')
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [editorInitialized, setEditorInitialized] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Interceptar el botón de back del sistema
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasChanges) {
        // Si no hay cambios, dejar que navegue normalmente
        return
      }

      // Prevenir la navegación
      e.preventDefault()

      // Mostrar alerta
      Alert.alert(
        'Cambios sin guardar',
        '¿Quieres guardar los cambios antes de salir?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action)
          },
          {
            text: 'Guardar',
            onPress: async () => {
              await handleSave()
              navigation.dispatch(e.data.action)
            }
          },
        ]
      )
    })

    return unsubscribe
  }, [navigation, hasChanges])

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Cambios sin guardar',
        '¿Quieres guardar los cambios antes de salir?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Guardar', onPress: handleSave },
        ]
      )
    } else {
      navigation.goBack()
    }
  }

  const handleSave = async () => {
    const html = await richText.current?.getContentHtml()

    // Remove HTML tags for plain text search
    const plainText = html?.replace(/<[^>]*>/g, '') || ''

    dispatch(updatePersonalNote({
      id: note.id,
      title,
      content: plainText,
      richContent: [{ text: html || '', style: {} }] // Store HTML in richContent
    }))

    setHasChanges(false)
    navigation.goBack()
  }

  const handleEditorInitialized = () => {
    setEditorInitialized(true)
    // Set initial content after editor is ready
    if (note.richContent && note.richContent[0]?.text) {
      richText.current?.setContentHTML(note.richContent[0].text)
    } else if (note.content) {
      richText.current?.setContentHTML(note.content)
    }
  }

  const applyTextColor = (color: string) => {
    richText.current?.setForeColor(color)
    setShowTextColorPicker(false)
  }

  const applyHighlight = (color: string) => {
    richText.current?.setHiliteColor(color)
    setShowHighlightPicker(false)
  }

  const renderColorPicker = (
    visible: boolean,
    colors: string[],
    onClose: () => void,
    onSelect: (color: string) => void,
    title: string
  ) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.colorPickerContainer}>
            <View style={styles.colorPickerHeader}>
              <Text style={styles.colorPickerTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.colorGrid}>
                {colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: color === 'transparent' ? '#FFF' : color,
                        borderWidth: color === 'transparent' ? 2 : 1,
                        borderColor: color === 'transparent' ? '#E74C3C' : '#DDD'
                      }
                    ]}
                    onPress={() => onSelect(color)}
                  >
                    {color === 'transparent' && (
                      <Icon name="slash" size={20} color="#E74C3C" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFEF7" />
      <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Nota</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Icon name="check" size={24} color="#9B59B6" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Paper Sheet */}
        <View style={styles.paperSheet}>
          {/* Paper lines decoration */}
          <View style={styles.paperLines} />

          {/* Word tag and Save button */}
          <View style={styles.topBar}>
            <View style={styles.wordTagContainer}>
              <Icon name="bookmark" size={16} color="#9B59B6" />
              <Text style={styles.wordTag}>{note.word}</Text>
            </View>
            <TouchableOpacity onPress={handleSave} style={styles.subtleSaveButton}>
              <Icon name="save" size={18} color="#9B59B6" />
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={(text) => {
              setTitle(text)
              setHasChanges(true)
            }}
            placeholder="Título de la nota..."
            placeholderTextColor="#999"
            multiline
          />

          {/* Rich Text Editor */}
          <ScrollView style={styles.editorScroll} keyboardShouldPersistTaps="handled">
            <RichEditor
              ref={richText}
              onChange={(content) => {
                setHtmlContent(content)
                setHasChanges(true)
              }}
              placeholder="Escribe tu nota aquí..."
              initialContentHTML={note.richContent?.[0]?.text || note.content || ''}
              editorInitializedCallback={handleEditorInitialized}
              style={styles.richEditor}
              editorStyle={{
                backgroundColor: '#FFFEF7',
                color: '#333',
                placeholderColor: '#999',
                contentCSSText: `
                  font-size: 16px;
                  line-height: 1.6;
                  padding: 12px;
                  color: #333;
                `,
              }}
              useContainer={true}
              initialHeight={SCREEN_HEIGHT * 0.4}
            />
          </ScrollView>
        </View>

        {/* Rich Text Toolbar */}
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.heading1,
            actions.heading2,
            actions.heading3,
            'textColor',
            'highlight',
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.indent,
            actions.outdent,
            actions.insertLink,
            actions.removeFormat,
          ]}
          iconMap={{
            [actions.heading1]: () => <Text style={styles.headingText}>H1</Text>,
            [actions.heading2]: () => <Text style={styles.headingText}>H2</Text>,
            [actions.heading3]: () => <Text style={styles.headingText}>H3</Text>,
            textColor: () => <Icon name="type" size={18} color="#333" />,
            highlight: () => <Icon name="edit" size={18} color="#333" />,
          }}
          textColor={() => setShowTextColorPicker(true)}
          highlight={() => setShowHighlightPicker(true)}
          style={styles.toolbarContainer}
          selectedIconTint="#9B59B6"
          iconTint="#333"
          disabledIconTint="#999"
        />
      </KeyboardAvoidingView>

      {/* Color Pickers */}
      {renderColorPicker(
        showTextColorPicker,
        TEXT_COLORS,
        () => setShowTextColorPicker(false),
        applyTextColor,
        'Color de Texto'
      )}

      {renderColorPicker(
        showHighlightPicker,
        HIGHLIGHT_COLORS,
        () => setShowHighlightPicker(false),
        applyHighlight,
        'Color de Resaltado'
      )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF7',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFEF7',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 8,
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  paperSheet: {
    flex: 1,
    margin: 16,
    backgroundColor: '#FFFEF7',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  paperLines: {
    position: 'absolute',
    left: 60,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FFB6C1',
    opacity: 0.3,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  wordTag: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B59B6',
    marginLeft: 6,
  },
  subtleSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9B59B6',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    padding: 0,
    minHeight: 30,
  },
  editorScroll: {
    flex: 1,
  },
  richEditor: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.4,
  },
  toolbarContainer: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  headingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  colorPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: (SCREEN_WIDTH * 0.85 - 80) / 4,
    height: (SCREEN_WIDTH * 0.85 - 80) / 4,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
})
