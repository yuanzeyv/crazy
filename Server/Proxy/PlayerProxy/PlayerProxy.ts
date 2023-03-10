import { MysqlError, FieldInfo } from "mysql";
import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { UserBaseProxy } from "../../../Frame/BaseProxy/UserBaseProxy";
import { _Facade, _MySqlProxy } from "../../../Global";
import { ConfigManagerProxy } from "../ConfigManagerProxy/ConfigManagerProxy";
import { LevelConfigCell } from "../ConfigManagerProxy/ConfigModel/LevelConfigCell";
import { LevelNetModule } from "../NetDispatchProxy/NetMessage/LevelNetModule"; 
interface LevelSqlInfo{
    Level:number;
    Exp:number;
    GameID:string;
}
export class LevelInfo{
    public mLevel:number;//当前的角色等级
    public mExp:number;//当前的经验信息
    constructor(level:number,exp:number){
        this.mLevel = level;
        this.mExp = exp;
    }
}
export class PlayerProxy extends UserBaseProxy{
    private mLevelNetModule:LevelNetModule = new LevelNetModule(this); 
    protected mUserDataMap:Map<string,LevelInfo> = new Map<string,LevelInfo>();
    private mLevelConfig:Map<number,LevelConfigCell> = new Map<number,LevelConfigCell>();
    public onLoad(): void {
        this.mLevelConfig = _Facade.FindProxy(ConfigManagerProxy).mLevelConfig;
    }
    public RegisterUserData(userID:string,finishHandle:()=>void):void{//角色登录成功时，调用此函数，可以初始化角色对应的数据信息
        _MySqlProxy.Execute(`select * from LevelInfoTable where GameID = "${userID}"`,(result:Array<LevelSqlInfo>)=>{
            let userInfo:LevelSqlInfo = result[0];
            this.mUserDataMap.set(userID,new LevelInfo(userInfo.Level,userInfo.Exp));
            finishHandle();
        });
    }
    public UnRegisterUserData(userID: string): void {
        if(!this.mUserDataMap.has(userID))
            return;
        this.mUserDataMap.delete(userID);
    }
    //请求玩家信息
    public OnLevelInfoHandle(userID:string){
        
    }
}