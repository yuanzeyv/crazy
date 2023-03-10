import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";

export class InverterNode extends DecoratorNode{
    constructor(name:string){
        super(name);
        this.SetRegistrationID("Inverter");
    }
    public Tick(): NodeStatus {
        this.SetStatus(NodeStatus.RUNNING);
        //let childState:NodeStatus = this.Child().ExecuteTick();
        //if(childState == NodeStatus.RUNNING)
        //    return childState;
        //switch(childState){
        //    case NodeStatus.FAILURE:
        //        return NodeStatus.SUCCESS;
        //    case NodeStatus.SUCCESS:
        //        return NodeStatus.FAILURE;
        //    default:
        //        throw "A child node must never return IDLE";
        //}
    }
}