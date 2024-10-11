import {marked} from 'marked';


export default function markdownToHtml(markdown: string) {
    if(!markdown) {
        return '';
    }
    return marked.parse(markdown, {
        breaks: true
    });
}

