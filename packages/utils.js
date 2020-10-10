var methods = {};

methods.upFile = ({ success, error }) => {
        var input = document.createElement("input");
        input.type = "file";
        // input.accept = "image/*";
        input.style = `opacity:0;position: absolute;top: -10000px;`;
        document.body.appendChild(input);
        input.onchange = (e) => {
            if (e.target.files.length == 0) {
                error('请选择文件');
            } else {
                success(e.target.files)
            }
        };
        input.click();
    }
    // dateTime(new Date(),true||null)
methods.getDay = (val) => {


    function getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = doHandleMonth(tMonth + 1);
        tDate = doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
    }

    function doHandleMonth(month) {
        var m = month;
        if (month.toString().length == 1) {
            m = "0" + month;
        }
        return m;
    }
    return getDay(val);
}

/**
 * 深拷贝
 */

methods.deepCopy = (target) => {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === "object") {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(methods.deepCopy(target[i]));
            }
            // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
            result = null;
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
            result = target;
        } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
                result[i] = methods.deepCopy(target[i]);
            }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target;
    }
    // 返回最终结果
    return result;
}

/**
 * 时间序列化
 * 
 */

methods.dateTime = (time, type) => {
    if (type) {
        time = new Date(parseInt(time) * 1000);
    }

    var date = new Date(time);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (type == 'num') {
        return Math.round(new Date(time) / 1000);
    }
    return { 'nyr': y + '-' + m + '-' + d, 'datetime': h + ':' + minute + ':' + second, 'time': (y + '-' + m + '-' + d) + ' ' + (h + ':' + minute + ':' + second) };

}

/**
 * 时间倒计时
 * 
 */
// timeCountdown('2017-07-07',(t)=>{
//     console.log(t.content);
// })
methods.timeCountdown = (endtime, fun) => {
        setInterval(() => {
            var nowtime = new Date(), //获取当前时间
                endtime = new Date(endtime); //定义结束时间
            var lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
                leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
                lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24), //计算小时数
                leftm = Math.floor(lefttime / (1000 * 60) % 60), //计算分钟数
                lefts = Math.floor(lefttime / 1000 % 60); //计算秒数

            fun({
                leftd,
                lefth,
                leftm,
                lefts,
                content: `${leftd}天${lefth}小时${leftm}分钟${lefts}秒后结束`
            })
        }, 1000)
    }
    /**
     * url 分解参数
     */
    // parseUrl('http://localhost:9527/#/home')

methods.parseUrl = (href) => {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/),
        query = {},
        keyValue,
        tplValue,
        defaultPort = {
            "http:": 80,
            "https:": 443,
            "ftp:": 21,
            "gopher:": 70,
            "ws:": 80,
            "wws": 443
        };
    if (match[6]) {
        keyValue = match[6].replace(/^\?/, "").split('&');
        query = {};
        for (var i = 0, j = keyValue.length; i < j; i++) {
            tplValue = keyValue[i].split('=');
            query[tplValue[0]] = tplValue[1];
        }
    }
    return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4] || defaultPort[match[1]] || "",
        path: match[5] + match[6],
        pathname: match[5],
        search: match[6],
        hash: match[7],
        query: query
    }
}

/**
 * url替换
 * */

methods.urlUpdate = (url, parmas) => {
    let parUrl = methods.parseUrl(url);
    let { protocol, query, pathname, hash, host } = parUrl;
    for (let i in parmas) {
        query[i] = parmas[i];
    }

    function objUrl(params) {
        params.setType = 'null';
        let vi = 0;
        for (let i in params) {
            vi++;
        };
        var url = '?';
        for (let i in params) {
            console.log(i);
            url += (`${i}=${params[i]}` + (i != Object.keys(params)[vi - 1] ? '&' : ''))
        };
        console.log(url)
        return url;
    }
    let obj = objUrl(query);
    return protocol + '//' + host + pathname + obj + (hash ? hash : '');
}

/**
 * 是否为手机号
 */
methods.isMobile = function(value) {

        return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(value);
    }
    /**
     * 注册验证
     */
