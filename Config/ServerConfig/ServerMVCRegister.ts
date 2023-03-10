import { BaseMVCRegister, CommandConstructor, MediatorConstructor, ProxyConstructor } from "../../Frame/MVCRegister/BaseMVCRegister";
import { NotificationEnum } from "../../NotificationTable";
import { StartServerCommand } from "../../Server/Control/StartServerCommand";
import { UserMediator } from "../../Server/Mediator/UserMediator";
import { ConfigManagerProxy } from "../../Server/Proxy/ConfigManagerProxy/ConfigManagerProxy";
import { MySqlProxy } from "../../Server/Proxy/MySqlProxy/MySqlProxy";
import { NetDispatchProxy } from "../../Server/Proxy/NetDispatchProxy/NetDispatchProxy";
import { RedisProxy } from "../../Server/Proxy/RedisProxy/RedisProxy";
import { UserAuthProxy } from "../../Server/Proxy/UserAuthProxy/UserAuthProxy";
import { UserInfoProxy } from "../../Server/Proxy/UserInfoProxy/UserInfoProxy";
import { UserProxy } from "../../Server/Proxy/UserProxy/UserProxy";
import { WebSocketProxy } from "../../Server/Proxy/WebSocketProxy/WebSocketProxy";
 export class ServerMVCRegister extends BaseMVCRegister{  
    protected AllocCommand(commandMap: Map<NotificationEnum, CommandConstructor>): void {
        commandMap
        .set(NotificationEnum.C_StartServer,StartServerCommand);
    }
  
    protected AllocMediator(mediatorMap: Set<MediatorConstructor>): void {
      mediatorMap
      .add(UserMediator)
    }
    
    protected AllocProxy(proxyMap: Set<ProxyConstructor>): void {
        proxyMap 
        .add(ConfigManagerProxy)
        .add(NetDispatchProxy)
        .add(RedisProxy)
        .add(WebSocketProxy)
        .add(MySqlProxy)
        .add(UserAuthProxy)
        .add(UserProxy)
        .add(UserInfoProxy);
    } 
 }  