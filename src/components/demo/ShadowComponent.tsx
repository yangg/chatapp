import React, { useRef, useEffect } from 'react';
import { createRoot, Root } from "react-dom/client";

class ShadowRootComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

customElements.define('shadow-root-component', ShadowRootComponent);

const ShadowComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<ShadowRootComponent | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.shadowRoot) {
      if (!rootRef.current) {
        rootRef.current = createRoot(ref.current.shadowRoot);
      }
      rootRef.current.render(<>{children}</>);
    }

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [children]);

  return <shadow-root-component ref={ref} />;
};

export default ShadowComponent;
