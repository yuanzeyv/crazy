import { SyncActionNode } from "../ActionNode";
import { NodeStatus } from "../BasicTypes";

export class AlwayFailureNode extends SyncActionNode{
    constructor(name:string){
        super(name,{});
        this.SetRegistrationID("AlwaysSuccess");
    }
      
    public Tick(): NodeStatus {
        return NodeStatus.SUCCESS;
    }
}