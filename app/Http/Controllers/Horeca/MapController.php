<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class MapController extends Controller
{
    public function index($point = null, $province = null, $county = null)
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
                'countyShapeId' => '6555291',
                'lat' => 29.5807,
                'lng' => 50.5124,
            ],
            [
                'id' => 'p-12335',
                'name' => 'هتل استقلال تهران',
                'image' => asset('assets/image/horeca/test.jpg'),
                'address' => 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، هتل استقلال تهران',
                'type' => 'هتل',
                'phone' => '9821-8888-8888',
                'provinceCode' => 'IR-07',
                'countyShapeId' => '6555291',
                'lat' => 35.7686,
                'lng' => 51.4104,
            ],
        ];

        $cardObjects = array_map(function ($item) {
            return (object) $item;
        }, $cards);

        return view('horeca.index', [
            'cards' => $cardObjects,       
            'mapCardsJson' => $cards,      
            'initialPoint' => $point,
            'initialProvince' => $province,
            'initialCounty' => $county,
        ]);
    }
}