import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'

class ShadowRootComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

customElements.define('shadow-root-component', ShadowRootComponent);

const ShadowComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<ShadowRootComponent | null>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    async function initReactRoot() {
      if (ref.current && ref.current.shadowRoot) {
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
