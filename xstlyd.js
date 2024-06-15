/*

变量：xstlhd 例：账号&密码  多个账号使用@或者换行隔开

*/
const axios = require('axios');
let request = require("request");
const NodeRSA = require('node-rsa');
const $ = new Env('潇洒桐庐阅读');
let xstlhd = ($.isNode() ? process.env.xstlhd : $.getdata("xstlhd")) || ""
let xstlhdArr = [];
var timestamp = Math.round(new Date().getTime() / 1000).toString();
let pd = []
let sessionId = ''//用户id
let account_id = ''//用户id
let newsList = ''//新闻列表
let bbsList = "" // 社区帖子列表
let uinfo = ''//用户信息
let channelids = [{'id':'6530daf779f6be358bba1522','rod':1}, {'id':'6530dae171a9ed74577e4689','rod':2},{'id':'6530db1e71a9ed74577e468e','rod':3}]

const publicKeyStr = "-----BEGIN PUBLIC KEY-----"
    + "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6XO7e9YeAOs+cFqwa7ETJ+WXizPqQeXv68i5vqw9pFREsrqiBTRcg7wB0RIp3rJkDpaeVJLsZqYm5TW7FWx/iOiXFc+zCPvaKZric2dXCw27EvlH5rq+zwIPDAJHGAfnn1nmQH7wR3PCatEIb8pz5GFlTHMlluw4ZYmnOwg+thwIDAQAB"
    + "-----END PUBLIC KEY-----";

const url = 'https://vapp.tmuyun.com/api'  //固定url
const tenantId = '59'
const client_id = '10017'



request = request.defaults({
    jar: true
});

const {
    log
} = console;
const debug = 0; //0为关闭调试，1为打开调试,默认为0

!(async () => {
    if (typeof $request !== "undefined") {
        await GetRewrite();
    } else {
        if (!(await Envs()))
            return;
        else {

            log(`\n\n=============================================    \n脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000).toLocaleString()} \n=============================================\n`);

            log(`\n============ 公众号：柠檬Plus ============`)
            log(`\n=================== 共找到 ${xstlhdArr.length} 个账号 ===================`)
            if (debug) {
                log(`【debug】 这是你的全部账号数组:\n ${xstlhdArr}`);
            }
            for (let index = 0; index < xstlhdArr.length; index++) {

                let num = index + 1
                log(`\n==== 开始【第 ${num} 个账号】====\n`)
                xstlhd = xstlhdArr[index];
                await init()

                await userInfo()
                log(`昵称:       ${uinfo.nick_name}`)
                log(`手机号:     ${uinfo.phone_number}`)
                log(`当前积分:   ${uinfo.total_integral}`)
                for (let i=0;i<channelids.length;i++) {

                      await getUserInformation(channelids[i].id)
                      await addPrizenum(channelids[i].rod)
                  await getUserindex()
               await apiChoujiang()
                }
               // await addPrizenum()
                
                /*
                                log(`==== 删除评论 ====`)
                                await signIn(); //签到
                                await comment_list()
                                await pdlist()
                                await numberCenter()
                                log(`==== 删除评论 ====`)
                                await comment_list()
                
                                log(`==== 使用本地服务 ====`)
                                await useLocalService();
                */

                await userInfo()


            }

        }
    }
})()
    .catch((e) => log(e))
    .finally(() => $.done())



