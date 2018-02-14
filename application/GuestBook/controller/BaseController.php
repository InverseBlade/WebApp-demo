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

    public function __construct()
    {
        parent::__construct();

        if(empty(Session::get('identity'))) echo "<script>window.location.replace('/GuestBook/');</script>";
    }

}