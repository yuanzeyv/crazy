import { RUNNING, FAILURE, SUCCESS } from "behaviortree";
import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode";
import { TreeNode } from "../TreeNode";

/**
 * @brief The ReactiveSequence is similar to a ParallelNode.
 * All the children are ticked from first to last:
 *
 * - If a child returns RUNNING, halt the remaining siblings in the sequence and return RUNNING.
 * - If a child returns SUCCESS, tick the next sibling.
 * - If a child returns FAILURE, stop and return FAILURE.
 *
 * If all the children return SUCCESS, this node returns SUCCESS.
 *
 * IMPORTANT: to work properly, this node should not have more than a single
 *            asynchronous child.
 *
 */
export class ReactiveSequence extends ControlNode{
    public Tick():NodeStatus{
        let success_count:number = 0;
        let running_count:number = 0;
        for (let index:number = 0; index < this.ChildrenCount(); index++){
            let current_child_node:TreeNode = this.mChildrenNodes[index];
            let child_status:NodeStatus = current_child_node.ExecuteTick();
            switch (child_status){
                case NodeStatus.RUNNING:{
                    running_count++;
                for(let i:number=index+1; i < this.ChildrenCount(); i++)
                    this.HaltChild(i);
                return NodeStatus.RUNNING;
                }
                case NodeStatus.FAILURE:{
                    this.HaltChildrens();
                    return NodeStatus.FAILURE;
                }
                case NodeStatus.SUCCESS:{
                    success_count++;
                }break;
                case NodeStatus.IDLE:{
                    throw "A child node must never return IDLE";
                }
            }
        }//end for 
        if( success_count == this.ChildrenCount()){
            this.HaltChildrens();
            return NodeStatus.SUCCESS;
        }
        return NodeStatus.RUNNING;
    }
};