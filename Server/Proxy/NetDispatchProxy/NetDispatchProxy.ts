import { GlobalConfig } from "../../../Config/config";
import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { _Facade, _Log4JS, _TimeWheel } from "../../../Global";
import { NotificationEnum } from "../../../NotificationTable";
import { SoltCell } from "../../../Util/TWTime";
import { NetHandle, NetModule } from "./NetModule";
//每个系统会有一万的消息可使用
export enum SystemType{
    UserSystem = 1,//用户系统用
    LevelSystem = 2,//等级系统用
    InitSystem = 3,//系统初始化用
    Final = 9999,//不会用到的系统
};
export class NetDispatchProxy extends BaseProxy{ 
    private m_UserMap:Set<NetModule> = new Set<NetModule>();//每个websocket 会对应一个socketCell,用以方便消息的派发
    private m_ClienthandleMap:Map<number,NetHandle> = new Map<number,NetHandle>();//每个websocket 会对应一个socketCell,用以方便消息的派发
    public RegisterNetModule(netModule:NetModule){
        this.m_UserMap.add(netModule);
        netModule.ListenMap.forEach((handle:NetHandle,requestID:number)=>{
            this.m_ClienthandleMap.set(netModule.GetRequestID(requestID),handle);
        })
    }
    public UnRegisterNetModule(netModule:NetModule){
        this.m_UserMap.delete(netModule);
        netModule.ListenMap.forEach((handle:NetHandle,requestID:number)=>{
            this.m_ClienthandleMap.delete(netModule.GetRequestID(requestID));
        })
    }
    Execute(userID:string,msgID:number,data:any){
        let netHandle:NetHandle | undefined = this.m_ClienthandleMap.get(msgID);
        if( netHandle == undefined){
            _Log4JS.info(`消息号:${msgID} 未注册执行函数`);
            return;
        }
        netHandle(userID,data);
    } 
}  
