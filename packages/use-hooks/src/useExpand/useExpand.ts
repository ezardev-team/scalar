import { useToasts } from '@scalar/use-toasts'

import type { UseExpandOptions } from './types'

/**
 * A hook for interacting with the clipboard
 */
export function useExpand(opts: UseExpandOptions = {}) {
  const { expand: expandOpts } = opts

  async function expandInNewWindow(value: string) {
    const newWindow = window.open('', '_blank')

    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Code Preview</title>
          <style>
            body {
              font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
              margin: 20px;
              background: #f8f9fa;
              line-height: 1.5;
            }
            pre {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <pre>${value}</pre>
        </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  return { expandInNewWindow }
}