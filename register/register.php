<?php
  if(version_compare(phpversion(),"5.3.0",">=")==1)
  error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
  else
  	error_reporting(E_ALL & ~E_NOTICE);
 
 $registerSystem=new RegisterSystem();
  echo $registerSystem->showTheRegisterForm();

   class RegisterSystem{
      public $isUserExists=FALSE;

      function RegisterSystem(){
        
         $con=mysqli_connect("localhost","root","");
         //check connection
         //if(mysqli_connect_errno())
          if(!$con)
         {
          echo "connect to mysql error:".mysqli_connect_errno();
         }
         else{
          // echo "connect to mysql successfully";
         }
         //create database
         $sql="CREATE DATABASE IF NOT EXISTS my_db";
         if(mysqli_query($con,$sql))
         {
          //mysql_select_db('my_db');
            $val=mysql_query("select 1 from 'user'");
            if($val !=FALSE)
            {
             //this is exists
              // echo "user table exists";    
            }
            else{
          //i do not find it
              // echo "<br/>user tabel not exists";
              
              // mysql_select_db('my_db');
              $con=mysqli_connect("localhost","root","","my_db");
              //create user table in my_db
              $sql="CREATE TABLE user(username CHAR(30),password CHAR(32))";
              if(mysqli_query($con,$sql))
              {
                echo "<br/>table user created successfully";
              }
              else{
                $GLOBALS['isUserExists']=true;
                // echo "<br/>Error creating tablle:".mysqli_error($con);
                
              }
              mysqli_close($con);
            }
          // echo "<br/>success to create the database my_db";
         }
         else{

          echo "create my_db generate a error".mysqli_error($con);
          
         }
         //mysqli_close($con);
         //$isUserExists=false;
         
      }
      function showTheRegisterForm(){
        
        global $isUserExists;
        // echo var_dump($isUserExists);
         if($isUserExists)
         {
       $username=$_REQUEST['username'];
       $password=MD5($_REQUEST['password']);     
        // $password=$_REQUEST['password'];     
        // echo "<br/>excute the insertUserInfo";
        $con=mysqli_connect("localhost","root","","my_db");
        $sql="SELECT * FROM user WHERE username='$username'";
        $result=mysqli_query($con,$sql);

        if(mysqli_num_rows($result)>=1)
        {
          // echo "<br/>this username aready exists";
          echo "<script type='text/javascript'>alert('this username aready exists')</script>";
        }
        else
        {
          
           $sql="INSERT INTO user (username,password) VALUES ('$username','$password')";
         if(!mysqli_query($con,$sql))
         {
          echo "<br/>Error".mysqli_error($con);
         }
         else
         {
          echo "<br/>one record added";
         }
        
        }
        
          //insertUserInfo();
         mysqli_close($con);
         }
      	require_once("register_form.html");
          
      	// print_r($REQEUST['username']);
       echo $username;   
      }
      function insertUserInfo()
      {
        $sql="INSERT INTO my_db(username,password) VALUE('".$_POST['username']."','".$_POST['password']."')";
         mysqli_query($sql);
      }
  }
?>