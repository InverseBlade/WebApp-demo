<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/19
 * Time: 22:41
 */
namespace app\GuestBook\model;
use think\Model;

class Essay extends Model {

    protected $autoWriteTimestamp = 'timestamp';

    public function user() {
        return $this->belongsTo('User', 'user_id', 'id');
    }

}