// var express = require('express')
// var path = require('path')
// var serveStatic = require('serve-static')
// const app = express() 

import { BaseMVCRegister } from "./Frame/MVCRegister/BaseMVCRegister";

 
// const rootPath = path.join(__dirname, 'public')
// app.use(serveStatic(rootPath))
// app.listen(8888, ()=> {
//     console.log('http://localhost:8888 started. Location: ' + rootPath)
// }) 
//root节点应该包含 一个 或多个行为树
/*  
{
    ID:"root",  
    BehaviorTree:{      
        
    }
} 
*/

//用于解析行为树的XML
// class XMLParase{

// }

//import { _Facade, _G, _Log4JS, _TimeWheel } from "./Global";
//import { NotificationEnum } from "./NotificationTable";
//import { RedisProxy } from "./Server/Proxy/RedisProxy/RedisProxy";
//import {ProxyConstructor } from  "./Frame/MVCRegister/BaseMVCRegister" 
//import { BaseProxy } from "./Frame/BaseProxy/BaseProxy";
//import { INotification, Mediator,Proxy } from "./Frame/PureMVC"
//_Facade.Send(NotificationEnum.C_StartServer);   