import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { WaTemplate } from '../types/WaTemplate';
import { Star } from 'lucide-react';
import { useAsync } from 'react-use';
import axios from 'axios';
import markdownToHtml from '@/lib/markdown';

const TemplateList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [templates, setTemplates] = useState<WaTemplate[]>([]);
  const state = useAsync(async () => {
    const {data} = await axios.get('/sleekflow/template')
    setTemplates(data.whatsappTemplates)
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
    console.log('Selected template:', selectedTemplate);
    // Add your logic here to handle the selected template
    setIsOpen(false);
  };

  const toggleStar = (id: string) => {
    setTemplates(prevTemplates => prevTemplates.map(t => t.id === id ? { ...t, isStarred: !t.isStarred } : t));
  };


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
        <div className="grid grid-cols-3 gap-4 py-2 overflow-y-auto max-h-[600px]">
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
              {/* <Star 
                className={`absolute top-4 right-4 size-5 text-gray-400 transition-colors ${
                  template.isStarred ? 'text-yellow-400' : 'text-gray-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(template.id);
                }}
              /> */}
              <h3 className="mb-2 pr-6">{template.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{template.category}</p>
              <Separator className="mb-2" />
              <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: markdownToHtml(template.components[0]?.text || '') }} />
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

export default TemplateList;
