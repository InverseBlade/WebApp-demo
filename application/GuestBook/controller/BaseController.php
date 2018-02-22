<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/8
 * Time: 14:12
 */
namespace app\GuestBook\controller;
use think\Controller;
use think\Session;
use think\Request;

class BaseController extends Controller {

    public function __construct(Request $request = null)
    {
        parent::__construct($request);

        if($request->controller() == 'Login'){
            if(!empty(Session::get('identity'))) echo "<script>window.location.replace('/GuestBook/');</script>";
        }else{
            if(empty(Session::get('identity'))){
                header('HTTP/1.1 403 Forbidden');
                echo json_encode(['err_code'=>1, 'err_msg'=>'illegal', 'data'=>'']);
                exit();
            }
        }

        //echo "<script>alert('".$request->controller()."');</script>";
    }
    
    protected function apiReturn($err_code=0, $err_msg='', $data=null, $status=200)
    {
        $temp = [
            'err_code' => $err_code,
            'err_msg'  => $err_msg,
            'data'     => $data
        ];
        return json($temp, $status);
    }

}
