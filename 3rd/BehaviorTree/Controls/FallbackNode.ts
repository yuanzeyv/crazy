import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode"

export class FallbackNode extends ControlNode{
    private mCurrentChildIndex:number = 0;
    public constructor(name:string){
        super(name);
        this.SetRegistrationID("Fallback");
    }
    public Tick(): NodeStatus {
        let mChildrenCount:number = this.mChildrenNodes.length;
        this.SetStatus(NodeStatus.RUNNING);
        for(let node of this.mChildrenNodes){
            let childStatus:NodeStatus = node.ExecuteTick();
            switch(childStatus){
                case NodeStatus.RUNNING:
                    return childStatus;
                case NodeStatus.SUCCESS:
                    this.HaltChildrens();
                    this.mCurrentChildIndex = 0;
                    return childStatus;
                case NodeStatus.FAILURE:
                    this.mCurrentChildIndex++;
                    break;
                case NodeStatus.IDLE:
                    throw "A child node must never return IDLE";
            }
        }
        if( this.mCurrentChildIndex == mChildrenCount){
            this.HaltChildrens();

        }
    }
    public Halt(): void {
        this.mCurrentChildIndex = 0;
        super.Halt();
    }
};