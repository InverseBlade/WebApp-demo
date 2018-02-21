<?php
/**
 * Created by PhpStorm.
 * User: zewei zhang
 * Date: 2018/2/20
 * Time: 14:00
 */
function shortHash($url) {
    $charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    $pre = 'token';
    $suf = 'team';
    $urlhash = md5($pre.$url.$suf);
    $len = strlen($urlhash);
    for ($i = 0; $i < 4; ++$i) {
        $urlhash_piece = substr($urlhash, $i * $len / 4, $len / 4);
        $hex = hexdec($urlhash_piece) & 0x3fffffff;
        $short_url = '';
        for ($j = 0; $j < 6; ++$j) {
            $short_url .= $charset[$hex & 0x0000003d];
            $hex = $hex >> 5;
        }
        $short_url_list[] = $short_url;
    }
    return $short_url_list[0];
}