<?php

// set error reporting level
if (version_compare(phpversion(), "5.3.0", ">=") == 1)
  error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
else
  error_reporting(E_ALL & ~E_NOTICE);


// initialization of login system and generation code
$oSimpleLoginSystem = new SimpleLoginSystem();

echo $oSimpleLoginSystem->getLoginBox();
require_once('footer.php');

// class SimpleLoginSystem
class SimpleLoginSystem {

    // variables
    var $aExistedMembers; // Existed members array

    // constructor
    function SimpleLoginSystem() {
        $this->aExistedMembers = array(
            'User1' => 'd8578edf8458ce06fbc5bb76a58c5ca4',  //Sample: MD5('qwerty')
            'User2' => 'd8578edf8458ce06fbc5bb76a58c5ca4'
        );
    }

    function getLoginBox() {
        ob_start();
        require_once('login_form.html');
        $sLoginForm = ob_get_clean();

        $sLogoutForm = '<a href="'.$_SERVER['PHP_SELF'].'?logout=1">logout</a>';

        if ((int)$_REQUEST['logout'] == 1) {
            if (isset($_COOKIE['member_name']) && isset($_COOKIE['member_pass']))
                $this->simple_logout();
        }

        if ($_REQUEST['username'] && $_REQUEST['password']) {
            if ($this->check_login($_REQUEST['username'], MD5($_REQUEST['password']))) {
                $this->simple_login($_REQUEST['username'], $_REQUEST['password']);
                return '<br/>Hello ' . $_REQUEST['username'] . '! ' . $sLogoutForm;
            } else {
                return 'Username or Password is incorrect' . $sLoginForm;
            }
        } else {
            if ($_COOKIE['member_name'] && $_COOKIE['member_pass']) {
                if ($this->check_login($_COOKIE['member_name'], $_COOKIE['member_pass'])) {
                    return 'Hello ' . $_COOKIE['member_name'] . '! ' . $sLogoutForm;
                }
            }
            return $sLoginForm;
        }
    }

    function simple_login($sName, $sPass) {
        $this->simple_logout();

        $sMd5Password = MD5($sPass);

        $iCookieTime = time() + 24*60*60*30;
        setcookie("member_name", $sName, $iCookieTime, '/');
        $_COOKIE['member_name'] = $sName;
        setcookie("member_pass", $sMd5Password, $iCookieTime, '/');
        $_COOKIE['member_pass'] = $sMd5Password;
    }

    function simple_logout() { 
        setcookie('member_name', '', time() - 96 * 3600, '/');
        setcookie('member_pass', '', time() - 96 * 3600, '/');

        unset($_COOKIE['member_name']);
        unset($_COOKIE['member_pass']);
    }

    function check_login($sName, $sPass) {
         $username=$_REQUEST['username'];
         $password=MD5($_REQUEST['password']);   
       // $password=$_REQUEST['password'];   
        //return ($this->aExistedMembers[$sName] == $sPass);
        $con=mysqli_connect("localhost","root","","my_db");
        if(!$con)
         {
          echo "connect to mysql error:".mysqli_connect_errno();
         }
         else{
           // echo "connect to mysql successfully";
         }
        $sql="SELECT * FROM user WHERE username='$username'";
        $result=mysqli_query($con,$sql);
        // echo mysqli_num_rows($result);
       
        if(mysqli_num_rows($result)>=1){
            //  echo $sName;
             // echo $sPass;
            $sql="SELECT password FROM user WHERE username='$username'";
            $result=mysqli_query($con,$sql);
            $row = $result->fetch_assoc();
                    //echo $row["password"];
            //         echo $sName;
            //        }
            
            // echo var_dump($result);
             // echo mysqli_num_rows($result);
             //  echo var_dump($row["password"]);
             //  echo var_dump($password);
            if(($row["password"])==$password){
                $result=true;
            }else{
                  $result=false;  
            }
        }else{
            $result=false;
        }
       
       return $result;       
    }
}

?>