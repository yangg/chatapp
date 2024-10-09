import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, Tag } from 'lucide-react';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import { getInitials } from '../lib/utils';

const PersonInfo = ({ personInfo, tags }) => {
  if (!personInfo) return null;

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <Avatar className="size-20">
          <AvatarFallback className="bg-primary text-white text-xl">{getInitials(personInfo.firstName)}</AvatarFallback>
        </Avatar>
        <p className="mt-2 font-medium">{personInfo.firstName}</p>
      </div>

      <Separator />

      <div className="p-4">
        {/* <h3 className="text-l mb-4">Contact Info</h3> */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Phone className="mr-2 text-muted-foreground size-4" />
            <span className="text-sm">{personInfo.smsUser?.phone_number}</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 text-muted-foreground size-4" />
            <span className="text-sm">{personInfo.email}</span>
          </div>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {tags?.map((tag, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {tag.hashtag}
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
