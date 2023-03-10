import { BaseMediator, NotificationHandle } from "../../Frame/BaseMediator/BaseMediator";
import { INotification } from "../../Frame/PureMVC";
import { _Facade, _G, _Log4JS } from "../../Global";
import { NotificationEnum } from "../../NotificationTable";
import { UserLogin } from "../Proxy/UserAuthProxy/class";
import { UserProxy } from "../Proxy/UserProxy/UserProxy";

export class UserMediator extends BaseMediator{  
    private m_UserProxy:UserProxy = _Facade.FindProxy(UserProxy);
    RegisterNotification(notificationMap:Map<string,NotificationHandle>):void{
        notificationMap
        .set(NotificationEnum.M_UserLogin,this.UserLoginHandle.bind(this))
    }  

    UserLoginHandle(userLogin: UserLogin ,notification:INotification ):void { 
        _Log4JS.info("用户成功登录服务器");
        this.m_UserProxy.UserLogin(userLogin.Socket,userLogin.Accout);
    }
}