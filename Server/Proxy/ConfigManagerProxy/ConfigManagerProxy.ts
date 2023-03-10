import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { _Facade, _MySqlProxy } from "../../../Global";
import { UserNetModule } from "../NetDispatchProxy/NetMessage/UserNetModule";
import {readFileSync} from "fs"
import { LevelConfigCell } from "./ConfigModel/LevelConfigCell";
export class ConfigManagerProxy extends BaseProxy{
    public mLevelConfig:Map<number,LevelConfigCell>= new Map<number,LevelConfigCell>();
    public onRegister(): void {
        this.InitLevelConfig();
    }  

    private InitLevelConfig(){
        let str:Buffer = readFileSync("./Config/PlayerAttrConfig.json");
        let jsonStr:string = str.toString();
        let data = JSON.parse(jsonStr);
        for(let key in data){
            let cell:LevelConfigCell = {
                attack:data[key].attack,
                defrence:data[key].defrence,
                hp:data[key].hp,
                criticalPercent:data[key].criticalPercent,
                criticalAddition:data[key].criticalAddition,
                expCost:data[key].expCost,
                attackSpeed:data[key].attackSpeed,
                expAward:data[key].expAward,
            };
            this.mLevelConfig.set(Number(key),cell);
        }
    }
}