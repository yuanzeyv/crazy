import { _Log4JS } from "../../Global";
import { BehaviorTreeFactory } from "./BtFactory";
/*
{
    "include":["a.txt","b.txt","c.txt"],
}
*/
export class JsonParser{
    private static Jsonparser(text:string):Object|undefined{
        let obj:any = undefined;
        try{
            obj = JSON.parse(text);
        }catch(error){
            return undefined;
        }
        return obj;
    }
    public static LoadFromFile(factory:BehaviorTreeFactory,filename:string,add_includes:boolean){

    }
    public static LoadFromText(factory:BehaviorTreeFactory,text:string,add_includes:boolean){
        let obj:any|undefined = JsonParser.Jsonparser(text);
        if(obj == undefined)
            return;
        //首先寻找包含目录
        let includeArray:Array<string> = obj["include"] || new Array<string>;
        for(let path of includeArray){
            JsonParser.LoadFromFile(factory,path,add_includes);
        }
        
    }
    public static RegisteredBehaviorTrees():Array<string>{
        return new Array<string>();
    }
    public static InstantiateTree(filename:string,add_includes:boolean){

    }
}