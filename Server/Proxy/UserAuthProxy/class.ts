import { RawData ,WebSocket} from "ws";
export class UserLogin{
    Accout:string;
    Socket:WebSocket;
    constructor(account:string,socket:WebSocket){
        this.Accout = account;
        this.Socket = socket;
    }
}
export interface AuthMessage{
    Account:string;
    PassWord:string;
    ReConnect:boolean;//是否是重连消息
}
export interface AuthReturn{
    Error:boolean;//是否有错误
    ErrorData:string;//错误消息
    Status:boolean;//成功 或 失败
    IsReConnect:boolean;//是否时重连
}