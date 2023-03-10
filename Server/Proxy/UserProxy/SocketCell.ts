import { type } from "os";
import { json } from "stream/consumers";
import { RawData, WebSocket } from "ws";
import { _Facade, _Log4JS } from "../../../Global";
import { NetDispatchProxy } from "../NetDispatchProxy/NetDispatchProxy";
import { MessageFormat } from "./MessageFormat";

export class SocketCell{
    public m_Socket:WebSocket;
    public m_UserID:string;
    public m_NetDispatchProxy:NetDispatchProxy = _Facade.FindProxy(NetDispatchProxy);
    constructor(userID:string,socket:WebSocket){
        this.m_UserID = userID;//对角色名称赋值
        this.m_Socket = socket;//对socket进行赋值
        let recviveMessageHandle:any;
        let ErrorHandle:any;
        let CloseHandle:any;
        recviveMessageHandle = (data: RawData, isBinary: boolean)=>{ 
            var obj:MessageFormat = JSON.parse(data.toString());//转换为字符串
            if(obj.ID == undefined || typeof(obj.ID)  != "number" || obj.Data == undefined){
                _Log4JS.info(userID + "接收到一条格式错误的消息" + data.toString());
                return;
            } 
            _Log4JS.warn(`收到来自${this.m_UserID}的消息${obj.ID}:${obj.Data}`);
            //将消息派发至各个游戏系统之中
            this.m_NetDispatchProxy.Execute(this.m_UserID,obj.ID,obj.Data);//执行这一个网络消息
        }

        ErrorHandle = (error:Error)=>{
            _Log4JS.warn(userID + "接收到一条错误的消息，错误码:" + error.message);
            socket.close();//关闭当前的连接
        }

        CloseHandle = (code: number, reason: Buffer)=>{
            _Log4JS.warn(userID + "退出了登录");
            socket
            .removeListener("message",recviveMessageHandle)
            .removeListener("error",ErrorHandle) 
            .removeListener("close",CloseHandle);
        } 
        socket
        .addListener("message",recviveMessageHandle)
        .addListener("error",ErrorHandle) 
        .addListener("close",CloseHandle);    
        _Log4JS.info(userID + "用户，成功登录");
    } 
    SendMessage(msgID:number,data:Object){
        let messageFormat:MessageFormat = {
            ID:msgID,//消息的id
            Data:data//消息的详细数据
        };
        let sendData:string = JSON.stringify(messageFormat)
        _Log4JS.warn(`向${this.m_UserID}发送消息${msgID}:${sendData}`);
        //向客户端发送当前消息
        this.m_Socket.send(sendData);
    }
    //外部可以手动调用Close函数，来关闭Socket链接
    Close(){
        this.m_Socket.close();
    }
}