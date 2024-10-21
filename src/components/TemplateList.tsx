import React, {useState, useMemo, useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader, DialogOverlay, DialogPortal,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Separator} from '@/components/ui/separator';
import {WaTemplate} from '../types/WaTemplate';
import {Star} from 'lucide-react';
import {useAsync} from 'react-use';
import axios from 'axios';
import markdownToHtml from '@/lib/markdown';
import {useAtomInstance, useAtomSelector} from "@zedux/react";
import {messageState} from "@/atoms/messages.ts";
import {getSelectedConversation} from "@/atoms/selectedConversation.ts";

const TemplateList: React.FC = () => {
  const selectedConversation = useAtomSelector(getSelectedConversation)!;
  const {sendMessage} = useAtomInstance(messageState, [selectedConversation.conversationId]).exports

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [templates, setTemplates] = useState<WaTemplate[]>([]);
  const state = useAsync(async () => {
    const {data} = await axios.get('/sleekflow/template')
    setTemplates(data.whatsappTemplates.filter(t => {
      if(t.status !== "APPROVED") {
        return false
      }
      if(t.components.some(c => c.example || c.text?.includes('{{'))) {
        return false
      }
      return true
    }))
    return 1
  }, [])


  const categories = useMemo(() => [...new Set(templates.map(t => t.category))], [templates]);

  const filteredTemplates = useMemo(() => {
    if (!selectedCategory) return templates;
    return templates.filter(t => t.category === selectedCategory);
  }, [selectedCategory, templates]);

  const selectTemplate = (id: string) => {
    setSelectedTemplate(id);
  };

  const handleSend = () => {
    if (!selectedTemplate) {
      return
    }
    const template = filteredTemplates.find(x => x.id === selectedTemplate)!
    console.log('Selected template:', template);

    const components = template.components.reduce((acc, c) => {
      if(c.example || c.text?.includes('{{')) {
        let item = {
          type: c.type.toLowerCase(),
          parameters: []
        }
        acc.push(item)
        if(c.format === "DOCUMENT" || c.format === 'IMAGE') {
          const format = c.format.toLowerCase()
          item.parameters.push({
            type: format,
            [format]: {
              link: c.example.header_handle[0],
            }
          })
        } else {
          item.parameters.push({
            type: 'text',
            text: 'TODO INPUT'
          })
        }
      }
      return acc
    }, [] )
    sendMessage({
      messageType: 'template',
      extendedMessage: {
        "WhatsappCloudApiTemplateMessageObject": {
          templateName: template.name,
          components,
          language: template.language,
        }
      },
    }, selectedConversation)
    setIsOpen(false);
  };

  const toggleStar = (id: string) => {
    setTemplates(prevTemplates => prevTemplates.map(t => t.id === id ? {...t, isStarred: !t.isStarred} : t));
  };


  let container
  // const target = document.querySelectorAll('shadow-root-component')[1].shadowRoot.children[1]
  // let element = target.querySelector("#headlessui-portal-root");
  // if(!element) {
  //   const element = document.createElement("div");
  //   element.id = "headlessui-portal-root";
  //   target.appendChild(element);
  // }
  // console.log(target, element)
  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Choose Template</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Choose Template</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList>
              <TabsTrigger value="">All</TabsTrigger>
              {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-3 gap-4 py-2 overflow-y-auto max-h-[600px] px-[2px]">
            {filteredTemplates.map(template => (
                <div
                    key={template.id}
                    className={`p-4 rounded-md border cursor-pointer transition-colors relative ${
                        selectedTemplate === template.id
                            ? 'border-transparent outline outline-primary'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => selectTemplate(template.id)}
                >
                  {/*<Star
              className={`absolute top-4 right-4 size-5 transition-colors ${
                template.isStarred ? 'text-yellow-400' : 'text-gray-400'
              }`}
              fill={template.isStarred ? 'currentColor': 'none'}
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(template.id);
              }}
            />*/}
                  <h3 className="mb-2 pr-6">{template.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{template.category}</p>
                  <Separator className="mb-2"/>
                  <WhatsAppComponents components={template.components}/>
                </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSend} disabled={!selectedTemplate}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

function WhatsAppButtons({buttons}) {
  return buttons.map((b, i) => <Button key={i} variant="outline" size={'sm'}
                             className={'w-full'}>{b.text}</Button>)
}

function WhatsAppComponents({components}) {
  return components.map((c, i) => (
        c.type === 'BUTTONS' ? <WhatsAppButtons buttons={c.buttons} key={i}/>
            : <div key={i} className="text-sm text-gray-600 line-clamp-3 empty:hidden" title={c.text || ''}
                   dangerouslySetInnerHTML={{__html: markdownToHtml(c.text || '')}}/>))
}

export default TemplateList;
