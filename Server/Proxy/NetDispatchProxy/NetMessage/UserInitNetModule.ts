import { SystemType } from "../NetDispatchProxy";
import { NetHandle, NetModule } from "../NetModule"; 
//S_C
export enum NetInitSystemS_C{
    Response_InitSuccess,//初始化成功 
    Response_InitFailed,//初始化失败
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
export class UserInitNetModule extends NetModule{
    InitSystemType():SystemType{
        return SystemType.InitSystem;
    }
 
    //发送用户信息
    SendInitSuccess(userID:string){
        this.Send(userID,NetInitSystemS_C.Response_InitSuccess,true);
    }

    //发送用户设置信息
    SendInitFailed(userID:string){
        this.Send(userID,NetInitSystemS_C.Response_InitFailed,false);
    }
}