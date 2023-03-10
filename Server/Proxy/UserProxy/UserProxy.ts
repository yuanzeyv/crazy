import { WebSocket } from "ws";
import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { UserBaseProxy } from "../../../Frame/BaseProxy/UserBaseProxy";
import {  _Facade, _Log4JS, _TimeWheel } from "../../../Global";
import { SoltCell } from "../../../Util/TWTime";
import { UserInitNetModule } from "../NetDispatchProxy/NetMessage/UserInitNetModule";
import { PlayerProxy } from "../PlayerProxy/PlayerProxy";
import { UserInfoProxy } from "../UserInfoProxy/UserInfoProxy";
import { SocketCell } from "../UserProxy/SocketCell";
export class UserProxy extends BaseProxy{
    private m_UserMap:Map<string,SocketCell> = new Map<string,SocketCell>();//每个websocket 会对应一个socketCell,用以方便消息的派发
    private m_UserDataStatusMap:Map<string,boolean> = new Map<string,boolean>();//玩家数据准备的状态

    private m_UserSystemProxyMap:Set<UserBaseProxy> = new Set<UserBaseProxy>();
    private m_UserInitNetModule:UserInitNetModule = new UserInitNetModule(this); 
    public onLoad(): void { this.InitUserPorxyArray(); }
    InitUserPorxyArray() {
        this.m_UserSystemProxyMap
        .add(_Facade.FindProxy(PlayerProxy))
        .add(_Facade.FindProxy(UserInfoProxy));
    } 
    
    public UserLogined(account:string):boolean{//用户是否很早以前就已经登录了
        return this.m_UserMap.has(account);
    }

    private InitUserData(userID:string){
        let finishArray:Set<UserBaseProxy> = new Set<UserBaseProxy>();
        let timeSolt:SoltCell =_TimeWheel.Set(5000,()=>{
            this.m_UserInitNetModule.SendInitFailed(userID);//发送登录失败消息
            this.CloseClient(userID);//关闭客户端
        });
        this.m_UserSystemProxyMap.forEach((userBaseProxy:UserBaseProxy)=>{
            userBaseProxy.RegisterUserData(userID,()=>{
                if(this.m_UserMap.has(userID) == false){//客户端因为某些原有不存在了
                    userBaseProxy.UnRegisterUserData(userID);//反注册
                    return;
                }
                finishArray.add(userBaseProxy);//代表已经完成了
                if(finishArray.size != this.m_UserSystemProxyMap.size)
                    return;
                timeSolt.Stop();//停止计时
                this.m_UserInitNetModule.SendInitSuccess(userID);//发送登录成功的消息
                this.m_UserDataStatusMap.set(userID,true);
            })
        });
    }
    private ExitUserData(userID:string){
        this.m_UserSystemProxyMap.forEach((userBaseProxy:UserBaseProxy)=>{
            userBaseProxy.UnRegisterUserData(userID);
        });
        this.m_UserDataStatusMap.delete(userID);
    }

    public UserLogin(ws:WebSocket,userID:string){
        if(this.m_UserMap.has(userID))
            this.CloseClient(userID);//退出之前的客户端的客户端
        let cell:SocketCell = new SocketCell(userID,ws);
        this.m_UserMap.set(userID,cell);
        this.InitUserData(userID);
    } 

    public CloseClient(userID:string){
        let socketCell:SocketCell|undefined = this.m_UserMap.get(userID);
        if(socketCell != undefined){
            socketCell.Close();
            this.m_UserMap.delete(userID);
        }
        this.ExitUserData(userID);
    }

    public SendClient(userID:string,msgID:number,data:Object){
        let socketCell:SocketCell | undefined = this.m_UserMap.get(userID);
        if(socketCell == undefined){
            _Log4JS.warn(`向${userID}发送消息${msgID}失败，原因是角色未登录`);
            return;
        }
        socketCell.SendMessage(msgID,data);
    } 
}