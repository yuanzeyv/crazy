import { SystemType } from "../NetDispatchProxy";
import { NetHandle, NetModule } from "../NetModule";
//C_S
export enum NetUserSystemC_S{
    Request_UserInfo,//请求用户信息 
    Request_UserChangeName,//改变用户名称
}
//S_C
export enum NetUserSystemS_C{
    Response_UserInfo,//响应用户信息 
    Response_UserChangeName,//改变用户名称
}
export interface UserInfo{
    name:string;//用户的名称
    uid:string;//用户的uid
}
export interface UserSettingInfo{
    soundSwitch:boolean;//音乐开关
    soundEffSwitch:boolean;//音效开关
    lowPowerSwitch:boolean;//低电源模式开关
    manorNotify:boolean;//领地刷新提示
    manorSolt:boolean;//领地资源抢夺提示
    boxLevelNotify:boolean;//宝箱升级可减少cd的提示
    boxLevelUpFinish:boolean;//宝箱升级完成的提示
}
//用于存储角色的基本数据
export class UserNetModule extends NetModule{
    InitSystemType():SystemType{
        return SystemType.UserSystem;
    }

    //针对由服务端收到客户端消息的处理
    RegisterNetMap(listenMap:Map<number,NetHandle>){
        listenMap 
        .set(NetUserSystemC_S.Request_UserInfo,this.Request_UserInfoHandle.bind(this))
        .set(NetUserSystemC_S.Request_UserChangeName,this.Request_UserChangeNameHandle.bind(this));
    }
    
    Request_UserInfoHandle(userID:string,data:any){
        if(this.m_ExecuteObj.OnUserInfoHandle)
            this.m_ExecuteObj.OnUserInfoHandle(userID,data);
    }
 
    Request_UserChangeNameHandle(userID:string,data:any){
        if(this.m_ExecuteObj.OnUserChangeNameHandle)
            this.m_ExecuteObj.OnUserChangeNameHandle(userID,data);
    }

    
    //发送用户信息
    SendUserInfoHandle(userID:string,userInfo:UserInfo){
        this.Send(userID,NetUserSystemS_C.Response_UserInfo,userInfo);
    }

    //发送用户设置信息
    SendChangName(userID:string,name:string){
        this.Send(userID,NetUserSystemS_C.Response_UserChangeName,name);
    }
}