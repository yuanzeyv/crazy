import { INotification, SimpleCommand } from "../PureMVC"
export class BaseCommand extends SimpleCommand{
    constructor(){
        super();
    }
    
    Execute(body:any,name:string,notification:INotification){

    }
    execute(notify: INotification): void {
        this.Execute(notify.getBody(),notify.getName(),notify);//直接传入解析后的数据
    }
}