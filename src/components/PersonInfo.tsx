import React from 'react';
import { Separator } from '@/components/ui/separator';
import {Phone, Mail, Tag, ClipboardCopy} from 'lucide-react';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import { getInitials } from '../lib/utils';
import {useCopyToClipboard} from "react-use";
import {Button} from "@/components/ui/button.tsx";

const PersonInfo = ({ personInfo }) => {
  const [state, copyToClipboard] = useCopyToClipboard()
  if (!personInfo) return null;

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <Avatar className="size-20">
          <AvatarFallback className="bg-primary text-white text-xl">{getInitials(personInfo.name)}</AvatarFallback>
        </Avatar>
        <p className="mt-2 font-medium">{personInfo.name}</p>
      </div>

      <Separator />

      <div className="p-4">
        {/* <h3 className="text-l mb-4">Contact Info</h3> */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Phone className="mr-2 text-muted-foreground size-4" />
            <span className="text-sm">{personInfo.phoneNumber}
              </span>
            {personInfo.phoneNumber && <Button className={'ml-1'} variant="ghost" size={'xsIcon'} onClick={() => copyToClipboard(personInfo.phoneNumber)}><ClipboardCopy className=' text-muted-foreground size-4'/></Button>}
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 text-muted-foreground size-4" />
            <span className="text-sm">{personInfo.email}</span>
            {personInfo.email && <Button className={'ml-1'} variant="ghost" size={'xsIcon'} onClick={() => copyToClipboard(personInfo.email)}><ClipboardCopy className=' text-muted-foreground size-4'/></Button>}
          </div>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {personInfo.labels?.map((x) => (
                <span key={x} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonInfo;
