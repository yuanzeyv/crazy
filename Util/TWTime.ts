import { _Log4JS } from "../Global";

//直接使用hashMap生成一个简单的时间轮，方便做某些操作，譬如buff生命
export class SoltCell{
    private m_Reference:boolean = true;//当前对象只有这个值为真的时候才会执行回调函数 
    private m_TimerFunc:(data:any )=>void;//这是一个空的回调
    private m_Data:any;//可携带一个参数
    public Stop(){//取消应用
        this.m_Reference = false;
    }  
    public Execute(){
        if(!this.m_Reference)//没暂停，才会继续执行
            return false; 
        try{
            this.m_TimerFunc(this.m_Data);//执行
        }catch(err){
           _Log4JS.error(err);
        }
    }
    constructor(exec:(param1:any)=>void,data:any){
        this.m_Data = data;//初始化参数
        this.m_TimerFunc = exec;
    }
}
class Solt{  
    public m_CellArray:Array<SoltCell> = new Array<SoltCell>(); 
} 
export class TimeWheel{//时间轮
    private m_Precision:number;//单位为毫毛，这里代表每个格子维护10毫秒内的函数
    private m_Solt:Map<number,Solt> = new Map<number,Solt>();//直接给到当前的时间作为下标，必须为整形
    private m_ResidueTick:number = 0;//相当于当前的取余
    private m_NowIndex:number = 1;//相当于当前的取余
    private m_IsTicking:boolean = false;
    private m_IntervalHandle:NodeJS.Timer;
    private m_Name:string;
    constructor(precision:number = 10,name:string = "default name"){//粒度为10毫秒
        this.m_Name = name;
        this.m_Precision = precision;
        this.m_IntervalHandle = setInterval(this.Tick.bind(this),precision ,precision);//创建对应粒度的时间轮
        _Log4JS.info(`TimeWheel "${this.m_Name}" create done`);
    }
    
    
    Tick(dt:number){//运行当前的时间轮  
        this.m_IsTicking = true;
        dt += this.m_ResidueTick;//加上上一帧的余
        while(( dt - this.m_Precision) >= 0){
            dt -=this.m_Precision;
            if(!this.m_Solt.has(this.m_NowIndex)){//没有直接返回
                this.m_NowIndex++;//当前的执行下标（第0帧是执行不到的）
                continue; 
            }
            let solt:Solt |undefined = this.m_Solt.get(this.m_NowIndex);
            if(solt == undefined){//不可能进入但是不加会报错
                this.m_NowIndex++;//当前的执行下标（第0帧是执行不到的）
                continue;
            }
            this.m_Solt.delete(this.m_NowIndex);//删除它
            for(let soltCell of solt.m_CellArray)
                soltCell.Execute();//开始执行
            this.m_NowIndex++;//当前的执行下标（第0帧是执行不到的）
        }
        this.m_ResidueTick = dt;  
        this.m_IsTicking = false;
    }

    Set(time:number,func:(data:any )=>void,param:any = undefined):SoltCell{//传入的是相对于当前时间的，时间戳 
        let insertIndex:number = this.m_NowIndex;
        if(this.m_IsTicking && ((this.m_ResidueTick + time) < this.m_Precision ))
            insertIndex += 1;//插入设置为下一帧
        else
            insertIndex += Math.round((time + this.m_ResidueTick) / this.m_Precision);
        let solt:Solt|undefined = this.m_Solt.get(insertIndex);
        if(solt == undefined){
            solt = new Solt();
            this.m_Solt.set(insertIndex,solt);
        }
        let insertCell:SoltCell = new SoltCell(func,param);
        solt.m_CellArray.push(insertCell);
        return insertCell; 
    }

    IsInvaild(){
        return this.m_IntervalHandle == undefined;
    }

    Stop(){
        if(this.IsInvaild()){
            _Log4JS.warn("尝试停止一个已经停止的时间轮");
            return;
        }
        clearInterval(this.m_IntervalHandle);
    } 
}  