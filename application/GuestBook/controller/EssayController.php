<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/19
 * Time: 22:39
 */
namespace app\GuestBook\controller;
use app\GuestBook\model\Essay as EssayModel;
use app\GuestBook\model\User as UserModel;
use think\Request;
use think\Session;

class EssayController extends BaseController {

    public function __construct(Request $request = null)
    {
        parent::__construct($request);
        if(12 == strlen($request->action())) $this->detail($request->action());
    }

    /**
     * 获取数据
     * @param Request $request
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function api(Request $request) {
        $post = $request->param();

        $condition = [];
        $order = '';
        $page = $post['page'];

        $condition['status'] = 1;
        $order = 'update_time desc';

        $data = EssayModel
            ::where($condition)
            ->alias('e')
            ->field('e.*')     //为主页显示所需字段，可进一步简化
            ->join('__USER__ u', 'e.user_id = u.id')
            ->field('u.nickname, u.identity as uname')
            ->order($order)
            ->page($page, 10)
            ->select();
        return $this->apiReturn(0, 'success', $data);
    }

    /**
     * 新增
     * @param Request $request
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function add(Request $request) {
        $post = $request->param();

        $post['status'] = 1;
        $post['hash'] = shortHash(md5('token'.$post['topic'].mt_rand())).shortHash(md5(time().session('identity')));

        $user = UserModel
            ::where(['identity'=>Session::get('identity')])
            ->field('id')
            ->find();

        if($user->allowField(true)->essays()->save($post)){
            return $this->apiReturn(0, 'success');
        }
        return $this->apiReturn(1, 'failed');
    }

    /**
     * 修改内容
     * @param Request $request
     * @return \think\response\Json
     */
    public function modify(Request $request) {
        $post = $request->param();
        $hash = $post['hash'];

        $essay = EssayModel::where(['hash'=>$hash])->field('user_id')->find();
        $identity = $essay->user->identity;

        if(empty($identity) || $identity != Session::get('identity')){
            return $this->apiReturn(1, 'illegal', '', 403);
        }

        if($essay->allowField('content')->save($post, ['hash'=>$hash]) !== false){
            return $this->apiReturn(0, 'success');
        }

        return $this->apiReturn(1, 'failed');
    }

    /**
     * 删除
     * @param Request $request
     * @return \think\response\Json
     */
    public function delete(Request $request) {
        $hash = $request->param('hash');

        $essay = EssayModel::where(['hash'=>$hash])->field('user_id')->find();
        $identity = $essay->user->identity;

        if(empty($identity) || $identity != Session::get('identity')){
            return $this->apiReturn(1, 'illegal', '', 403);
        }

        if($model->save(['status'=>2], ['hash'=>$hash]) !== false){
            return $this->apiReturn(0, 'success');
        }

        return $this->apiReturn(1, 'failed');
    }

    private function detail($hash) {
        echo json_encode(['err_code'=>0, 'err_msg'=>'detail is ok!']);
        exit();
    }

}