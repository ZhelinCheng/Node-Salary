/**
 * Created by ChengZheLin on 2018/2/26.
 */

'use strict';
const cheerio = require("cheerio");
const superagent = require('superagent');
const fs = require('fs');
const statistics = require('./lib/statistics');
//const statistics = require("./lib/statistics");

let _data = {
    date : new Date(),
    list : [],
    len : 0
};

let index = 0;

function RandomNumBoth(Min,Max){
    let Range = Max - Min;
    let Rand = Math.random();
    let num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

function getList(url) {
    superagent.get(url)
        .set('Host', 'www.lagou.com')
        .set('Referer', 'https://www.lagou.com/zhaopin/webqianduan/3/?filterOption=2')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36')
        .set('Cookie', '_ga=GA1.2.989533252.1519651355; _gid=GA1.2.48993281.1519651355; user_trace_token=20180226212234-1afe192e-1af8-11e8-b0d9-5254005c3644; LGUID=20180226212234-1afe1c26-1af8-11e8-b0d9-5254005c3644; index_location_city=%E6%88%90%E9%83%BD; JSESSIONID=ABAAABAAAGGABCB4858E5FC28C7E40539896A7154F9FB62; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1519651355,1519654708; TG-TRACK-CODE=index_navigation; SEARCH_ID=9bad2d194f8b4fc7901c21076b2fba7f; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1519655342; LGRID=20180226222901-6375f623-1b01-11e8-929f-525400f775ce')
        .end(function (err, sres) {
            if (err) {
                console.log(err);
                return false;
            }

            console.log('第' + (++index) + "条：" + url);

            const $ = cheerio.load(sres.text, {
                decodeEntities: false
            });

            let item = {};

            const $list = $(".item_con_list .con_list_item");
            const $pagerNext = $(".pager_container a");
            let next = $pagerNext.eq($pagerNext.length - 1).attr("href");

            $list.each(function(){
                let $this = $(this);

                item.name = $this.attr("data-company");
                item.salary = $this.attr("data-salary");
                item.job = $this.find(".position_link").text().replace(/\s+/img, "");

                $this.find(".li_b_l").text(function(index, content) {
                    if(!index){
                        let info = content.replace(/\s+/img, "");
                        item.exp = info.match(/[^k]+(?=\/)/)[0];
                        item.edu = info.match(/[^\/]+$/)[0];
                    }
                });

                _data.len++;
                _data.list.push(item);
                item = {};
            });

            if(next.indexOf("http") >= 0){
                setTimeout(function () {
                    getList(next)
                }, RandomNumBoth(6000, 12000));
            }else {
                fs.writeFile('./' + (new Date().getTime()) + '.json', JSON.stringify(_data), function (err) {
                    if(err) {
                        console.log(err);
                        return false;
                    }
                    statistics.start(_data);
                    console.log('写入完成！')
                });


            }
        });
}

getList('https://www.lagou.com/zhaopin/webqianduan/?labelWords=label');




