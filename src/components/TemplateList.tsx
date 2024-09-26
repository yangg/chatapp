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

const TemplateList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [templates, setTemplates] = useState<WaTemplate[]>([]);

  

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

  useEffect(() => {
    setTemplates([
      { id: '1', name: 'Welcome Message', category: 'Onboarding', content: `Welcome to our service! We're excited to have you on board.`, isStarred: false },
      { id: '2', name: 'Order Confirmation', category: 'Sales', content: 'Your order #{{order_number}} has been confirmed and is being processed.', isStarred: true },
      // ... (other templates)
    ]);
  }, []);

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
              <Star 
                className={`absolute top-4 right-4 size-5 text-gray-400 transition-colors ${
                  template.isStarred ? 'text-yellow-400' : 'text-gray-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(template.id);
                }}
              />
              <h3 className="mb-2 pr-6">{template.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{template.category}</p>
              <Separator className="mb-2" />
              <p className="text-sm text-gray-600">{template.content}</p>
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
