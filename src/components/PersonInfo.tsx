import {useCallback, useState} from 'react';
import {Separator} from '@/components/ui/separator';
import {Phone, Mail, Tag, ClipboardCopy} from 'lucide-react';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {getInitials} from '../lib/utils';
import {useAsync, useCopyToClipboard} from "react-use";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import axios from "axios";

const PersonInfo = ({personInfo}) => {
  const [state, copyToClipboard] = useCopyToClipboard()

  const [savedRemark, setSavedRemark] = useState('')
  const [remark, setRemark] = useState('')

  useAsync(async () => {
    if(!personInfo) {
      return ''
    }
    setRemark('')
    const {data} = await axios.get('/sleekflow/contact/' + personInfo.userIdentityId)
    setRemark(data?.remark || '')
    setSavedRemark(data?.remark || '')
  }, [personInfo?.userIdentityId]);

  const saveRemark = useCallback(async function (current: string) {
    current = current.trim()
    if(current === savedRemark) {
      return
    }
    const { data } = await axios.post('/sleekflow/contact',
    {
      id: personInfo.userIdentityId,
      remark: current
    })
    setSavedRemark(data.remark)
  }, [personInfo?.userIdentityId, savedRemark])

  if (!personInfo) return null;

  return (
      <>
        <div className="flex flex-col items-center p-4">
          <Avatar className="size-20">
            <AvatarFallback className="bg-primary text-white text-xl">{getInitials(personInfo.name)}</AvatarFallback>
          </Avatar>
          <p className="mt-2 font-medium">{personInfo.name}</p>
        </div>

        <Separator/>

        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center h-6 group">
              <Phone className="mr-2 text-muted-foreground size-4"/>
              <span className="text-sm">{personInfo.phoneNumber}
              </span>
              {personInfo.phoneNumber && <Button className={'ml-1 hidden group-hover:inline-flex'} variant="ghost" size={'xsIcon'}
                                                 onClick={() => copyToClipboard(personInfo.phoneNumber)}><ClipboardCopy
                className='text-muted-foreground size-4'/></Button>}
            </div>
            <div className="flex items-center h-6 group">
              <Mail className="mr-2 text-muted-foreground size-4"/>
              <span className="text-sm">{personInfo.email}</span>
              {personInfo.email && <Button className={'ml-1 hidden group-hover:inline-flex'} variant="ghost" size={'xsIcon'}
                                           onClick={() => copyToClipboard(personInfo.email)}><ClipboardCopy
                className=' text-muted-foreground size-4'/></Button>}
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-muted-foreground"/>
              <div className="flex flex-wrap gap-1">
                {personInfo.labels?.map((x) => (
                    <span key={x} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {x}
                </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm mb-2 text-muted-foreground">Remark</h3>
              <Textarea value={remark} onBlur={(e) => saveRemark(e.target.value)} onChange={(e) => {setRemark(e.target.value)}} placeholder={`Add remark for ${personInfo.name}`}/>
            </div>
          </div>
        </div>
      </>
  );
};

export default PersonInfo;
