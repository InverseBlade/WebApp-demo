<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/8
 * Time: 20:21
 */
namespace app\GuestBook\Controller;
use app\GuestBook\model\User as UserModel;
use think\Request;


class UserController extends BaseController {

    public function written(Request $request) {
        $page = $request->param('page');

        $user = UserModel::where(['identity'=>session('identity')])->field('id')->find();
        $essays = $user->essays()->page($page, 10)->select();

        return $this->apiReturn(0, '', $essays);
    }

}