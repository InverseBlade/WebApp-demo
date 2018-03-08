<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/8
 * Time: 14:11
 */
namespace app\GuestBook\controller;
use think\Controller;
use think\Session;
use app\GuestBook\model\User as UserModel;

/**
 * 主页导航控制器
 * Class IndexController
 * @package app\GuestBook\controller
 */
class IndexController extends Controller {
    /**
     * 主页
     *
     */
    public function index() {
        $identity = null;
        if(empty($identity=Session::get('identity'))){
            return $this->redirect("/GuestBook/Login/signIn");
        }else{

            $m = new UserModel();
            $info = $m->where(['identity'=>$identity])->field('nickname')->find();
            if(!$info) exit();

            $this->assign('nickname', $info['nickname']);
            $this->assign('uname', $identity);
            return $this->fetch();
        }

    }

    public function logout() {
        Session::delete('identity');
        return $this->redirect("/GuestBook/");
    }

}