import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode";

/**
 * @brief WhileDoElse must have exactly 2 or 3 children.
 * It is a REACTIVE node of IfThenElseNode.
 *
 * The first child is the "statement" that is executed at each tick
 *
 * If result is SUCCESS, the second child is executed.
 *
 * If result is FAILURE, the third child is executed.
 *
 * If the 2nd or 3d child is RUNNING and the statement changes,
 * the RUNNING child will be stopped before starting the sibling.
 *
 */
export class WhileDoElseNode extends ControlNode{
    public constructor(name:string){
        super(name);
        this.SetRegistrationID("WhileDoElse");
    }

    public Tick(): NodeStatus {
        let children_count:number = this.mChildrenNodes.length;
        if(children_count != 3)
          throw "WhileDoElse must have 3 children";
        this.SetStatus(NodeStatus.RUNNING);
        let condition_status:NodeStatus = this.mChildrenNodes[0].ExecuteTick();
        if (condition_status == NodeStatus.RUNNING)
          return condition_status;
        let status:NodeStatus = NodeStatus.IDLE;
        if (condition_status == NodeStatus.SUCCESS){
            this.HaltChild(2);
            status = this.mChildrenNodes[1].ExecuteTick();
        } else if (condition_status == NodeStatus.FAILURE){
           this.HaltChild(1);
           status = this.mChildrenNodes[2].ExecuteTick();
        }
        if (status == NodeStatus.RUNNING)
          return NodeStatus.RUNNING;
        else{
          this.HaltChildrens();
          return status;
        }
    }
}
 
