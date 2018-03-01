/**
 * Created by ChengZheLin on 2018/2/27.
 */

'use strict';

const fs = require('fs');

/*let _DATA = null;
try {
    _DATA = JSON.parse(fs.readFileSync("../1519658913385.json", 'utf-8'));
} catch (err) {
    console.log('Error:' + '未找到数据\n' + err);
    return;
}*/


//本科
let undergraduate = {
    not: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    },
    primary: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    },
    intermediate: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    }
};

//专科
let specialty = {
    not: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    },
    primary: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    },
    intermediate: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    }
};

//学历不限
let unlimited = {
    not: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    },
    primary: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    },
    intermediate: {
        min: 0,
        max: 0,
        modeMin: 0,
        modeMax: 0,
        meanMin: 0,
        meanMax: 0,
        listMin: [],
        listMax: [],
        disMin: {},
        disMax: {}
    }
};

class Statistics {
    start(data) {

        data.list.forEach((item) => {
            let salary = item.salary.match(/[0-9]+/img);
            let min = parseInt(salary[0]);
            let max = parseInt(salary[1]);

            if (item.exp === '经验1-3年') {
                this.calculation(item.edu, min, max, 'primary');
            } else if (item.exp === '经验3-5年') {
                this.calculation(item.edu, min, max, 'intermediate');
            } else if (item.exp === '经验不限') {
                this.calculation(item.edu, min, max, 'not');
            }
        });

        //console.log(specialty)

        //求众数和分布
        this.arrangement(specialty);
        this.arrangement(undergraduate);
        this.arrangement(unlimited);

        //专科不限
        specialty.not.meanMin = this.mean(specialty.not.listMin);
        specialty.not.meanMax = this.mean(specialty.not.listMax);
        //专科初级
        specialty.primary.meanMin = this.mean(specialty.primary.listMin);
        specialty.primary.meanMax = this.mean(specialty.primary.listMax);
        //专科中级
        specialty.intermediate.meanMin = this.mean(specialty.intermediate.listMin);
        specialty.intermediate.meanMax = this.mean(specialty.intermediate.listMax);


        //本科不限
        undergraduate.not.meanMin = this.mean(undergraduate.not.listMin);
        undergraduate.not.meanMax = this.mean(undergraduate.not.listMax);
        //本科初级
        undergraduate.primary.meanMin = this.mean(undergraduate.primary.listMin);
        undergraduate.primary.meanMax = this.mean(undergraduate.primary.listMax);
        //本科中级
        undergraduate.intermediate.meanMin = this.mean(undergraduate.intermediate.listMin);
        undergraduate.intermediate.meanMax = this.mean(undergraduate.intermediate.listMax);


        //不限学历不限
        unlimited.not.meanMin = this.mean(unlimited.not.listMin);
        unlimited.not.meanMax = this.mean(unlimited.not.listMax);
        //不限学历初级
        unlimited.primary.meanMin = this.mean(unlimited.primary.listMin);
        unlimited.primary.meanMax = this.mean(unlimited.primary.listMax);
        //不限学历中级
        unlimited.intermediate.meanMin = this.mean(unlimited.intermediate.listMin);
        unlimited.intermediate.meanMax = this.mean(unlimited.intermediate.listMax);

        this.generate({specialty, undergraduate, unlimited});
    }

    calculation(edu, min, max, grade) {
        switch (edu) {
            case '大专':
                if (specialty[grade].min === 0 || specialty[grade].min > min) {
                    specialty[grade].min = min;
                }

                if (specialty[grade].max < max) {
                    specialty[grade].max = max;
                }

                specialty[grade].listMin.push(min);
                specialty[grade].listMax.push(max);
                break;
            case '本科':
                if (undergraduate[grade].min === 0 || undergraduate[grade].min > min) {
                    undergraduate[grade].min = min;
                }

                if (undergraduate[grade].max < max) {
                    undergraduate[grade].max = max;
                }

                undergraduate[grade].listMin.push(min);
                undergraduate[grade].listMax.push(max);
                break;
            case '不限':
                if (unlimited[grade].min === 0 || unlimited[grade].min > min) {
                    unlimited[grade].min = min;
                }

                if (unlimited[grade].max < max) {
                    unlimited[grade].max = max;
                }

                unlimited[grade].listMin.push(min);
                unlimited[grade].listMax.push(max);
                break;
        }
    }

