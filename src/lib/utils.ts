import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPortalContainer() {
  const shadowRoot = document.querySelectorAll('shadow-root-component')
  let container
  if(shadowRoot.length) {
    container = shadowRoot[0].shadowRoot!.lastElementChild
    // const id = 'shadow-portal-root'
    // container = target.getElementById(id);
    // if(!container) {
    //   container = document.createElement("div");
    //   container.id = id;
    //   target.appendChild(container);
    // }
  }
  return container
}


export function getInitials(name: string) {
  if (!name) return '';
  return name.split(' ').slice(0, 2).map(n => n.charAt(0)).join('');
}

