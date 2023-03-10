// import { _decorator, Component, Node, Prefab, instantiate, Vec3, tween, EventTouch, Button, RichText, Label} from 'cc';  
// import Global from '../../../../config/Global';
// import { NoticeTable } from '../../../../config/NoticeTable';
// import { ProxyTable } from '../../../../config/ProxyTable';
// import { uiUtil } from '../../../../uicommon/uiUtil';
// import BuffManagerProxy, { BuffDescItem } from '../../../proxy/remote/BuffProxy';
// import BaseUINode from '../../BaseUINode';
// import { CountDownComponent } from './CountDownComponent';
// const { ccclass, property } = _decorator; 
// @ccclass('BuffInfoPrefab')
// export class BuffInfoPrefab extends Component {
//     @property({type:Node})
//     public m_IconImage:Node;
//     @property({type:Label})
//     public m_NameText:Label;
//     @property({type:RichText})
//     public m_DescText:RichText;
//     @property({type:Label})
//     public m_CountDownText:Label;

//     private m_CountDownComponent:CountDownComponent;
//     private m_BuffDescInfo:BuffDescItem;
//     public SetBuffItemDesc(buffDescItem:BuffDescItem){
//         this.m_BuffDescInfo = buffDescItem;
//     }
//     public onLoad(){
//         this.InitNode();
//         this.InitData();
//         this.InitLayer(); 
//     }
//     InitData() {
//         this.m_CountDownComponent = this.m_CountDownText.node.addComponent(CountDownComponent);
//         this.m_CountDownComponent.SetFormat({ //设置时间格式
//             Hour:"%H时%I分%S秒",
//             Day:"%D天%H时%I分%S秒",
//             Minute:"%I分%S秒",
//             Second:"%S秒", 
//         });
//         this.m_CountDownComponent.SetRelativeTime(this.m_BuffDescInfo.m_EndTime + 99999999);//设置倒计时时间
//         this.m_CountDownComponent.CountDownLabel = this.m_CountDownText;//设置Label标签
//     }
//     InitLayer() {
//         uiUtil.loadTexture(this.m_IconImage,this.m_BuffDescInfo.m_ConfigCell.GetIconPath());
//         this.m_NameText.string = this.m_BuffDescInfo.m_ConfigCell.name;
//         this.m_DescText.string = this.m_BuffDescInfo.m_ConfigCell.txt;
//     }
//     InitNode() {
//         this.m_IconImage = this.node.getChildByPath("BackGround/SkillIconSprite");
//         this.m_NameText = this.node.getChildByPath("BuffName").getComponent(Label);
//         this.m_DescText = this.node.getChildByPath("BuffDesc").getComponent(RichText);
//         this.m_CountDownText = this.node.getChildByPath("BuffEndTime").getComponent(Label);
//     }
//     Update() {
//         if (this.m_CountDownComponent != undefined)
//             this.m_CountDownComponent.SetRelativeTime(this.m_BuffDescInfo.m_EndTime);//重新设置时间
//     }   
// } 
