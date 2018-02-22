<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/8
 * Time: 20:31
 */
namespace app\GuestBook\controller;
use app\GuestBook\model\User as UserModel;
use think\Exception;
use think\Request;
use think\Session;
use org\utils\Smtp;
use think\Validate;

/**
 * 用户登录管理控制器
 * json:
 * {
 *    "err_code" : code,
 *    "err_msg " : msg
 *    "data"     : data
 * }
 * Class LoginController
 * @package app\GuestBook\controller
 */
class LoginController extends BaseController {

    public function __construct(Request $request = null)
    {
        parent::__construct($request);

        if(!(strtolower($request->action()) == "signin")){
            if(!$request->isAjax()) exit();
        }
    }

    /**
     * 登录接口
     * @param Request $request
     * @return json
     */
    public function login(Request $request) {
        $post = $request->post();
        $condition['identity'] = $post['uname'];
        $condition['passkey']  = md5(md5($post['password']));
        try{
            $info = UserModel::where($condition)->field('identity')->find();
            if($info){
                Session::set('identity',$info->identity);

                return $this->apiReturn(0, 'success');
            }else{
                Session::clear();

                return $this->apiReturn(1, 'wrong info');
            }

        }catch (Exception $e){
            return $this->apiReturn(1, $e->getMessage());
        }
    }

    /**
     * 检查用户名是否存在接口
     * @param Request $request
     * @return json
     * @throws \think\exception\DbException
     */
    public function checkId(Request $request) {
        $post = $request->post();

        if($info=UserModel::where(['identity'=>$post['uname']])->field('email')->find()){

            $email = $info->email;
            $len = strpos($email, '@') + 1;
            $st = ceil($len / 11 * 3);
            $len = floor($len / 11 * 5);
            for($i = 0; $i < $len; $i++) $email[(int)($st+$i)] = "*";

            return $this->apiReturn(1,'existed', $email);
        }else{

            return $this->apiReturn(0, 'none');
        }
    }

    /**
     * 修改密码
     * @param Request $request
     * @return json
     */
    public function modify(Request $request) {
        $post  = $request->post();

        if(!empty($post['verify']) && !empty(Session::get('verification'))
            && $post['uname'].$post['verify'] == Session::get('verification')){

            $data['passkey'] = md5(md5($post['password']));
            $condition['identity'] = $post['uname'];

            if(UserModel::where($condition)->update($data) !== false){

                Session::delete('verification');
                Session::set('identity', $post['uname']);

                return $this->apiReturn(0, 'success');
            }else{

                return $this->apiReturn(1, '未知错误');
            }
        }
        return $this->apiReturn(1, '验证码错误');
    }

    /**
     * 添加用户
     * @param Request $request
     * @return json
     */
    public function add(Request $request) {
        $post = $request->post();

        if(UserModel::where(['identity'=>$post['uname']])->field('id')->find()){

            return $this->apiReturn(1, 'existed');
        }else{
            //过滤email
            $email = filter_var($post['email'], FILTER_SANITIZE_EMAIL);
            if(!Validate::is($email, 'email')) {

                return $this->apiReturn(1, 'wrong email');
            }else{

                empty($post['birth'])? ($post['birth'] = null) : 1;
                $post['identity'] = $post['uname'];
                $post['passkey']  = md5(md5($post['password']));

                $user = new UserModel($post);
                if($user->allowField(true)->save()){

                    Session::set("identity", $post['identity']);
                    return $this->apiReturn(0, 'success');
                }else{

                    return $this->apiReturn(1, 'unknown reason');
                }
            }
        }
    }

    /**
     * 检查昵称合法性
     * @param Request $request
     * @return \think\response\Json
     */
    public function checkNickname(Request $request) {
        $post = $request->post();

        if(UserModel::where(['nickname'=>$post['nickname']])->field('id')->find()){

            return $this->apiReturn(1, 'existed');
        }else{

            return $this->apiReturn(0, 'none');
        }
    }

    /**
     * 发送邮件接口
     * @param Request $request
     * @return \think\response\Json
     */
    public function send(Request $request) {
        $post = $request->post();
        $info = UserModel::where(['identity'=>$post['uname']])->field('email')->find();
        if(!$info){

            return $this->apiReturn(1, 'username not exist');
        }else{
            $email = $info->email;

            $salt = md5('abcdefghijklmnopqrstuvwxyz9876543210'.time().'Token'.mt_rand());
            $salt = substr($salt, 16, 6);
            for($i=0; $i<strlen($salt); $i++)
                if(!is_numeric($salt[$i])){
                    $salt[$i] = mt_rand(0, 1)? strtoupper($salt[$i]) : $salt[$i];
                }
            //smtp send email
            $smtpserver = "smtp.126.com";//SMTP服务器
            $smtpserverport =25;//SMTP服务器端口
            $smtpusermail = "thicksky@126.com";//SMTP服务器的用户邮箱
            $smtpemailto = $email;//发送给谁
            $smtpuser = "thicksky@126.com";//SMTP服务器的用户帐号，注：部分邮箱只需@前面的用户名
            $smtppass = "b286332e7d6";//SMTP服务器的用户密码
            $mailtitle = '留言簿密码修改';//邮件主题
            $mailcontent = '【留言簿】您的验证码为：'.$salt;//邮件内容
            $mailtype = "HTML";//邮件格式（HTML/TXT）,TXT为文本邮件
            //************************ 配置信息 ****************************
            $smtp = new Smtp($smtpserver,$smtpserverport,true,$smtpuser,$smtppass);//这里面的一个true是表示使用身份验证,否则不使用身份验证.
            $smtp->debug = false;//是否显示发送的调试信息
            $state = $smtp->sendmail($smtpemailto, $smtpusermail, $mailtitle, $mailcontent, $mailtype);
            if($state){
                Session::set('verification', $post['uname'].$salt);
                return $this->apiReturn(0, 'success');
            }else{
                return $this->apiReturn(1, 'failed');
            }
        }
    }

    /**
     * 登录页面
     * @return mixed
     */
    public function signIn() {

        return $this->fetch();
    }

}