    arrangement(obj) {
        for (let i in obj) {
            let arrMin = this.modeDistribution(obj[i].listMin);
            let arrMax = this.modeDistribution(obj[i].listMax);

            obj[i].modeMin = arrMin[0];
            obj[i].disMin = arrMin[1];


            obj[i].modeMax = arrMax[0];
            obj[i].disMax = arrMax[1];
        }
    }

    modeDistribution(arr) {
        //求众数及薪资分布
        let obj = {};
        let len = arr.length;

        //整理薪资分布
        for (let i of arr) {
            if (i in obj) {
                obj[i] += 1
            } else {
                obj[i] = 1
            }
        }

        //获取众数
        let max = 0;
        let modeNum = 0;
        for (let i in obj) {
            if (obj[i] > max) {
                max = obj[i];
                modeNum = i;
            }
        }

        //计算比例
        let newObj = {};
        for (let i in obj) {
            newObj[i + 'k'] = Math.round((obj[i] / len) * 100) + '%';
        }


        return [modeNum, newObj]
    }

    mean(arr) {
        //求平均
        let len = arr.length;
        let and = 0;
        for (let i of arr) {
            and += i
        }
        return (and / len).toFixed(2);
    }

    generate(obj) {
        //生产表格
        let str = '学历,工作年限,最低薪资/k,最高薪资/k,最低薪资众数/k,最高薪资众数/k,最低薪资平均/k,最高薪资平均/k,样本数\r\n';
        let disMin = '学历,工作年限,最低薪资段,最低薪资分布\r\n';
        let disMax = '学历,工作年限,最高薪资段,最高薪资分布\r\n';
        let dis = '';

        for (let i in obj) {
            let item = obj[i];
            let edu = '';
            switch (i) {
                case 'unlimited':
                    edu += '不限,';
                    break;
                case 'undergraduate':
                    edu += '本科,';
                    break;
                case 'specialty':
                    edu += '大专,';
                    break;
            }

            for (let j in item) {
                let exp = '';
                switch (j) {
                    case 'not':
                        exp = '经验不限,';
                        str = str + edu + exp;
                        break;
                    case 'primary':
                        exp = '经验1-3年,';
                        str = str + edu + exp;
                        break;
                    case 'intermediate':
                        exp = '经验3-5年,';
                        str = str + edu + exp;
                        break;
                }
                str += this.mosaic(item[j]);

                //console.log(edu,exp);

                dis += this.distribution(item[j], disMin, disMax, edu + exp);
            }
        }

        fs.writeFile('./' + (new Date().getTime()) + '.csv', (str + '\r\n' + dis), {encoding: 'utf-8'}, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log('写入完成！')
        });
    }

    distribution(item, disMin, disMax, eduExp) {
        let minLen = Object.keys(item.disMin).length;
        let maxLen = Object.keys(item.disMax).length;
        let allStr = '';

        function disObj(obj, str) {
            let index = 0;
            for (let i in obj) {
                if (!index) {
                    str += eduExp + i + ',' + obj[i] + '\r\n'
                } else {
                    str += ',,' + i + ',' + obj[i] + '\r\n'
                }
                index++;
            }
            return str;
            //console.log(str + '\n =================')
        }

        allStr += disObj(item.disMin, disMin) + '\r\n';
        allStr += disObj(item.disMax, disMax);

        //console.log(allStr)
        return allStr + '\r\n';
    }

    mosaic(item) {
        let str = `${item.min},${item.max},${item.modeMin},${item.modeMax},${item.meanMin},${item.meanMax},${item.listMin.length}\r\n`;
        return str;
    }
}

const statistics = new Statistics();
//statistics.start(_DATA);

module.exports = statistics;