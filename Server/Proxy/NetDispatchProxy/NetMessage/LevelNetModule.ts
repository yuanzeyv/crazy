import { SystemType } from "../NetDispatchProxy";
import { NetHandle, NetModule } from "../NetModule";
//C_S
export enum NetLevelSystemC_S{
    Request_LevelInfo,//请求用户等级信息 
}
//S_C
export enum NetLevelSystemS_C{
    Response_LevelInfo,//响应用户等级信息
}
export interface LevelInfo{
    LevelExp:number;//当前的经验值
    Level:number;//当前的等级
} 
//用于存储角色的基本数据
export class LevelNetModule extends NetModule{
    InitSystemType():SystemType{ return SystemType.LevelSystem; }

    //针对由服务端收到客户端消息的处理
    RegisterNetMap(listenMap:Map<number,NetHandle>){
        listenMap 
        .set(NetLevelSystemC_S.Request_LevelInfo,this.Request_LevelInfoHandle.bind(this)) 
    }
    
    Request_LevelInfoHandle(userID:string){
        if(this.m_ExecuteObj.OnLevelInfoHandle)
            this.m_ExecuteObj.OnLevelInfoHandle(userID);
    } 
    //发送用户设置信息
    SendLevelInfo(userID:string,levelConfig:LevelInfo){
        this.Send(userID,NetLevelSystemS_C.Response_LevelInfo,levelConfig);
    }
}