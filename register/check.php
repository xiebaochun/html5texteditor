<?php
$return='fail';
class Checking{
     function __construct($con,$sql)
     {
     	$this->con=$con;
     	$this->sql=$sql;
     	self::func();
     }	

     public function func(){
     	$result="ok";
     	if(mysqli_connect_errno()==0){
     		$result=mysqli_query($this->con,$this->sql);
     	    $result=mysqli_num_rows($result)>0? 'user_exists':'user_doesnt_exist';
     		} 	
        echo $result;
     	return $result;
     }
}
$con=mysqli_connect("localhost","root","","my_db");
     if(!$con)
         {
          echo "connect to mysql error:".mysqli_connect_errno();
         }
         else{
          // echo "connect to mysql successfully";
         } 

  if($_POST['username']){
	$desired=mysqli_real_escape_string($con,$_POST['username']);
	$return=new Checking($con,"SELECT username FROM user WHERE username='$desired'");
	
}

?>