import { INotification, Mediator } from "../../Frame/PureMVC";
import { _Facade, _Log4JS } from "../../Global"; 

export type NotificationHandle = (data:any,notification:INotification)=>void;

export class BaseMediator extends Mediator{
    private m_NotificationMap:Map<string,NotificationHandle> = new Map<string,NotificationHandle>(); 
 
    RegisterNotification(notificationMap:Map<string,NotificationHandle>):void{}

    listNotificationInterests(): string[] {
        this.RegisterNotification(this.m_NotificationMap);
        let listenArray:Array<string> = new Array<string>();
        this.m_NotificationMap.forEach((v:NotificationHandle,k:string)=>{
            v.bind(this);
            listenArray.push(k);
        });
        return listenArray;
    }
 
    handleNotification(notification: INotification): void {
        let handleName:string = notification.getName();
        let handleFunc:NotificationHandle|undefined = this.m_NotificationMap.get(handleName);
        if( handleFunc == undefined ) {
            _Log4JS.warn("The message was not implemented");//打印消息没有被实现
            return;
        }
        
        handleFunc(notification.getBody(),notification);
    } 
}