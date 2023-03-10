import { FieldInfo } from "mysql";
import { RawData ,WebSocket} from "ws";
import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { _Facade, _Log4JS, _MySqlProxy, _TimeWheel } from "../../../Global";
import { NotificationEnum } from "../../../NotificationTable";
import { SoltCell } from "../../../Util/TWTime";
import { UserProxy } from "../UserProxy/UserProxy";
import { AuthMessage, AuthReturn, UserLogin } from "./class"; 

export class UserAuthProxy extends BaseProxy{
    //当前正在等待验证的时间槽
    private m_AuthTimeOutMap:Map<WebSocket,SoltCell> = new Map<WebSocket,SoltCell>();

    DeleteTimeOut(webSocket:WebSocket){
        let soltCell:SoltCell|undefined = this.m_AuthTimeOutMap.get(webSocket);
        if(soltCell == undefined)
            return;
        this.m_AuthTimeOutMap.delete(webSocket);
        soltCell.Stop();//停止时间轮
    }
    AuthSuccess(webSocket:WebSocket){
        this.DeleteTimeOut(webSocket);//删除定时器
    }
    AuthFail(webSocket:WebSocket){
        this.DeleteTimeOut(webSocket);//删除定时器
        webSocket.close();//验证失败 ，关闭socket
    }

    SendMessage(webSocket:WebSocket,account:string,authReturn:AuthReturn){ 
        let sendData:string = JSON.stringify(authReturn)
        _Log4JS.warn(`向${account}发送消息${sendData}`);
        //向客户端发送当前消息
        webSocket.send(sendData);
    }
    AuthClietConnect(socket:WebSocket){
        let recviveMessageHandle:any;
        let ErrorHandle:any;
        let CloseHandle:any;
        recviveMessageHandle = (data: RawData, isBinary: boolean)=>{
            let soltCell:SoltCell | undefined = this.m_AuthTimeOutMap.get(socket);
            if(soltCell == undefined)
                return;
            var obj:AuthMessage = JSON.parse(data.toString());//转换为字符串
            if(obj.Account == undefined || obj.PassWord == undefined || obj.ReConnect == undefined){//存在任何一个字段为空的情况
                _Log4JS.warn(`${socket.url}发送一条错误的验证消息`);
                this.AuthFail(socket);//直接验证失败，不返回任何消息
                return ;
            }
            let userProxy:UserProxy = _Facade.FindProxy(UserProxy); 
            _MySqlProxy.Execute(`select * from LoginInfoTable where GameID = "${obj.Account}";`,
            (data:Array<FieldInfo>)=>{
                let userIsLogin:boolean = userProxy.UserLogined(obj.Account);
                if( userIsLogin && obj.ReConnect){//发送一个重新连接消息
                }else{
                    _Facade.Send(NotificationEnum.M_UserLogin,new UserLogin(obj.Account,socket));//发送登录成功
                    this.SendMessage(socket,obj.Account,{
                        Status: true,
                        IsReConnect:false,
                        Error: false,//无错误，只是单纯的连接不上
                        ErrorData: ``   
                    });
                    this.AuthSuccess(socket);
                    return;
                }    
            },
            (error:string)=>{
                this.SendMessage(socket,obj.Account,{
                    Status: false,
                    IsReConnect:obj.ReConnect,
                    Error: false,//无错误，只是单纯的连接不上
                    ErrorData: ``
                });
                this.AuthFail(socket);//直接验证失败，不返回任何消息
                _Log4JS.warn(`用户 ${obj.Account} 登录失败 `);
            }); 
        }

        ErrorHandle = (error:Error)=>{
            socket.close();//关闭当前的连接
        }

        CloseHandle = (code: number, reason: Buffer)=>{
            socket
            .removeListener("message",recviveMessageHandle)
            .removeListener("error",ErrorHandle) 
            .removeListener("close",CloseHandle);
        }

        let TimeOutAuthHandle = ()=>{ 
            socket.send("超时未验证，已经推出");
            this.m_AuthTimeOutMap.delete(socket);
            socket.close();//关闭当前socket连接
        } 
        socket
        .addListener("message",recviveMessageHandle)
        .addListener("error",ErrorHandle) 
        .addListener("close",CloseHandle);
        this.m_AuthTimeOutMap.set(socket,_TimeWheel.Set(3000,TimeOutAuthHandle,1));
    }
    public onLoad(): void {
    }
}  
