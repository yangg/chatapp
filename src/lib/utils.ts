import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPortalContainer() {
  const shadowDOM = document.querySelector('shadow-root-component')
  let container
  if(shadowDOM) {
    container = shadowDOM.shadowRoot!.lastElementChild
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

export function last(arr) {
  if(!arr || !arr.length) return null
  return arr[arr.length - 1]
}

export function getImageWidth(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img.width);
    img.onerror = () => resolve(100);
    img.src = url;
  });
}

