<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class MapController extends Controller
{
    public function index($province = null, $county = null, $point = null)
    {
        $cards = [
            [
                'id' => 'p-12334',
                'name' => 'هتل اسپیناس پالاس',
                'image' => asset('assets/image/horeca/test.jpg'),
                'address' => 'تهران، بزرگراه چمران، خیابان شیخ فضل‌الله نوری، بعد از پل پارک وی، هتل اسپیناس پالاس',
                'type' => 'هتل',
                'phone' => '9821-8855-5555',
                'provinceCode' => 'IR-07',
                'countyId' => '1246767862',
            ],
            [
                'id' => 'p-12335',
                'name' => 'هتل استقلال تهران',
                'image' => asset('assets/image/horeca/test.jpg'),
                'address' => 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، هتل استقلال تهران',
                'type' => 'هتل',
                'phone' => '9821-8888-8888',
                'provinceCode' => 'IR-07',
                'countyId' => '1246767863',
            ],
        ];
        $cards = array_map(function ($item) {
            return (object) $item;
        }, $cards);

        return view('horeca.index', compact('cards'));
    }
}