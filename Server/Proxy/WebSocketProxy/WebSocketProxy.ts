import { GlobalConfig } from "../../../Config/config";
import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { UserAuthProxy } from "../UserAuthProxy/UserAuthProxy";
import { _Facade, _Log4JS } from "../../../Global"; 
import { WebSocketServer,WebSocket } from "ws";
export class WebSocketProxy extends BaseProxy{
    private m_Server?:WebSocketServer = undefined;//网络 
    private m_UserAuthProxy:UserAuthProxy|undefined;
    //创建并绑定连接
    CreateServer(){ 
        _Log4JS.info(`服务器创建成功，监听端口${GlobalConfig.ServerPort}`);
        this.m_Server = new WebSocketServer({ port: GlobalConfig.ServerPort });
        this.m_Server.on("connection",this.ClientConnect.bind(this)); 
    } 
    
    private ClientConnect(ws:WebSocket,req:any){ 
        if(this.m_UserAuthProxy != undefined)
            this.m_UserAuthProxy.AuthClietConnect(ws); 
    }
    public onLoad(): void {
        this.m_UserAuthProxy = _Facade.FindProxy(UserAuthProxy);
    }
} 