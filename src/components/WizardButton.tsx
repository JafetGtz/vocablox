import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native'

interface WizardButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  titleStyle?: TextStyle
}

const WizardButton: React.FC<WizardButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  titleStyle
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
    disabled && styles.disabledButton,
    style
  ]

  const textStyle = [
    styles.buttonText,
    variant === 'secondary' ? styles.secondaryButtonText : styles.primaryButtonText,
    disabled && styles.disabledButtonText,
    titleStyle
  ]

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#667eea' : '#ffffff'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: '#f8f9ff',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#667eea',
  },
  disabledButtonText: {
    color: '#999',
  },
})

export default WizardButton