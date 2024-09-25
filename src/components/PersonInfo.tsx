import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail } from 'react-feather';

const PersonInfo = ({ personInfo }) => {
  const getNameInitials = (name) => {
    if (name) {
      const names = name.split(' ');
      return names.map(name => name.charAt(0)).join('');
    }
    return '';
  };

  if (!personInfo) return null;

  const nameInitials = getNameInitials(personInfo.name);

  return (
    <div className="w-1/5 p-4 border-l border-gray-200">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-2">
        <span className="text-xl font-semibold text-white">{nameInitials}</span>
      </div>
      <p className="text-center font-medium">{personInfo.name}</p>

      <Separator className="my-3" />

      <h3 className="text-l font-semibold mb-4">Contact Info</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <Phone className="mr-2 text-gray-500 size-5" />
          <span>{personInfo.phone}</span>
        </div>
        <div className="flex items-center">
          <Mail className="mr-2 text-gray-500" size={20} />
          <span>{personInfo.email}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonInfo;