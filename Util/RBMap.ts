enum RBColor {RED, BLACK};
//不能让其做类型检查，不然写不下去了
export class RBNode<K,V>{//红黑树对象
    public Parent:RBNode<K,V> |any ;//父亲节点 
    public Left:RBNode<K,V> | any;//左节点
    public Right:RBNode<K,V> | any;//右节点
    public Key:K | any;//当前的键值 
    public Value:V | any;//当前的值  
    private m_Name:string = "";
    public Color:RBColor = RBColor.RED;//当前节点的颜色
    public InitNodeLink(parent:RBNode<K,V>,leftNode:RBNode<K,V>,rightNode:RBNode<K,V>,color:RBColor = RBColor.RED,name:string = ""){
        this.Parent = parent;
        this.Left = leftNode; 
        this.Right = rightNode;
        this.Color = color;
        this.m_Name = name;
    }  
}    
//0 相同，1大于，-1小于
export type CompareDivisor<K> = (keyA:K,KeyB:K)=>number;//比较函数
export class RBTree<K,V>{
    public RBNIL:RBNode<K,V>;
    private m_Root:RBNode<K,V>;//红黑树的根结点
    private m_Count:number = 0;
    private m_CompareDivisor:CompareDivisor<K>;
    constructor(copareHandle:CompareDivisor<K>){
        this.RBNIL = new RBNode<K,V>(); 
        this.RBNIL.InitNodeLink(this.RBNIL,this.RBNIL,this.RBNIL,RBColor.BLACK,"NIL");
        this.m_Root = this.RBNIL;
        this.m_CompareDivisor = copareHandle;//设置计算因子
    }

    private ParentOf(node:RBNode<K,V>):RBNode<K,V> {
        return node != this.RBNIL ? node.Parent : this.RBNIL;
    }

    private ColorOf( node:RBNode<K,V>):RBColor{
        return node != this.RBNIL ? node.Color : RBColor.BLACK;
    }
    private IsRed( node:RBNode<K,V>):boolean{
        return ((node!=this.RBNIL)&&(node.Color== RBColor.RED)) ? true : false;
    }
    private  IsBlack( node:RBNode<K,V>):boolean{
        return !this.IsRed(node);
    }
    private SetBlack( node:RBNode<K,V>):void {
        if (node!=this.RBNIL)
            node.Color = RBColor.BLACK;
    }
    private SetRed( node:RBNode<K,V>):void {
        if (node!=this.RBNIL)
            node.Color = RBColor.RED;
    }
    private SetParent( node:RBNode<K,V>,  parent:RBNode<K,V>):void {
        if (node!=this.RBNIL)
            node.Parent = parent;
    }
    private  SetColor( node:RBNode<K,V>, color:RBColor):void {
        if (node != this.RBNIL)
            node.Color = color;
    }

    private _PreOrder(tree:RBNode<K,V>,loopHandle:(value:V,key?:K,node?:RBNode<K,V>)=>void):void {
        if(tree != this.RBNIL) {
            loopHandle(tree.Value,tree.Key,tree);
            this._PreOrder(tree.Left,loopHandle);
            this._PreOrder(tree.Right,loopHandle);
        }
    } 
    private _InOrder( tree:RBNode<K,V>,loopHandle:(value:V,key?:K,node?:RBNode<K,V>)=>void):void {
        if(tree != this.RBNIL) {
            this._InOrder(tree.Left,loopHandle);
            loopHandle(tree.Value,tree.Key,tree);
            this._InOrder(tree.Right,loopHandle);
        }
    }  
    private _PostOrder(tree:RBNode<K,V>,loopHandle:(value:V,key?:K,node?:RBNode<K,V>)=>void):void {
        if(tree != this.RBNIL) {
        	this._PostOrder(tree.Left,loopHandle);
            this._PostOrder(tree.Right,loopHandle);
            loopHandle(tree.Value,tree.Key,tree);
        }
    }   

    private  _Search( x:RBNode<K,V>,key:K):RBNode<K,V>  {
        if (x==this.RBNIL)
            return x;
        let cmp:number = this.m_CompareDivisor(key,x.Key);
        if (cmp < 0)
            return this._Search(x.Left, key);
        else if (cmp > 0)
            return this._Search(x.Right, key);
        else
            return x;
    }


    private Successor( x:RBNode<K,V>):RBNode<K,V> {
        if (x.Right != this.RBNIL)
            return this._Minimum(x.Right);
        let y = x.Parent;
        while ((y!=this.RBNIL) && (x==y.Right)) {
            x = y;
            y = y.Parent;
        }
        return y;
    }
     
    private Predecessor(x:RBNode<K,V>):RBNode<K,V> {
        if (x.Left != this.RBNIL)
            return this._Maximum(x.Left);
        let y:RBNode<K,V> = x.Parent;
        while ((y!=this.RBNIL) && (x==y.Left)) {
            x = y;
            y = y.Parent;
        }
        return y;
    } 

    private _IterativeSearch( x:RBNode<K,V>, key:K):RBNode<K,V> {
        while (x!=this.RBNIL) { 
            let cmp:number = this.m_CompareDivisor(key,x.Key);
            if (cmp < 0)
                x = x.Left;
            else if (cmp > 0)
                x = x.Right;
            else
                return x;
        }
        return x;
    }

    private _Minimum( tree:RBNode<K,V>):RBNode<K,V> {
        if (tree == this.RBNIL)
            return this.RBNIL;

        while(tree.Left != this.RBNIL)
            tree = tree.Left;
        return tree;
    }
    private _Maximum( tree:RBNode<K,V>):RBNode<K,V> {
        if (tree == this.RBNIL)
            return this.RBNIL;

        while(tree.Right != this.RBNIL)
            tree = tree.Right;
        return tree;
    }
    private LeftRotate(x:RBNode<K,V>):void {
        let y:RBNode<K,V> = x.Right;
        x.Right = y.Left;
        if (y.Left != this.RBNIL)
            y.Left.Parent = x;
        y.Parent = x.Parent;
        if (x.Parent == this.RBNIL) {
            this.m_Root = y;           
        } else {
            if (x.Parent.Left == x)
                x.Parent.Left = y;    
            else
                x.Parent.Right = y;    
        }
        y.Left = x;
        x.Parent = y;
    }
   
    private RightRotate(y:RBNode<K,V>):void {
        let x:RBNode<K,V> = y.Left;
        y.Left = x.Right;
        if (x.Right != this.RBNIL)
            x.Right.Parent = y;
        x.Parent = y.Parent;
        if (y.Parent == this.RBNIL) {
            this.m_Root = x;         
        } else {
            if (y == y.Parent.Right)
                y.Parent.Right = x;  
            else
                y.Parent.Left = x;   
        }
        x.Right = y;
        y.Parent = x;
    }

    private InsertFixUp(node:RBNode<K,V>):void {
        let parent:RBNode<K,V> = this.RBNIL;
        let gparent:RBNode<K,V> = this.RBNIL;
        while (((parent = this.ParentOf(node))!=this.RBNIL) && this.IsRed(parent)) {
            gparent = this.ParentOf(parent);
            if (parent == gparent.Left) {
                let uncle:RBNode<K,V> = gparent.Right;
                if ((uncle!=this.RBNIL) && this.IsRed(uncle)) {
                    this.SetBlack(uncle);
                    this.SetBlack(parent);
                    this.SetRed(gparent);
                    node = gparent;
                    continue;
                }
                if (parent.Right == node) {
                    let tmp:RBNode<K,V>;
                    this.LeftRotate(parent);
                    tmp = parent;
                    parent = node;
                    node = tmp;
                }
                this.SetBlack(parent);
                this.SetRed(gparent);
                this.RightRotate(gparent);
            } else {    
                let uncle:RBNode<K,V> = gparent.Left;
                if ((uncle!=this.RBNIL) && this.IsRed(uncle)) {
                    this.SetBlack(uncle);
                    this.SetBlack(parent);
                    this.SetRed(gparent);
                    node = gparent;
                    continue;
                }
                if (parent.Left == node) {
                    let tmp:RBNode<K,V> = this.RBNIL;
                    this.RightRotate(parent);
                    tmp = parent;
                    parent = node;
                    node = tmp;
                }
                this.SetBlack(parent);
                this.SetRed(gparent);
                this.LeftRotate(gparent);
            }
        }
        this.SetBlack(this.m_Root);
    }

    private _Insert( node:RBNode<K,V>):void {
        let cmp:number;
        let y:RBNode<K,V> = this.RBNIL;
        let x:RBNode<K,V> = this.m_Root;
        while (x != this.RBNIL) {
            y = x;
            cmp = this.m_CompareDivisor(node.Key,x.Key);
            if (cmp < 0)
                x = x.Left;
            else
                x = x.Right;
        } 
        node.Parent = y;
        if (y!=this.RBNIL) {
            cmp = this.m_CompareDivisor(node.Key,y.Key);
            if (cmp < 0)
                y.Left = node;
            else
                y.Right = node;
        } else {
            this.m_Root = node;
        }
        node.Color = RBColor.RED;
        this.InsertFixUp(node);
    }

    private Insert(key:K,value:V):RBNode<K,V> {
        let node:RBNode<K,V>=new RBNode<K,V>();
        node.InitNodeLink(this.RBNIL,this.RBNIL,this.RBNIL,RBColor.BLACK);
        node.Key = key; 
        node.Value = value;
        this._Insert(node);
        this.m_Count++;
        return node;
    }

    private RemoveFixUp(node:RBNode<K,V>,  parent:RBNode<K,V>):void {
        let other:RBNode<K,V> = this.RBNIL;
        while ((node==this.RBNIL || this.IsBlack(node)) && (node != this.m_Root)) {
            if (parent.Left == node) {
                other = parent.Right;
                if (this.IsRed(other)) {
                    this.SetBlack(other);
                    this.SetRed(parent);
                    this.LeftRotate(parent);
                    other = parent.Right;
                }
                if ((other.Left==this.RBNIL || this.IsBlack(other.Left)) &&
                    (other.Right==this.RBNIL || this.IsBlack(other.Right))) {
                    this.SetRed(other);
                    node = parent;
                    parent = this.ParentOf(node);
                } else { 
                    if (other.Right==this.RBNIL || this.IsBlack(other.Right)) {
                        this.SetBlack(other.Left);
                        this.SetRed(other);
                        this.RightRotate(other);
                        other = parent.Right;
                    }
                    this.SetColor(other, this.ColorOf(parent));
                    this.SetBlack(parent);
                    this.SetBlack(other.Right);
                    this.LeftRotate(parent);
                    node = this.m_Root;
                    break;
                }
            } else {

                other = parent.Left;
                if (this.IsRed(other)) {
                    this.SetBlack(other);
                    this.SetRed(parent);
                    this.RightRotate(parent);
                    other = parent.Left;
                }
                if ((other.Left==this.RBNIL || this.IsBlack(other.Left)) &&
                    (other.Right==this.RBNIL || this.IsBlack(other.Right))) {
                    this.SetRed(other);
                    node = parent;
                    parent = this.ParentOf(node);
                } else {

                    if (other.Left==this.RBNIL || this.IsBlack(other.Left)) {
                        this.SetBlack(other.Right);
                        this.SetRed(other);
                        this.LeftRotate(other);
                        other = parent.Left;
                    }
                    this.SetColor(other, this.ColorOf(parent));
                    this.SetBlack(parent);
                    this.SetBlack(other.Left);
                    this.RightRotate(parent);
                    node = this.m_Root;
                    break;
                }
            }
        }

        if (node!=this.RBNIL)
            this.SetBlack(node);
    }

    private _Remove(node:RBNode<K,V>):void {
        let child:RBNode<K,V> = this.RBNIL;
        let parent:RBNode<K,V> = this.RBNIL;
        let color:RBColor;
        if ( (node.Left!=this.RBNIL) && (node.Right!=this.RBNIL) ) {
            let replace:RBNode<K,V> = node;
            replace = replace.Right;
            while (replace.Left != this.RBNIL)
                replace = replace.Left;
            if (this.ParentOf(node)!=this.RBNIL) {
                if (this.ParentOf(node).Left == node)
                    this.ParentOf(node).Left = replace;
                else
                    this.ParentOf(node).Right = replace;
            } else
                this.m_Root = replace;
            child = replace.Right;
            parent = this.ParentOf(replace); 
            color = this.ColorOf(replace);
            if (parent == node) {
                parent = replace;
            } else {
                if (child!=this.RBNIL)
                    this.SetParent(child, parent);
                parent.Left = child;

                replace.Right = node.Right;
                this.SetParent(node.Right, replace);
            }

            replace.Parent = node.Parent;
            replace.Color = node.Color;
            replace.Left = node.Left;
            node.Left.Parent = replace;
            if (color == RBColor.BLACK)
                this.RemoveFixUp(child, parent);
            node = this.RBNIL;
            return ;
        }

        if (node.Left !=this.RBNIL) {
            child = node.Left;
        } else {
            child = node.Right;
        } 
        parent = node.Parent; 
        color = node.Color;

        if (child!=this.RBNIL)
            child.Parent = parent;
 
        if (parent!=this.RBNIL) {
            if (parent.Left == node)
                parent.Left = child;
            else
                parent.Right = child;
        } else {
            this.m_Root = child;
        } 
        if (color == RBColor.BLACK)
            this.RemoveFixUp(child, parent);
        node = this.RBNIL;
    }

    private Destroy(tree:RBNode<K,V>):void {
        if (tree==this.RBNIL)
            return ;
        if (tree.Left != this.RBNIL)
            this.Destroy(tree.Left);
        if (tree.Right != this.RBNIL)
            this.Destroy(tree.Right);
        tree = this.RBNIL;
    }
    //通过key，如果有相同的返回相同的，否则返回前方的一个单位
    private _GetNearby(findNode:RBNode<K,V>,nerabyKey:K):RBNode<K,V>{
        if(findNode == this.RBNIL)
            return findNode;//代表没有比它更小的单位了
        let result:number = this.m_CompareDivisor(nerabyKey,findNode.Key);
        if(result == 0)
            return findNode; 
        if( findNode.Left == this.RBNIL && findNode.Right ==  this.RBNIL)
            return findNode;
        if( result < 0 && findNode.Left == this.RBNIL )
            return findNode;
        if( result > 0 && findNode.Right ==  this.RBNIL )
            return findNode; 
        if(result < 0)
            return this._GetNearby(findNode.Left,nerabyKey);
        else 
            return this._GetNearby(findNode.Right,nerabyKey); 
    } 

    public Clear():void {
        this.Destroy(this.m_Root);
        this.m_Root = this.RBNIL;
        this.m_Count = 0;
    }  
 
    public Has(key:K):boolean{
        return this.Get(key) != undefined;
    }

    public Get(key:K):RBNode<K,V>|undefined {
        let node:RBNode<K,V>  = this._Search(this.m_Root,key);
        return node == this.RBNIL ? undefined:node;
    }
    public  IterGet(key:K):RBNode<K,V> | undefined {
        let node:RBNode<K,V>  = this._IterativeSearch(this.m_Root,key);
        return node == this.RBNIL ? undefined:node;
    } 

    public GetNext(node:RBNode<K,V>):RBNode<K,V>| undefined{//找到当前节点的后继
        let ret:RBNode<K,V> = this.Successor(node);
        return ret == this.RBNIL ? undefined : ret;
    } 
    public GetFront(node:RBNode<K,V>):RBNode<K,V> | undefined{//找到当前节点的前驱
        let ret:RBNode<K,V> = this.Predecessor(node);
        return ret == this.RBNIL ? undefined : ret;
    } 
    public GetMin():RBNode<K,V> | undefined{//获取到最小值
        let node:RBNode<K,V>  = this._Minimum(this.m_Root);
        return node == this.RBNIL ? undefined :node ;
    }
    public GetMax():RBNode<K,V> | undefined{//获取到最小值
        let node:RBNode<K,V>  = this._Maximum(this.m_Root);
        return node == this.RBNIL ? undefined :node ;
    }
    public Set(key:K,value:V):void{
        let node:RBNode<K,V> = this._Search(this.m_Root,key);
        if(node != this.RBNIL){
            node.Value = value;
            return;
        }
        this.Insert(key,value);//否则插入
    } 
    
    public Del(key:K):void {
        let node:RBNode<K,V> = this.RBNIL; 
        if ((node = this._Search(this.m_Root,key)) != this.RBNIL){
            this._Remove(node);
            this.m_Count--;
        }
    } 
 
    //获取到最后一个比findKye小的单位
    GetNearbyFront(findKey:K):RBNode<K,V>|undefined{
        let nearbyNode:RBNode<K,V> = this._GetNearby(this.m_Root,findKey) ;
        if(nearbyNode == this.RBNIL)
            return undefined;
        let result:number = this.m_CompareDivisor(findKey,nearbyNode.Key);
        if( result < 0 ){}
            return this.GetFront(nearbyNode);
        return nearbyNode;
    }  
    //获取到第一个比findKye大的单位
    GetNearbyNext(findKey:K):RBNode<K,V>|undefined{
        let nearbyNode:RBNode<K,V> = this._GetNearby(this.m_Root,findKey) ;
        if(nearbyNode == this.RBNIL)
            return undefined;
        let result:number = this.m_CompareDivisor(findKey,nearbyNode.Key);
        if( result > 0 )
            return this.GetNext(nearbyNode);
        return nearbyNode;
    }    

    public forEach(loopHandle:(value:V,key?:K,node?:RBNode<K,V>)=>void){//直接以前序遍历，递归，遍历完整个红黑树
        this._InOrder(this.m_Root,loopHandle);
    }

    get Count(){
        return this.m_Count;
    }
}