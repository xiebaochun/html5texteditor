// window.onload=function(){
	window.onload=function(){
		var $elie = $("#shap"), degree = 0, timer;
        //rotate();
        function rotate() {
        
        $elie.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});  
        $elie.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});                      
        timer = setTimeout(function() {
            ++degree; rotate();
        },1);
      }

	}
var time;
	function change(){	
		//input.value="xiebaochun";
      time=setInterval(function(){
       	// console.log("trigger focus"); 
       	var replit=$("#input1").val()+"";
       	 // var replit="斯蒂芬";
       	 replit=replit.replace(/[\u4e00-\u9fa5]/g,"");
         console.log(replit);
         $("#input1").val(replit);
        //input.value = input.val().repalce(/[^a-zA-Z]/g,'');
      	},1);   
	}

	function onb(){
		console.log("trigger blur");
		time&&clearInterval(time);
		//check the username is exists user ajax
		var replit=$("#input1").val()+"";
		// var http=false;
		var msg_username=document.getElementById("msg_username");
		// var numLetter=/^[a-zA-Z-0-9]+$/;
		// if(replit==""){
		//	error.innerHTML="输入为空！"
		// 	error.style.visibility="visible";
		// }
		// else
		// {
		// 	// if(replit.match(numLetter)){
		// 		if(window.XMLHttpRequest){
		// 			console.log("this is chrome XMLHttpRequest")
		// 			http=new XMLHttpRequest();
		// 		}else{
		// 			console.log("this is IE XMLHttpRequest")
		// 			http=new ActiveXObject("Microsoft.XMLHTTP");
		// 		}
		// 		if(http){

		// 			http.open("POST","check.php",true);

		// 			http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		// 			console.log(http);
		// 			http.onreadystatechange=function(){

		// 				if(http.readyState==4&&http.status==200){
		// 					error.innerHTML=http.responseText;
		// 					error.style.visibility="visible";
  //                          switch(http.responseText){
  //                          	case 'fail':
  //                          	   error.innerHTML="the username was not provided";
  //                          	break;
  //                          	case 'user_exists':
  //                          	   error.innerHTML="the username already exists";
  //                          	break;
  //                          	case 'user_doesnt_exist':
  //                          	   error.innerHTML="the username was not found on the database,continue";
  //                           break;
  //                          }
		// 				};
		// 				http.send("username="+replit);

		// 			}
		// 			//error.innerHTML="";
		// 			//error.style.visibility="hidden";
		// 		}else{
		// 			error.innerHTML="无效的数字！！！";
		// 		    error.style.visibility="visible";
		// 		}
				
		// 	// }
		// 	// console.log(http);
		// }
		if(replit.length<6){
			msg_username.value="用户名少于6字符！"
			msg_username.style.color="red";
		}else{


		var returnMsg="";
        $.ajax({
        	type:"POST",
        	url:"check.php",
        	data:{username:replit},
        	dataType:""
        }).done(function(msg){
            msg_username.style.visibility="visible";
        	returnMsg=msg;
        	console.log("this is a msg");
        	 if(returnMsg=='user_exists')
            {
        	msg_username.value="此用户名太热门了，请试试其他名字吧！";
        	msg_username.style.color="red";
            }
            if(returnMsg=='user_doesnt_exist')
            {
        	msg_username.value="恭喜！此用户名可以使用。";
        	msg_username.style.color="green";
            }

        }).fail(function(error){
        	msg_username.style.visibility="visible";
            msg_username.innerHTML=error;
            console.log("this id a error");
        });
      }
	};
// };