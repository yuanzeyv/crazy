import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";

export class ForceSuccessNode extends DecoratorNode{
    constructor(name:string){
        super(name);
        this.SetRegistrationID("ForceSuccess");
    }
    public Tick(): NodeStatus {
        this.SetStatus(NodeStatus.RUNNING);
        let childState:NodeStatus = this.Child().ExecuteTick();
        if(childState == NodeStatus.RUNNING)
            return childState;
        else if (childState == NodeStatus.SUCCESS || childState == NodeStatus.FAILURE)
            return NodeStatus.SUCCESS;
        return this.Status();
    }
}