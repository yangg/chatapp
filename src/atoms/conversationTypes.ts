import {atom} from "@zedux/react";

export const conversationTypesState = atom('conversationTypes', [{
  title: 'General'
},{
  title: 'File Message',
  getData: 1,
}])
