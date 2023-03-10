import { SoltCell } from "../../../Util/TWTime";
import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";

export class DelayNode extends DecoratorNode{
    private mDelayStarted:boolean = false;
    private mDelayComplete:boolean = false;
    private mMsec:number = 0;
    private mTimeCell:SoltCell|undefined;
    public constructor(name:string,){
        super(name);
        //this.mMsec = msec;
    }

    public Halt(): void {
        this.mDelayStarted = false;
        this.mTimeCell?.Stop();
        this.mTimeCell = undefined;
        super.Halt();
    }
    private TickFuncHandle(){
        this.mDelayComplete = true;
    } 
    public Tick(): NodeStatus {
        if(this.mDelayStarted == false){
            this.mDelayComplete = false;
            this.mDelayStarted = true;
            this.SetStatus(NodeStatus.RUNNING);
        }
        if(this.mDelayComplete){
            this.mDelayStarted = false;
            let childStatus = this.Child().ExecuteTick();
            return childStatus;
        }
    }
}