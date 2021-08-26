import { io } from "socket.io-client"
let socket=null
function createconnection(url){
    socket= io("http://localhost:5000" )
}
export  {socket,createconnection}