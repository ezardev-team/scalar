export type IconName = 'ChevronDown' | 'ChevronRight'

const icons: Record<IconName, string> = {
  ChevronDown: '<path d="m18 10-6 6-6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>',
  ChevronRight: '<path d="m9 18 6-6-6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>',
}

export function createIconElement(iconName: IconName, size: 'md' = 'md'): HTMLElement {
  const svg = document.createElement('div')
  const sizeValue = size === 'md' ? '16' : '16'
  
  svg.innerHTML = `
    <svg
      width="${sizeValue}"
      height="${sizeValue}"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${icons[iconName]}
    </svg>
  `
  
  return svg
} 