function RSAEncrypt(str) {
    const key = new NodeRSA(publicKeyStr);
    key.setOptions({ encryptionScheme: 'pkcs1' });
    //使用公钥加密
    let encrypt = key.encrypt(str, 'base64', 'utf8');
    return encrypt;
}
/*********************** */
async function getUserInformation(channelId) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'get',
            url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/channelList&channelId=${channelId}&userId=${account_id}&sessionId=${sessionId}`,
            headers: {
                'Host': 'wxapi.hoolo.tv',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; PEMM20 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36;xsb_xiaosatonglu;xsb_xiaosatonglu;1.0.60;native_app;6.5.1',
                'Origin': 'https://tp.hoolo.tv',
                'X-Requested-With': 'com.chinamcloud.wangjie.b87d8fb20e29a0328c6e21045e8b500e',
                'Referer': 'https://tp.hoolo.tv/h5/tlread/index.html'
            }
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                ardlist = data
                for (let i = 0; i < ardlist.length; i++) {
                    if (ardlist[i].is_read == 'no') {
                        await ReadNews(ardlist[i].id)
                        await $.wait(1000)
                        await getUserRead(ardlist[i].id)
                        await postBaoming(ardlist[i].id)
                        await channel_article_id(ardlist[i].id)
                        await $.wait(1000)
                        await read_time(ardlist[i].id)


                    }
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function getUserRead(articleId) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'get',
            url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/getUserRead&accountId=${account_id}&articleId=${articleId}&type=jsonp`,
            headers: {
                'Host': 'wxapi.hoolo.tv',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; PEMM20 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36;xsb_xiaosatonglu;xsb_xiaosatonglu;1.0.60;native_app;6.5.1',
                'Origin': 'https://tp.hoolo.tv',
                'X-Requested-With': 'com.chinamcloud.wangjie.b87d8fb20e29a0328c6e21045e8b500e',
                'Referer': 'https://tp.hoolo.tv/h5/tlread/index.html'
            }
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                log('阅读:' + data.message)

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function postBaoming(articleId) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'get',
            url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=home/baoming/postBaoming/&activityId=428&name=${account_id}&city=${articleId}&gender=3&cellphone=${uinfo.phone_number}&type=jsonp`,
            headers: {
                'Host': 'wxapi.hoolo.tv',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; PEMM20 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36;xsb_xiaosatonglu;xsb_xiaosatonglu;1.0.60;native_app;6.5.1',
                'Origin': 'https://tp.hoolo.tv',
                'X-Requested-With': 'com.chinamcloud.wangjie.b87d8fb20e29a0328c6e21045e8b500e',
                'Referer': 'https://tp.hoolo.tv/h5/tlread/index.html'
            }
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                log('阅读:' + data.message)
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function addPrizenum(round) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'get',
            url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/addPrizenum&accountId=${account_id}&round=${round}&num=10&type=jsonp`,
            headers: {
                'Host': 'wxapi.hoolo.tv',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; PEMM20 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36;xsb_xiaosatonglu;xsb_xiaosatonglu;1.0.60;native_app;6.5.1',
                'Origin': 'https://tp.hoolo.tv',
                'X-Requested-With': 'com.chinamcloud.wangjie.b87d8fb20e29a0328c6e21045e8b500e',
                'Referer': 'https://tp.hoolo.tv/h5/tlread/index.html'
            }
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                log(JSON.stringify(response.data));

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function getUserindex(articleId) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'get',
            url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/home/TmApi/getUserInformation&accountId=${account_id}&username=${encodeURI(uinfo.nick_name)}&type=jsonp`,
            headers: {
                'Host': 'wxapi.hoolo.tv',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; PEMM20 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36;xsb_xiaosatonglu;xsb_xiaosatonglu;1.0.60;native_app;6.5.1',
                'Origin': 'https://tp.hoolo.tv',
                'X-Requested-With': 'com.chinamcloud.wangjie.b87d8fb20e29a0328c6e21045e8b500e',
                'Referer': 'https://tp.hoolo.tv/h5/tlread/index.html'
            }
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    userid = data.data.userid
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function apiChoujiang(articleId) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'get',
            url: `https://wxapi.hoolo.tv/event/dtqp/index.php?s=/Home/ChoujiangNew/apiChoujiang&callback=jQuery171020816249544106458_1701612783569&openId=${account_id}&action=cj&typeId=122&address=&userid=${userid}&_=1701612827271`,
            headers: {
                'Host': 'wxapi.hoolo.tv',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; PEMM20 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36;xsb_xiaosatonglu;xsb_xiaosatonglu;1.0.60;native_app;6.5.1',
                'Origin': 'https://tp.hoolo.tv',
                'X-Requested-With': 'com.chinamcloud.wangjie.b87d8fb20e29a0328c6e21045e8b500e',
                'Referer': 'https://tp.hoolo.tv/h5/tlread/index.html'
            }
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                log(JSON.stringify(response.data))

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
/********************** */
async function init() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'POST',
            url: `${url}/account/init`,
            headers: {
                'X-SESSION-ID': '',
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/account/init&&&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release'
            },
            data: ''
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    sessionIds = response.data.data.session.id
                    await mine()
                    await detail()
                    await credential_auth(xstlhd.split('&')[0], xstlhd.split('&')[1])

                }


            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function mine(a) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'GET',
            url: `${url}/app_version_customize_config/mine`,
            headers: {
                'X-SESSION-ID': a,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/app_version_customize_config/mine&&${a}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release'
            },
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    log(data.message)
                }


            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function detail(a) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: 'GET',
            url: `${url}/app_version/detail`,
            headers: {
                'X-SESSION-ID': a,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/app_version/detail&&${a}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release'
            },
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    log(data.message)
                }


            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
