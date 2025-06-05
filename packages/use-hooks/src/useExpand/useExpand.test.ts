import { describe, it } from 'vitest'
import { useExpand } from './useExpand'

// create test for useExpand
describe('useExpand', () => {
  it('should expand in a new window', () => {
    const { expandInNewWindow } = useExpand()
    expandInNewWindow('{ "test": "test" }')
  })
})