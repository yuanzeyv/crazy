import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode"

export class IfThenElseNode extends ControlNode{
    private mChildIndex:number = 0;
    public constructor(name:string){
        super(name);
        this.SetRegistrationID("IfThenElse");
    }

    public Halt(): void {
        this.mChildIndex = 0;
        super.Halt();
    }

    public Tick(): NodeStatus {
        let childCount:number = this.mChildrenNodes.length;
        if(childCount != 2 && childCount != 3)
            throw "IfThenElseNode must have either 2 or 3 children";
        this.SetStatus(NodeStatus.RUNNING);
        if(this.mChildIndex == 0){
            let conditionStatus:NodeStatus = this.mChildrenNodes[0].ExecuteTick();
            if(conditionStatus == NodeStatus.RUNNING)
                return conditionStatus;
            else if (conditionStatus == NodeStatus.SUCCESS)
                this.mChildIndex = 1;
            else if (conditionStatus == NodeStatus.FAILURE){
                if(childCount == 3)
                    this.mChildIndex = 2;
                else 
                    return conditionStatus;
            }
        }
        if(this.mChildIndex > 0){
            let status:NodeStatus = this.mChildrenNodes[this.mChildIndex].ExecuteTick();
            if(status == NodeStatus.RUNNING)
                return NodeStatus.RUNNING;
            else{
                this.HaltChildrens();
                this.mChildIndex = 0;
                return status;
            }
        }
        throw "Something unexpected happened in IfThenElseNode";
    }
};