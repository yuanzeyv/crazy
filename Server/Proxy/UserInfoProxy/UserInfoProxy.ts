import { MysqlError, FieldInfo } from "mysql";
import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { UserBaseProxy } from "../../../Frame/BaseProxy/UserBaseProxy";
import { _Facade, _MySqlProxy } from "../../../Global";
import { UserNetModule } from "../NetDispatchProxy/NetMessage/UserNetModule";
import { UserProxy } from "../UserProxy/UserProxy";
interface UserInfo{
    PassWord:string;
    Account:string;
    GameID:string;
}
export class UserInfoProxy extends UserBaseProxy{
    private mUserNetModule:UserNetModule = new UserNetModule(this); 
    private mUserMap:Map<string,UserInfo> = new Map<string,UserInfo>();
    
    public RegisterUserData(userID:string,finishHandle:()=>void):void{//角色登录成功时，调用此函数，可以初始化角色对应的数据信息
        _MySqlProxy.Execute(`select * from LoginInfoTable where GameID = "${userID}"`,(result:Array<UserInfo>)=>{
            let userInfo:UserInfo = result[0];
            this.mUserMap.set(userID,userInfo);
            this.mUserNetModule.SendUserInfoHandle(userID,{ 
               name: userInfo.Account,
               uid: userInfo.GameID
            });
        });
    }
    public UnRegisterUserData(userID: string): void {
        if(!this.mUserMap.has(userID))
            return;
        this.mUserMap.delete(userID);
    }
    
    OnUserInfoHandle(userID:string,data:any){
        let userInfo:UserInfo|undefined = this.mUserMap.get(userID);
        if(userInfo == undefined)
            return;
        this.mUserNetModule.SendUserInfoHandle(userID,{ 
            name: userInfo.Account,
            uid: userInfo.GameID
        }); 
    }
     
    OnUserChangeNameHandle(userID:string,name:string){
        let userInfo:UserInfo|undefined = this.mUserMap.get(userID);
        if(userInfo == undefined)
            return;
        userInfo.Account = name;
        this.mUserNetModule.SendChangName(userID,name);
    }
}