import React from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'
import type { RichTextSegment } from '@/features/notes/models/types'

interface RichTextDisplayProps {
  richContent?: RichTextSegment[]
  plainContent: string
  numberOfLines?: number
}

export default function RichTextDisplay({
  richContent,
  plainContent,
  numberOfLines = 4
}: RichTextDisplayProps) {
  const { width } = useWindowDimensions()

  // If we have HTML content in richContent, use it
  const htmlContent = richContent?.[0]?.text

  // If no rich content or it doesn't look like HTML, show plain text as HTML
  const source = {
    html: htmlContent && htmlContent.includes('<')
      ? htmlContent
      : `<p>${plainContent}</p>`
  }

  return (
    <RenderHtml
      contentWidth={width - 120}
      source={source}
      tagsStyles={{
        body: {
          fontSize: 16,
          color: '#444',
          lineHeight: 22,
          margin: 0,
          padding: 0,
        },
        p: {
          margin: 0,
          marginBottom: 8,
        },
        h1: {
          fontSize: 24,
          fontWeight: '700',
          color: '#333',
          marginBottom: 8,
        },
        h2: {
          fontSize: 20,
          fontWeight: '700',
          color: '#333',
          marginBottom: 6,
        },
        h3: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
          marginBottom: 4,
        },
        strong: {
          fontWeight: '700',
        },
        em: {
          fontStyle: 'italic',
        },
        u: {
          textDecorationLine: 'underline',
        },
        s: {
          textDecorationLine: 'line-through',
        },
        ul: {
          marginLeft: 16,
          marginBottom: 8,
        },
        ol: {
          marginLeft: 16,
          marginBottom: 8,
        },
        li: {
          marginBottom: 4,
        },
      }}
      enableExperimentalMarginCollapsing={true}
    />
  )
}

const styles = StyleSheet.create({
  // No styles needed, using tagsStyles
})
