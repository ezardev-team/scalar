export interface ScalarJsonViewerProps {
  /** JSON data to display */
  data?: any
  /** Raw JSON string to display */
  content?: string
  /** Title for the viewer */
  title?: string
  /** Whether to show the toolbar */
  showToolbar?: boolean
  /** Whether to show file size information */
  showSize?: boolean
  /** Whether to show copy button */
  showCopyButton?: boolean
  /** Whether to show fullscreen button */
  showFullscreenButton?: boolean
  /** Whether to show line numbers */
  showLineNumbers?: boolean
  /** Whether to enable folding */
  foldGutter?: boolean
  /** Whether the content is editable */
  editable?: boolean
  /** Placeholder text when content is empty */
  placeholder?: string
  /** Whether to format/prettify JSON */
  prettify?: boolean
  /** Number of spaces for indentation */
  indent?: number
}

export interface ScalarJsonViewerModalProps
  extends Omit<ScalarJsonViewerProps, 'showToolbar' | 'showFullscreenButton'> {
  /** Whether the modal is open */
  modelValue: boolean
} 