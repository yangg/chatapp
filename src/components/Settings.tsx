
import {useState, useEffect, useCallback} from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {useAsync} from "react-use";
import axios from "axios";

export default function DialogContent({setIsOpen}) {
  const [lastDelay, setLastDelay] = useState(15)
  const [config, setConfig] = useState({
    itEmail: '',
    notifyDelay: 15
  })

  useEffect(() => {
    if(config.notifyDelay > 0) {
      setLastDelay(config.notifyDelay)
    }
  }, [config.notifyDelay]);

  useAsync(async () => {
    const {data} = await axios.get('/sleekflow/config')
    setConfig(data)
  }, []);

  const saveConfig = useCallback(async function () {
    await axios.post('/sleekflow/config', config)
    setIsOpen(false)
  }, [config])

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="general-it-mail">General IT Mail</Label>
        <Input
          id="general-it-mail"
          value={config.itEmail}
          onChange={(e) => setConfig(x => ({
            ...x,
            itEmail: e.target.value
          }))}
          placeholder="Enter IT mail address"
        />
        <p className="text-sm text-muted-foreground">
          Enter the email address for receiving General unread messages notifications
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive unread message notifications
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={config.notifyDelay !== 0}
            onCheckedChange={(checked) => {
              setConfig(x => ({
                ...x,
                notifyDelay: checked ? lastDelay : 0
              }))
            }}
          />
        </div>
        {config.notifyDelay > 0 && (
          <div className="grid gap-2 mt-2">
            <Label htmlFor="unread-message-minutes">Unread Message Notification Delay</Label>
            <Select
              value={String(config.notifyDelay)}
              onValueChange={(value) => {
                setConfig(x => ({
                  ...x,
                  notifyDelay: Number(value)
                }))
              }}
            >
              <SelectTrigger id="unread-message-minutes">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select how long you want to be notified about unread messages
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button onClick={saveConfig}>Save Changes</Button>
      </div>
    </div>
  )
}