// 获取requestID
function RandeCode() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;

};

// 获取登录code
async function credential_auth(item, item2) {
    requID = RandeCode()
    pass = RSAEncrypt(item2)
    signs = SHA256_Encrypt('post%%/web/oauth/credential_auth?client_id=' + client_id + '&password=' + pass + '&phone_number=' + item + '%%' + requID + '%%')
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `https://passport.tmuyun.com/web/oauth/credential_auth`,
            headers: {
                'Cache-Control': 'no-cache',
                'User-Agent': 'ANDROID;10;' + client_id + ';1.5.1;1.0;null;PCAM00',
                'X-REQUEST-ID': requID,
                'X-SIGNATURE': signs,
                'Host': 'passport.tmuyun.com',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'COOKIE': 'SESSION=Zjc5MjAzMmYtYzM2ZC00OTY5LWI1ZWMtMzYyOTg2ZTZkOGQ3; Path=/; HttpOnly; SameSite=Lax'

            },
            data: `client_id=${client_id}&password=${encodeURIComponent(pass)}&phone_number=${item}`

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (response.data.code === 0) {
                    //log(response.data.data.authorization_code.code)
                    await login(response.data.data.authorization_code.code)
                } else {
                    log(response.data.reason)
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })
}

// 登录
async function login(code) {
    const ts = +new Date()
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `${url}/zbtxz/login`,
            headers: {
                'Host': 'vapp.tmuyun.com',
                'X-SESSION-ID': sessionIds,
                'X-SIGNATURE': SHA256_Encrypt(`/api/zbtxz/login&&${sessionIds}&&${requID}&&${ts}&&FR*r!isE5W&&${tenantId}`),
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release',
                'X-TIMESTAMP': ts,
                'X-TENANT-ID': tenantId,
                'X-REQUEST-ID': requID,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: 'check_token=&code=' + code + '&token=&type=-1&union_id='

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (response.data.code === 0) {
                    // log(response.data.data.authorization_code.code)
                    sessionId = response.data.data.session.id
                    account_id = response.data.data.session.account_id
                    await client_ids()
                    await mine(sessionId)
                    await detail(sessionId)
                    await unread()
                    await app_feature_switch()

                } else {
                    log(response.data.reason)
                }

                // log(response.data)

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })
}
async function client_ids() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `${url}/account/client_id`,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'vapp.tmuyun.com',
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/account/client_id&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release'

            },
            data: 'client_id=cca5d9463d96e70307c70e992de86646'

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    log(data.message)
                }


            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function app_feature_switch() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/app_feature_switch/list`,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'vapp.tmuyun.com',
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/app_feature_switch/list&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release'

            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    log(data.message)
                }


            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })
}
async function unread() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/chuanbo/unread`,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'vapp.tmuyun.com',
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/chuanbo/unread&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release'

            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    log(data.message)
                }


            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
