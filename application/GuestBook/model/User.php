<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/8
 * Time: 14:59
 */
namespace app\GuestBook\model;
use think\Model;

class User extends Model {

    public function essays() {
        return $this->hasMany('Essay', 'user_id', 'id');
    }

}