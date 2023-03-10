import { INotification, Mediator,Proxy } from "../../Frame/PureMVC";

export class BaseProxy extends Proxy{  
    public onRegister(): void {}  

    public onRemove(): void {} 
    //将会在所有的代理加载完毕后，调用本函数，以便无视优先级，直接查询各个代理
    public onLoad(): void {}
}