//pd
async function pdlist() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/app_nav/list`,
            headers: {

                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/app_nav/list&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release'

            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    pds = data.data.focus
                    for (let i = 0; i < pds.length; i++) {
                        if (pds[i].nav_type == 'channel') {
                            pd.push(pds[i].nav_parameter)
                        }
                    }
                }


            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}



//  获取用户信息
async function userInfo() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/user_mumber/account_detail`,
            headers: {
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release',
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/user_mumber/account_detail&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId
            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                // log(response.data)
                if (response.data.code == '0') {
                    uinfo = response.data.data.rst
                    log(`当前积分:   ${response.data.data.rst.total_integral}`)
                } else {
                    log(response.data.reason)
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}

// 签到
function signIn() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/user_mumber/sign`,
            headers: {
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release',
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/user_mumber/sign&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId
            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                // log(response.data)
                if (response.data.code == '0') {
                    if (response.data.data.reason == 'Success') {
                        log(`签到成功，获得${response.data.data.signIntegral} 积分`)
                    }
                } else {
                    log('签到:' + response.data.reason)
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}

// 获取新闻列表
async function GetNews() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/article/channel_list?channel_id=${pd[Math.floor(Math.random() * pd.length)]}&isDiFangHao=false&is_new=true&list_count=0&size=200`,
            headers: {
                'X-ACCOUNT-ID': sessionId,
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/article/channel_list&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                "User-Agent": "1.5.1;00000000-67da-9a7e-0000-00003dbe4550;OPPO PCAM00;Android;10;Release"
            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {

                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }

                if (response.data.code == '0') {
                    log(response.data.data.channel.name)
                    newsList = response.data.data.article_list
                } else {
                    log(response.data)
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function comment_list() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/account_comment/comment_list?size=500`,
            headers: {
                'X-ACCOUNT-ID': sessionId,
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/account_comment/comment_list&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                "User-Agent": "1.5.1;00000000-67da-9a7e-0000-00003dbe4550;OPPO PCAM00;Android;10;Release"
            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {

                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                // log(response.data)
                if (response.data.code == '0') {

                    comment_lists = response.data.data.comment_list
                    for (let j = 0; j < comment_lists.length; j++) {
                        await deletes(comment_lists[j].id)
                    }
                } else {
                    log(response.data)
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function numberCenter() {
    requID = RandeCode()
    ts = +new Date()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/user_center/task?type=1&current=1&size=20`,
            headers: {
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': ts,
                "X-SIGNATURE": SHA256_Encrypt(`/api/user_center/task&&${sessionId}&&${requID}&&${ts}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                'X-ACCOUNT-ID': sessionId,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                tasklist = data.data.list
                for (let i = 0; i < tasklist.length; i++) {
                    log('====' + tasklist[i].name + '====')
                    frequency = tasklist[i].frequency
                    finish_times = tasklist[i].finish_times
                    log('任务次数：' + frequency + ' 已完成次数：' + finish_times + '   ' + frequency + '/' + finish_times)
                    if (tasklist[i].name != '邀请好友' && frequency != finish_times) {
                        await GetNews()
                        if (tasklist[i].name == '新闻资讯点赞') {
                            for (let j = 0; j < frequency - finish_times; j++) {
                                await ReadNews(newsList[j].id)
                                await LikeNews(newsList[j].id)
                                await $.wait(2000)
                            }
                        }
                        if (tasklist[i].name == '新闻资讯评论') {

                            for (let j = 0; j < frequency - finish_times; j++) {
                                await ReadNews(newsList[j].id)
                                await CommentNews(newsList[j].id)
                                await $.wait(2000)
                            }
                        }
                        if (tasklist[i].name == '新闻资讯点赞') {

                            for (let j = 0; j < frequency - finish_times; j++) {
                                //await ReadNews(newsList[j].id)
                                //await LikeNews(newsList[j].id)
                                // await $.wait(2000)
                            }
                        }
                        if (tasklist[i].name == '分享资讯给好友') {

                            for (let j = 0; j < frequency - finish_times; j++) {
                                await ReadNews(newsList[j].id)
                                await ShareNews(newsList[j].id)
                                await $.wait(2000)
                            }
                        }
                    }
                }
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
// 阅读新闻
async function ReadNews(item) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",
            url: `${url}/article/detail?id=${item}`,
            headers: {
                'X-ACCOUNT-ID': sessionId,
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/article/detail&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                "User-Agent": "1.5.1;00000000-67da-9a7e-0000-00003dbe4550;OPPO PCAM00;Android;10;Release",
                "Content-Type": "application/x-www-form-urlencoded",
                'Accept-Encoding': 'gzip',
                Host: 'vapp.tmuyun.com',

            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                // log(response.data)
                if (data.hasOwnProperty("score_notify") == true) {
                    log('积分:' + data.data.score_notify.integral)

                } else {
                    log('阅读新闻:' + data.message)
                }

            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function channel_article_id(item) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",

            url: `${url}/comment/list?channel_article_id=${item}&sort_type=0`,
            headers: {
                'X-ACCOUNT-ID': sessionId,
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/comment/list&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                "User-Agent": "1.5.1;00000000-67da-9a7e-0000-00003dbe4550;OPPO PCAM00;Android;10;Release",
                "Content-Type": "application/x-www-form-urlencoded",
                'Accept-Encoding': 'gzip',
                Host: 'vapp.tmuyun.com',

            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                log('阅读:' + data.message)
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
async function read_time(item) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "get",

            url: `${url}/article/read_time?channel_article_id=${item}&read_time=897`,
            headers: {
                'X-ACCOUNT-ID': sessionId,
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/article/read_time&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                "User-Agent": "1.5.1;00000000-67da-9a7e-0000-00003dbe4550;OPPO PCAM00;Android;10;Release",
                "Content-Type": "application/x-www-form-urlencoded",
                'Accept-Encoding': 'gzip',
                Host: 'vapp.tmuyun.com',

            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                log('阅读:' + data.message)
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
// 删除评论
async function deletes(item) {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `${url}/comment/delete`,
            headers: {
                'X-ACCOUNT-ID': sessionId,
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/comment/delete&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                "User-Agent": "1.5.1;00000000-67da-9a7e-0000-00003dbe4550;OPPO PCAM00;Android;10;Release",
                "Content-Type": "application/x-www-form-urlencoded",
                'Accept-Encoding': 'gzip',
                Host: 'vapp.tmuyun.com',

            },
            data: 'comment_id=' + item

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 0) {
                    log('删除评论:' + data.message)

                } else {
                    log('删除评论:' + data.message)
                }
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
// 分享新闻
async function ShareNews(item) {
    requID = RandeCode()
    ts = Math.round(new Date().getTime()).toString()
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `${url}/user_mumber/doTask`,
            headers: {
                'X-SESSION-ID': sessionId,
                'X-REQUEST-ID': requID,
                'X-TIMESTAMP': ts,
                'X-SIGNATURE': SHA256_Encrypt(`/api/user_mumber/doTask&&${sessionId}&&${requID}&&${ts}&&FR*r!isE5W&&${tenantId}`),
                'X-TENANT-ID': tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release',
                'X-ACCOUNT-ID': sessionId,
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',

            },
            data: 'memberType=3&member_type=3'

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.hasOwnProperty("data") == true) {
                    log('积分:' + data.data.score_notify.integral)

                } else {
                    log('分享新闻:' + data.message)
                }
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}

// 点赞新闻
async function LikeNews(item) {
    requID = RandeCode()
    ts = Math.round(new Date().getTime()).toString()
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `${url}/favorite/like`,
            headers: {
                'X-SESSION-ID': sessionId,
                'X-REQUEST-ID': requID,
                'X-TIMESTAMP': ts,
                'X-SIGNATURE': SHA256_Encrypt(`/api/favorite/like&&${sessionId}&&${requID}&&${ts}&&FR*r!isE5W&&${tenantId}`),
                'X-TENANT-ID': tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release',
                'X-ACCOUNT-ID': sessionId,
                'Cache-Control': 'no-cache',
                Connection: 'Keep-Alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'vapp.tmuyun.com',

            },
            data: 'action=true&id=' + item

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.hasOwnProperty("data") == true) {
                    log('积分:' + data.data.score_notify.integral)

                } else {
                    log('点赞新闻:' + data.message)
                }
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}

// 评论新闻
async function CommentNews(item) {
    requID = RandeCode()
    ts = Math.round(new Date().getTime()).toString()
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `${url}/comment/create`,
            headers: {
                'X-SESSION-ID': sessionId,
                'X-REQUEST-ID': requID,
                'X-TIMESTAMP': ts,
                'X-SIGNATURE': SHA256_Encrypt(`/api/comment/create&&${sessionId}&&${requID}&&${ts}&&FR*r!isE5W&&${tenantId}`),
                'X-TENANT-ID': tenantId,
                'User-Agent': '1.5.1;' + requID + ';OPPO PCAM00;Android;10;Release',
                'X-ACCOUNT-ID': sessionId,
                'Cache-Control': 'no-cache',
                Connection: 'Keep-Alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'vapp.tmuyun.com',

            },
            data: 'channel_article_id=' + item + '&content=%E5%B7%B2%E9%98%85%E8%AF%BB'

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                // log(response.data)
                if (data.hasOwnProperty("data") == true && data.data.score_notify != undefined) {
                    log('积分:' + data.data.score_notify.integral)

                } else {
                    log('评论新闻:' + data.message)
                }
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}

// 使用本地服务
async function useLocalService() {
    requID = RandeCode()
    return new Promise((resolve) => {
        var options = {
            method: "post",
            url: `${url}/user_mumber/doTask`,
            headers: {
                'X-ACCOUNT-ID': sessionId,
                'X-SESSION-ID': sessionId,
                "X-REQUEST-ID": requID,
                'X-TIMESTAMP': +new Date(),
                "X-SIGNATURE": SHA256_Encrypt(`/api/user_mumber/doTask&&${sessionId}&&${requID}&&${+new Date()}&&FR*r!isE5W&&${tenantId}`),
                "X-TENANT-ID": tenantId,
                "User-Agent": "1.5.1;00000000-67da-9a7e-0000-00003dbe4550;OPPO PCAM00;Android;10;Release",
                "Content-Type": "application/x-www-form-urlencoded",
                Host: 'vapp.tmuyun.com',

            },
            data: {
                "memberType": "6",
                "member_type": "6",
            }

        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url =============== `);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {
            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】=============== 这是 返回data ============== `);
                    log(JSON.stringify(response.data));
                }
                if (data.hasOwnProperty("data") == true) {
                    log('积分:' + data.data.score_notify.integral)

                } else {
                    log('使用本地服务:' + data.message)
                }
            } catch (e) {
                log(`异常：${e}，原因：${e.msg} `)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            resolve()
        })
    })

}
function randomNumber(Min, Max) {
    return (Min + Math.round(Math.random() * (Max - Min)));
}

// 随机中文
function randomWord(randomFlag, min, max) {
    var str = "",

        range = min,
        arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
        pos = 0,
        index = 0;
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

// 随机26个英文字母
function randomWord2(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
        pos = 0,
        index = 0;
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

// 检测变量
async function Envs() {
    if (xstlhd) {
        if (xstlhd.indexOf("@") != -1) {
            xstlhd.split("@").forEach((item) => {
                xstlhdArr.push(item);
            });
        } else if (xstlhd.indexOf("\n") != -1) {
            xstlhd.split("\n").forEach((item) => {
                xstlhdArr.push(item);
            });
        } else {
            xstlhdArr.push(xstlhd);
        }
    } else {
        log(`\n 【${$.name}】：未填写变量 xstlhd`)
        return;
    }

    return true;
}

function timestampToTime(time) {
    const dt = new Date(time);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + "").padStart(2, "0");
    const d = (dt.getDate() + "").padStart(2, "0");

    const hh = (dt.getHours() + "").padStart(2, "0");
    const mm = (dt.getMinutes() + "").padStart(2, "0");
    const ss = (dt.getSeconds() + "").padStart(2, "0");

    return `${y} -${m} -${d} ${hh}:${mm}:${ss} `;
}

var CryptoJS = CryptoJS || (function (Math, undefined) {
    var crypto;
    if (typeof window !== 'undefined' && window.crypto) {
        crypto = window.crypto;
    }
    if (typeof self !== 'undefined' && self.crypto) {
        crypto = self.crypto;
    }
    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
        crypto = globalThis.crypto;
    }
    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
        crypto = window.msCrypto;
    }
    if (!crypto && typeof global !== 'undefined' && global.crypto) {
        crypto = global.crypto;
    }
    if (!crypto && typeof require === 'function') {
        try {
            crypto = require('crypto');
        } catch (err) { }
    }
    var cryptoSecureRandomInt = function () {
        if (crypto) {
            if (typeof crypto.getRandomValues === 'function') {
                try {
                    return crypto.getRandomValues(new Uint32Array(1))[0];
                } catch (err) { }
            }
            if (typeof crypto.randomBytes === 'function') {
                try {
                    return crypto.randomBytes(4).readInt32LE();
                } catch (err) { }
            }
        }
        throw new Error('Native crypto module could not be used to get secure random number.');
    };
    var create = Object.create || (function () {
        function F() { }
        return function (obj) {
            var subtype;
            F.prototype = obj;
            subtype = new F();
            F.prototype = null;
            return subtype;
        };
    }());
    var C = {};
    var C_lib = C.lib = {};
    var Base = C_lib.Base = (function () {
        return {
            extend: function (overrides) {
                var subtype = create(this);
                if (overrides) {
                    subtype.mixIn(overrides);
                }
                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                    subtype.init = function () {
                        subtype.$super.init.apply(this, arguments);
                    };
                }
                subtype.init.prototype = subtype;
                subtype.$super = this;
                return subtype;
            }, create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
            }, init: function () { }, mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            }, clone: function () {
                return this.init.prototype.extend(this);
            }
        };
    }());
    var WordArray = C_lib.WordArray = Base.extend({
        init: function (words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        }, toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        }, concat: function (wordArray) {
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;
            this.clamp();
            if (thisSigBytes % 4) {
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else {
                for (var j = 0; j < thatSigBytes; j += 4) {
                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
                }
            }
            this.sigBytes += thatSigBytes;
            return this;
        }, clamp: function () {
            var words = this.words;
            var sigBytes = this.sigBytes;
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        }, clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);
            return clone;
        }, random: function (nBytes) {
            var words = [];
            var r = (function (m_w) {
                var m_w = m_w;
                var m_z = 0x3ade68b1;
                var mask = 0xffffffff;
                return function () {
                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
                    var result = ((m_z << 0x10) + m_w) & mask;
                    result /= 0x100000000;
                    result += 0.5;
                    return result * (Math.random() > .5 ? 1 : -1);
                }
            });
            var RANDOM = false, _r;
            try {
                cryptoSecureRandomInt();
                RANDOM = true;
            } catch (err) { }
            for (var i = 0, rcache; i < nBytes; i += 4) {
                if (!RANDOM) {
                    _r = r((rcache || Math.random()) * 0x100000000);
                    rcache = _r() * 0x3ade67b7;
                    words.push((_r() * 0x100000000) | 0);
                    continue;
                }
                words.push(cryptoSecureRandomInt());
            }
            return new WordArray.init(words, nBytes);
        }
    });
    var C_enc = C.enc = {};
    var Hex = C_enc.Hex = {
        stringify: function (wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }
            return hexChars.join('');
        }, parse: function (hexStr) {
            var hexStrLength = hexStr.length;
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }
            return new WordArray.init(words, hexStrLength / 2);
        }
    };
    var Latin1 = C_enc.Latin1 = {
        stringify: function (wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }
            return latin1Chars.join('');
        }, parse: function (latin1Str) {
            var latin1StrLength = latin1Str.length;
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }
            return new WordArray.init(words, latin1StrLength);
        }
    };
    var Utf8 = C_enc.Utf8 = {
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        }, parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        reset: function () {
            this._data = new WordArray.init();
            this._nDataBytes = 0;
        }, _append: function (data) {
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        }, _process: function (doFlush) {
            var processedWords;
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }
            var nWordsReady = nBlocksReady * blockSize;
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    this._doProcessBlock(dataWords, offset);
                }
                processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }
            return new WordArray.init(processedWords, nBytesReady);
        }, clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();
            return clone;
        }, _minBufferSize: 0
    });
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        cfg: Base.extend(),
        init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
            this.reset();
        }, reset: function () {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
        }, update: function (messageUpdate) {
            this._append(messageUpdate);
            this._process();
            return this;
        }, finalize: function (messageUpdate) {
            if (messageUpdate) {
                this._append(messageUpdate);
            }
            var hash = this._doFinalize();
            return hash;
        }, blockSize: 512 / 32,
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
            };
        }, _createHmacHelper: function (hasher) {
            return function (message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
        }
    });
    var C_algo = C.algo = {};
    return C;
}(Math));

(function (Math) {
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;
    var H = [];
    var K = [];
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }
            return true;
        }
        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }
        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
                nPrime++;
            }
            n++;
        }
    }());
    var W = [];
    var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
        }, _doProcessBlock: function (M, offset) {
            var H = this._hash.words;
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^ ((gamma0x << 14) | (gamma0x >>> 18)) ^ (gamma0x >>> 3);
                    var gamma1x = W[i - 2];
                    var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^ ((gamma1x << 13) | (gamma1x >>> 19)) ^ (gamma1x >>> 10);
                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }
                var ch = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);
                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));
                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        }, _doFinalize: function () {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            this._process();
            return this._hash;
        }, clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
        }
    });
    C.SHA256 = Hasher._createHelper(SHA256);
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
}(Math));

function SHA256_Encrypt(word) {
    return CryptoJS.SHA256(word).toString();
}



function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);

    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? { url: t } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }

        get(t) {
            return this.send.call(this.env, t)
        }

        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }

    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
        }

        isQuanX() {
            return "undefined" != typeof $task
        }

        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }

        isLoon() {
            return "undefined" != typeof $loon
        }

        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }

        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }

        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {
            }
            return s
        }

        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }

        getScript(t) {
            return new Promise(e => {
                this.get({ url: t }, (t, s, i) => e(i))
            })
        }

        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: { script_text: t, mock_type: "cron", timeout: r },
                    headers: { "X-Key": o, Accept: "*/*" }
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
            return r
        }

        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }

        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }

        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }

        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }

        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }

        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }

        get(t, e = (() => {
        })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => {
                const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                e(null, { status: s, statusCode: i, headers: r, body: o }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                e(null, { status: s, statusCode: i, headers: r, body: o }, o)
            }, t => {
                const { message: s, response: i } = t;
                e(s, i, i && i.body)
            }))
        }

        post(t, e = (() => {
        })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => {
                const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                e(null, { status: s, statusCode: i, headers: r, body: o }, o)
            }, t => e(t)); else if (this.isNode()) {
                this.initGotEnv(t);
                const { url: s, ...i } = t;
                this.got.post(s, i).then(t => {
                    const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                    e(null, { status: s, statusCode: i, headers: r, body: o }, o)
                }, t => {
                    const { message: s, response: i } = t;
                    e(s, i, i && i.body)
                })
            }
        }

        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }

        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
                        return { openUrl: e, mediaUrl: s }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
                        return { "open-url": e, "media-url": s }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return { url: e }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}