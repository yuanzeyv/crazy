import { BaseCommand } from "../../Frame/BaseControl/BaseCommand";
import { INotification } from "../../Frame/PureMVC";
import { _Facade } from "../../Global";
import { WebSocketProxy } from "../Proxy/WebSocketProxy/WebSocketProxy";

export class StartServerCommand extends BaseCommand{ 
    Execute(body:any,name:string,notification:INotification){ 
        let webSocketProxy:WebSocketProxy = _Facade.FindProxy(WebSocketProxy);
        webSocketProxy.CreateServer();
    } 
}