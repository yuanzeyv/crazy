import { BaseProxy } from "./BaseProxy";
//强行将用户消息转换为同步，以达到数据初始化
export class UserBaseProxy extends BaseProxy{
    public RegisterUserData(userID:string,finishHandle:()=>void):void{//角色登录成功时，调用此函数，可以初始化角色对应的数据信息
    }
    public UnRegisterUserData(userID:string):void{//默认反注册时同步的，立即执行的
    }
}