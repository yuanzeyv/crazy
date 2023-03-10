import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";

export class RepeatNode extends DecoratorNode{
    private mCyclesNum:number = 0;
    private mTryIndex:number= 0;
    constructor(name:string){
        super(name);
        //this.mCyclesNum =ntries;
        this.SetRegistrationID("Repeat");
    }
    public Tick(): NodeStatus {
        this.SetStatus(NodeStatus.RUNNING);
        while(this.mTryIndex < this.mCyclesNum || this.mCyclesNum == -1){
            let childState:NodeStatus = this.Child().ExecuteTick();
            switch(childState){
                case NodeStatus.SUCCESS:
                    this.mTryIndex++;
                    this.HaltChild();
                    return NodeStatus.SUCCESS;
                case NodeStatus.FAILURE:
                    this.mTryIndex = 0;
                    this.HaltChild();
                    return NodeStatus.FAILURE;
                case NodeStatus.RUNNING:    
                    return NodeStatus.RUNNING;
                case NodeStatus.IDLE:
                    throw "A child node must never return IDLE";
            } 
        }
        this.mTryIndex = 0;
        return NodeStatus.SUCCESS;
    }
    public Halt(): void {
        this.mTryIndex = 0;
        super.Halt();
    }
}