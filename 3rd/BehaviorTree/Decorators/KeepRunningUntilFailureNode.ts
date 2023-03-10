import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";

export class KeepRunningUntilFailureNode extends DecoratorNode{
    constructor(name:string){
        super(name);
        this.SetRegistrationID("KeepRunningUntilFailure");
    }
    public Tick(): NodeStatus {
        this.SetStatus(NodeStatus.RUNNING);
        let childState:NodeStatus = this.Child().ExecuteTick();
        if(childState == NodeStatus.SUCCESS || childState == NodeStatus.RUNNING )
            return NodeStatus.RUNNING;
        else if ( childState == NodeStatus.FAILURE)
            return NodeStatus.SUCCESS;
        return this.Status();
    }
}