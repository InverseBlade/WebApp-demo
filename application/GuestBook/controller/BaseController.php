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

class BaseController extends Controller {

    public function __construct(Request $request = null)
    {
        parent::__construct();

        if($request->controller() == )
            if(empty(Session::get('identity'))) echo "<script>window.location.replace('/GuestBook/');</script>";
    }
    
    public function apireturn($err_code=0, $err_msg='', $data=null, $status=200) 
    {
        return json(['err_code'=>$err_code, 'err_msg'=>$err_msg, 'data'=>$data, $status);
    }

}
