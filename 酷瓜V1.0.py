"""
酷瓜小程序，目测每天0.4
请配合ipad过检软，自行更改37行链接为自己过检穿透地址
环境变量：kugua
格式：备注#wxid，多号换行
"""

import os
import requests
import concurrent.futures


class KuGua:

    def __init__(self, data):
        self.token = ""
        self.wxid = data["wxid"]
        self.index = data["index"]
        self.name = data["name"]
        self.openid = ""
        self.code = ""
        self.tasks = []
        self.headers = {
            "charset": "utf-8",
            "User-Agent": "Mozilla/5.0 (Linux; Android 14; 23013RK75C Build/UKQ1.230804.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220099 MMWEBSDK/20231202 MMWEBID/7473 MicroMessenger/8.0.47.2560(0x28002F36) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64 MiniProgramEnv/android",
            "content-type": "application/json",
            "Accept-Encoding": "gzip,compress,br,deflate",
            "Referer": "https://servicewechat.com/wx1f9fc8e79fcbce16/93/page-frame.html",
        }

    def get_code(self):
        # 取code
        try:
            data = {"Appid": "wx1f9fc8e79fcbce16", "Wxid": self.wxid}
            r = requests.post(
                f"http://127.0.0.1:12221/VXAPI/Wxapp/JSLogin", json=data
            ).json()
            if r["Message"] == "成功":
                print(f"账户[{self.index}][{self.name}]获取code成功✅ :",r['Data']['code'])
                self.code = r["Data"]["code"]
                return True
            else:
                print(f"账户[{self.index}][{self.name}]获取code失败❌ :", r["Message"])
                return False
        except Exception as e:
            if ConnectionError in str(e):
                print(
                    f"账户[{self.index}][{self.name}]获取code失败!无法连接云端❌ ",
                )
                return False
            print(f"账户[{self.index}][{self.name}]获取code失败❌ :", e)
            return False

    def get_tasks(self):
        data = {
            "token": self.token,
            "appid": "wx1f9fc8e79fcbce16",
            "openid": self.openid,
        }
        r = requests.post(
            "https://www.kugua.com/wxapp/dailyTaskv2/index",
            headers=self.headers,
            json=data,
        ).json()
        if r["status"] == "0000":
            for item in r["data"]:
                self.tasks.append(
                    {"type": item["inflated_type"], "name": item["task_name"]}
                )
            print(f"账户[{self.index}][{self.name}] 获取到{len(r['data'])}个任务！")
            return True
        else:
            print(f"账户[{self.index}][{self.name}] 获取任务失败！检查账号信息是否正确！")
            print(r)
            return False

    def login(self):
        data = {
            "openCode": self.code,
            "code_ticket": "",
            "share_customid": "",
            "share_unionid": "",
            "surce_code": "",
        }
        r = requests.post("https://www.kugua.com/wxapp/openidLogin",headers=self.headers,json=data).json()
        if r["status"] == "0000":
            self.token = r["data"]['user']["token"]
            self.openid = r["data"]['user']["openid"]
            print(f"账户[{self.index}][{self.name}] 登录成功！")
            return True
        else:
            print(f"账户[{self.index}][{self.name}] 登录失败！检查账号信息是否正确！")
    def do_task(self):
        for task in self.tasks:
            data = {
                "type": task["type"],
                "token": self.token,
                "appid": "wx1f9fc8e79fcbce16",
                "openid": self.openid,
            }
            r = requests.post(
                "https://www.kugua.com/wxapp/inflatedv3/popUpRedEnvelopes",
                headers=self.headers,
                json=data,
            ).json()
            if r["status"] == "0000":
                if not r["data"]["dialog"]:
                    print(f"账户[{self.index}][{self.name}] 今日已完成所有任务！❌")
                    return
                taskid = r["data"]["dialogId"]
                print(f"账户[{self.index}][{self.name}] 开始执行任务：{task['name']}")
                data = {
                    "dialogId": taskid,
                    "token": self.token,
                    "appid": "wx1f9fc8e79fcbce16",
                    "openid": self.openid,
                    "dialogId": taskid,
                }
                r = requests.post(
                    "https://www.kugua.com/wxapp/inflatedv3/receiveRedEnvelopes",
                    headers=self.headers,
                    json=data,
                ).json()
                if r["status"] == "0000":
                    print(f"账户[{self.index}][{self.name}] 任务执行成功！✅: {r['codemsg']}")
                else:
                    print(f"账户[{self.index}][{self.name}] 任务执行失败！❌: {r['codemsg']}")
            else:
                print(f"账户[{self.index}][{self.name}] 获取任务失败！❌: {r['codemsg']}")
        print(f"账户[{self.index}][{self.name}] 任务执行完毕！")
        print("-" * 49)

    def run(self):
        if self.get_code():
            if self.login():
                if self.get_tasks():
                    self.do_task()


if __name__ == "__main__":

    #os.environ["kugua"] = "tset#wxidxxxxnqpmtbf22"

    kugua = os.environ.get("kugua").split("\n")
    threads = 1

    if kugua is None:
        # 如果账号信息未配置，则打印提示信息并展示邀请链接
        print("未找到环境变量！")
    else:
        # 如果账号信息已配置，则解析账号信息并执行任务
        num_of_accounts = len(kugua)
        # 打印账号数量和邀请链接
        print(
            f"汐念友情出品，当前脚本版本：酷瓜1.0 \n获取到 {num_of_accounts} 个账号。使用{threads}个并发"
        )
        i = 0

        def process_account(account):
            global i
            i += 1
            # print(values)
            account = account.split("#")
            if len(account) != 2:
                print("变量错了二逼")
            data = {
                "wxid": account[1],
                "name": account[0],
                "index": i,
            }
            try:
                api = KuGua(data)
                api.run()

            except Exception as e:
                print(f"账号[{i}]出错啦:", e)

        # 设置自定义的线程数
        custom_thread_count = int(threads)

        with concurrent.futures.ThreadPoolExecutor(
            max_workers=custom_thread_count
        ) as executor:

            for account in kugua:
                executor.submit(process_account, account)

        print("-" * 50)
        print("所有任务执行完毕！")
