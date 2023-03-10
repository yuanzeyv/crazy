import { _TimeWheel } from "../../../Global";
import { SoltCell } from "../../../Util/TWTime";
import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";
import { TreeNode } from "../TreeNode";
export class TimeoutNode extends DecoratorNode{
    private mMsec:number = 0;
    private mTimeoutStarted:boolean = false;
    private mChildHalt:boolean = false;
    private mTimeSolt:SoltCell|undefined;
    constructor(name:string){
        super(name);
        //this.mMsec = milliSeconds;
        this.SetRegistrationID("Timeout");  
    }
    private TimeOutHandle():void{
        this.mChildHalt = true;
        this.mTimeSolt = undefined;
    }
    public Tick(): NodeStatus {
        if(!this.mTimeoutStarted){
            this.mTimeoutStarted = true;
            this.SetStatus(NodeStatus.RUNNING);
            this.mChildHalt = false;
            if(this.mMsec > 0)
                this.mTimeSolt = _TimeWheel.Set(Math.ceil(this.mMsec * 1000),this.TimeOutHandle.bind(this));
        }
        if(this.mChildHalt){//超时的话
            this.mTimeoutStarted = false;
            this.HaltChild();
            return NodeStatus.FAILURE;
        }else {
            let child:TreeNode|undefined = this.Child();
            if(child == undefined)
                throw "child is empty";
            let childStatus:NodeStatus = child.ExecuteTick();
            if(childStatus != NodeStatus.RUNNING){
                this.mTimeoutStarted = false;
                this.mTimeSolt?.Stop();
                this.mTimeSolt = undefined;
            }
            return childStatus;
        }
    }
}