var express = require('express'); 
fs = require('fs'), 
formidable = require('formidable'),   
app = express(),
bodyParser = require('body-parser'); 

var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , port = 8022;

   
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  ws.on('message', function incoming(message) {
  	console.log("你给我的是："+message)
    ws.send("你刚刚给我的是"+message)
  });
  ws.send('服务端发送:链接成功');
});
wss.on('close', function close(ws) {
	console.log(ws);
  	ws.send("服务端发送:链接关闭")
});




app.get("/getMessage",function(req,res){
    var list=[
        {
            img:"data:image/png;base64,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",
            name:"王浩",
            message:"哈哈",
            time:"22:00",
            count:1,
            id:"1"
        },
        {
            img:"/image/ben.png",
            name:"成凤杰",
            message:"干什么呢",
            time:"17:30",
            count:0,
            id:"2"
        },
        {
            img:"/image/max.png",
            name:"梁雨",
            message:"O(∩_∩)O",
            time:"16:00",
            count:0,
            id:"3"
        },
        {
            img:"/image/mike.png",
            name:"廖芳樱",
            message:"那先不管了",
            time:"14:00",
            count:14,
            id:"4"
        },
        {
            img:"/image/perry.png",
            name:"邓福滨",
            message:"可以",
            time:"10:00",
            count:7,
            id:"5"
        }
    ]
    for(var i = 0;i<list.length;i++){
        // console.log(list[i][count])
        list[i].count = parseInt(Math.random()*10)
    }
    res.send(list);
})

app.get("/getUser.php",function(req,res){
	var list=[
        {
            img:"/image/adam.jpg",
            name:"王浩",
            message:"哈哈",
            time:"22:00",
            count:1,
            id:"1"
        },
        {
            img:"/image/ben.png",
            name:"成凤杰",
            message:"干什么呢",
            time:"17:30",
            count:0,
            id:"2"
        },
        {
            img:"/image/max.png",
            name:"梁雨",
            message:"O(∩_∩)O",
            time:"16:00",
            count:0,
            id:"3"
        },
        {
            img:"/image/mike.png",
            name:"廖芳樱",
            message:"那先不管了",
            time:"14:00",
            count:14,
            id:"4"
        },
        {
            img:"/image/perry.png",
            name:"邓福滨",
            message:"可以",
            time:"10:00",
            count:7,
            id:"5"
        }
    ]
    for(var i = 0;i<list.length;i++){
    	// console.log(list[i][count])
    	list[i].count = parseInt(Math.random()*10)
    }
	res.send(list);
})
app.post("/getMsg.php",function(req,res){
	var id = req.body.id
	// console.log(id)
	var data_1 = [
          {
            img:"/image/adam.jpg",
            text:"你好",
            me:false
          },
          {
            img:"/image/adam.jpg",
            text:"哈哈",
            me:true
          },
          {
            img:"/image/adam.jpg",
            text:"你好",
            me:false
          },
          {
            img:"/image/adam.jpg",
            text:"哈哈",
            me:true
          },
          {
            img:"/image/adam.jpg",
            text:"你好",
            me:false
          },
          {
            img:"/image/adam.jpg",
            text:"哈哈",
            me:true
          },
          {
            img:"/image/adam.jpg",
            text:"你好",
            me:false
          },
          {
            img:"/image/adam.jpg",
            text:"哈哈",
            me:true
          },
          {
            img:"/image/adam.jpg",
            text:"你好",
            me:false
          },
          {
            img:"/image/adam.jpg",
            text:"哈哈",
            me:true
          },
          {
            img:"/image/adam.jpg",
            text:"你好",
            me:false
          },
          {
            img:"/image/adam.jpg",
            text:"哈哈",
            me:true
          }
        ]
    var data_2 = [
          {
            img:"/image/ben.png",
            text:"干什么呢",
            me:false
          },
          {
            img:"/image/ben.png",
            text:"干什么呢",
            me:false
          },
          {
            img:"/image/ben.png",
            text:"干什么呢",
            me:false
          }
        ];
    var data_3 = [
          {
            img:"/image/max.png",
            text:"hi",
            me:false
          },
          {
            img:"/image/ben.png",
            text:"hi",
            me:true
          },
          {
            img:"/image/max.png",
            text:"O(∩_∩)O",
            me:false
          }
        ];
    var data_4 = [
          {
            img:"/image/mike.png",
            text:"搞好了吗",
            me:false
          },
          {
            img:"/image/mike.png",
            text:"没有",
            me:true
          },
          {
            img:"/image/mike.png",
            text:"那先不管了",
            me:false
          }
        ];
    var data_5 = [
          {
            img:"/image/perry.png",
            text:"请我吃饭",
            me:true
          },
          {
            img:"/image/perry.png",
            text:"可以",
            me:false
          }
        ]
	switch(id){
		case "1":res.send(data_1);break;
		case "2":res.send(data_2);break;
		case "3":res.send(data_3);break;
		case "4":res.send(data_4);break;
		case "5":res.send(data_5);break;
	}
})
app.get("/getMoments.php",function(req,res){
	var data = [
		{
			avaImg:"/image/adam.jpg",
			name:"王浩",
			text:"这是示例文字，这是示例文字，这是示例文字，这是示例文字，这是示例文字，这是示例文字",
			img:[
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				}
			],
			address:"成都",
			time:"40分钟前"
		},
		{
			avaImg:"/image/mike.png",
            name:"廖芳樱",
            text:"这是示例文字，这是示例文字，这是示例文字，这是示例文字，这是示例文字，这是示例文字",
            time:"昨天"
		},
		{
			avaImg:"/image/perry.png",
            name:"邓福滨",
			img:[
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				}
			],
			address:"火星",
			time:"昨天"
		},
		{
			avaImg:"/image/ben.png",
			name:"成凤杰",
			text:"这是示例文字，这是示例文字，这是示例文字，这是示例文字，这是示例文字，这是示例文字",
			img:[
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				},
				{
					imgUrl:"/image/me.jpg"
				}
			],
			address:"朝鲜",
			time:"昨天"
		}
	]
	res.send(data);
})
app.post("/upload.php",function(req,res){
	var form = new formidable();
	form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'upload/'	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files){
    	var msg="上传成功，请到服务器upload文件夹查看";
    	if (err) {
    	  msg = err;
	      return;		
	    }  
	    var extName = '';  //后缀名
	    switch (files.test.type) {
	      case 'application/octet-stream':
	        extName = 'png';
	        break;	 
	    }
	    if(extName == ''){
	    	res.send("不支持此类文件上传");
	    }
    	// console.log(files.test.type) 

	    var avatarName = Math.random() + '.' + extName;
	    var newPath = form.uploadDir + avatarName;

	    // console.log(newPath);
	    fs.rename(files.test.path, newPath);  //重命名

	    res.send(msg);
    })
	
})
app.get("/download",function(req,res){
	res.download("download/test.png");
})
app.get("/wsConnect.php",function(req,res){

})
 
app.set("port",80);
app.listen(app.get("port"),function(){
    console.log("服务器已启动...");
})

server.on('request', app);
server.listen(port, function () { console.log('websocket Listening on ' + server.address().port) });