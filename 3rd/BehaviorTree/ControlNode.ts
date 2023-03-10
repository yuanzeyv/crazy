import { Tree } from "../../Util/RBTree";
import { NodeStatus, NodeType } from "./BasicTypes"
import { TreeNode } from "./TreeNode"

export abstract class ControlNode extends TreeNode{
    protected  mChildrenNodes:Array<TreeNode> = new Array<TreeNode>();
    public  AddChild(node:TreeNode){
        this.mChildrenNodes.push(node);
    }

    public ChildrenCount():number{
        return this.mChildrenNodes.length;
    }

    public HaltChildrens(){
        this.mChildrenNodes.forEach((node:TreeNode,index:number)=>{
            this.HaltChild(index);
        });
    }

    public HaltChild(i:number){
        let child:TreeNode = this.mChildrenNodes[i];
        if(child.Status() == NodeStatus.RUNNING){
            child.Halt();
        }
        child.SetStatus(NodeStatus.IDLE);
    }

    public Halt(): void {
        this.HaltChildrens();
        this.SetStatus(NodeStatus.IDLE);
    }

    public Type(): NodeType {
        return NodeType.CONTROL;
    }
}; 