methods.checkPwd = function(value) {
    //密码为8~20位数字和字母组合
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value);
}

methods.leavetime = function(endtime, currenttime) {
    if (!endtime) return null;
    let d = moment.duration(moment(endtime).diff(currenttime || moment()));
    return {
        hours: ~~d.as('hours'),
        minutes: d.get('minutes'),
        seconds: d.get('seconds'),
        milliseconds: d._milliseconds || 0,
    }
}

methods.thousand = function(number, decimals) {
    let dec_point = ".";
    let thousands_sep = ",";
    number = (number + "").replace(/[^0-9+-Ee.]/g, "");
    let n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
        dec = typeof dec_point === "undefined" ? "." : dec_point,
        s = "",
        toFixedFix = function(n, prec) {
            let k = Math.pow(10, prec);
            return "" + Math.floor(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : "" + Math.floor(n)).split(".");
    let re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
}

methods.sayEnglish = function(number) {
    let arr1 = ["", " thousand", " million", " billion"];

    function english(a) {
        let arr2 = ["zero", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        let arr3 = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        let arr4 = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
        let strRet = "";

        if (a.length == 3 && a.substr(0, 3) != "000") {
            if (a.substr(0, 1) != "0") {
                strRet += arr3[a.substr(0, 1)] + " hundred";
                if (a.substr(1, 2) != "00") strRet += " and "
            }
            a = a.substring(1);
        }
        if (a.length == 2)
            if (a.substr(0, 1) == "0") a = a.substring(1);
            else if (a.substr(0, 1) == "1") strRet += arr4[a.substr(1, 2)];
        else {
            strRet += arr2[a.substr(0, 1)];
            if (a.substr(1, 1) != "0") strRet += "-";
            a = a.substring(1)
        }
        if (a.length == 1 && a.substr(0, 1) != "0") strRet += arr3[a.substr(0, 1)];
        return strRet;
    }

    let a = number.toString();
    let b = a.length,
        f, h = 0,
        g = "",
        e = Math.ceil(b / 3),
        k = b - e * 3;
    g = "";
    for (f = k; f < b; f += 3) {
        ++h;
        let num3 = f >= 0 ? a.substring(f, f + 3) : a.substring(0, k + 3);
        let strEng = english(num3);
        if (strEng != "") {
            if (g != "") g += ",";
            g += english(num3) + arr1[e - h]
        }
    }
    return g.toUpperCase();
}

methods.sayMoney = function(n) {
    let fraction = ['角', '分'];
    let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    let unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    let head = n < 0 ? '欠' : '';
    n = Math.abs(n);

    let s = '';

    for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = '';
        for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

methods.copy = function(source) {
    return JSON.parse(JSON.stringify(source));
}

methods.getCookie = function(name) {
    let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return arr[2];
    else return null;
}

methods.setCookie = function(c_name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
}

methods.delCookie = function(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

methods.setSession = function(key, value) {
    let storage = window.sessionStorage;
    storage.setItem(key + '-state', JSON.stringify({ data: value }));
}

methods.getSession = function(key) {
    let storage = window.sessionStorage;
    let valStr = storage.getItem(key + '-state');
    if (typeof valStr === 'undefined' || valStr === null) return null;
    let data = JSON.parse(valStr);
    return data.data;
}

methods.setStorage = function(key, value) {
    let storage = window.localStorage;
    storage.setItem(key + '-state', JSON.stringify({ data: value }));
}

methods.getStorage = function(key) {
    let storage = window.localStorage;
    let valStr = storage.getItem(key + '-state');
    if (typeof valStr === 'undefined' || valStr === null) return null;
    let data = JSON.parse(valStr);
    return data.data;
}

methods.randomStr = function(len) {
    let result = "";
    let _len = len;
    while (len > 0) {
        let rand_str = Math.round(Math.random() * 100000).toString().substr(0, 5);
        result += rand_str;
        len -= 5;
    }
    return result.substr(0, _len);
}

methods.assert = function(val, error) {
    if (!val) {
        throw new Error(error);
    }
}



export default methods;