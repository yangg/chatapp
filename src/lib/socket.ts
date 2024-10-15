
import axios from "./axios";
import {io} from 'socket.io-client'

export const socket = io(axios.defaults.baseURL)
