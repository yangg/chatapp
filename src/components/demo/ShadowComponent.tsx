import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'

function hexToHSL(hex) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  // Convert r, g, b values to the range 0-1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the maximum and minimum values to get the lightness
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h}, ${s}%, ${l}%`;
}

class ShadowRootComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

customElements.define('shadow-root-component', ShadowRootComponent);

const ShadowComponent: React.FC<{ children: React.ReactNode, themeColor: string }> = ({ children, themeColor }) => {
  const ref = useRef<ShadowRootComponent | null>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    async function initReactRoot() {
      if (ref.current && ref.current.shadowRoot) {
        if(themeColor) {
          ref.current.style.setProperty('--primary', hexToHSL(themeColor))
        }
        const shadowRoot = ref.current.shadowRoot
        if('createRoot' in ReactDOM) {
          // React 18
          const { createRoot } = await import('react-dom/client');
          if (!rootRef.current) {
            rootRef.current = createRoot(shadowRoot);
          }
          rootRef.current.render(<>{children}</>);
        } else {
          // React 17
          rootRef.current = ReactDOM.render(<>{children}</>, shadowRoot);
        }
      }
    }
    initReactRoot()

    return () => {
      // if (ref.current && ref.current.shadowRoot) {
      //   const shadowRoot = ref.current.shadowRoot;

      //   if (rootRef.current) {
      //     // React 18
      //     rootRef.current.unmount();
      //     rootRef.current = null;
      //   } else {
      //     // React 17
      //     ReactDOM.unmountComponentAtNode(shadowRoot);
      //   }
      // }
    };
  }, [children]);

  return <shadow-root-component ref={ref} />;
};

export default ShadowComponent;
