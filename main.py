# -*- coding: utf-8 -*-
import requests
import json
import os
import tablib
import threading
import datetime
import time

area = []
city = []
province = []
areaunique = []
cityunique = []
provinceunique = []

def _readfile(path):
    files = os.listdir(path)
    for filename in files:
        _openjson(filename[0:filename.rfind('.json')], path + filename)


def _openjson(dirName, filepath):
    jsonpath = './json/' + dirName
    if not os.path.exists(jsonpath):
        print('不存在' + jsonpath + '文件夹将创建')
        os.makedirs(jsonpath)
    wordpath = './xls/' + dirName
    if not os.path.exists(wordpath):
        print('不存在' + wordpath + '文件夹将创建')
        os.makedirs(wordpath)
    with open(filepath, 'r', encoding='utf-8') as load_f:

        load_dict = json.load(load_f)
        if 'province' in filepath:
            # 省级json数据需要单独处理
            for i in load_dict:
                province.append(load_dict[i]['name'])
            for element in province:
                if (element not in provinceunique):
                    provinceunique.append(element)
            # message2qmsg(','.join(provinceunique),'province')
            # _requests(provinceunique,'province')
        elif 'city' in filepath:
            for i in load_dict:
                for k in load_dict[i]:
                    city.append(load_dict[i][k]['name'])
            for element in province:
                if (element not in cityunique):
                    cityunique.append(element)
            # message2qmsg(','.join(cityunique),'city')
            _requests(cityunique,'city')
        else:
            for i in load_dict:
                for k in load_dict[i]:
                    area.append(load_dict[i][k]['name'])
            for element in area:
                if (element not in areaunique):
                    areaunique.append(element)
            # message2qmsg(','.join(areaunique),'area')
            _requests(areaunique,'area')


    # print('province',province)
    # threads = [threading.Thread(target=_requests, args=('province',name, )) for name in province]
    # for t in threads:
    #     t.start()  # 启动一个线程
    # for t in threads:
    #     t.join()  # 等待每个线程执行结束
    # threads2 = [threading.Thread(target=_requests, args=('city', name,)) for name in city]
    # for c in threads2:
    #     c.start()  # 启动一个线程
    # for c in threads2:
    #     c.join()  # 等待每个线程执行结束
    # threads3 = [threading.Thread(target=_requests, args=('area', name,)) for name in area]
    # for j in threads3:
    #     j.start()  # 启动一个线程
    # for j in threads3:
    #     j.join()  # 等待每个线程执行结束

def _requests(dirName, name):
    for k in dirName:
        print(k,name)
        print('开始爬取' + k + '小姐姐数据')
        url = 'http://nba98.top/yd/ydajax/GetInfoListByKey?type=1&pageNo=1&pageSize=2000&k='+k
        headers = {
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36'
        }
        keep = True
        maxtimes = 15
        count = 0
        print(datetime.datetime.now(),k)
        while keep and count < maxtimes:
            try:
                request = requests.get(url, headers, timeout=(3.05, 27))
                print('爬取成功' + str(count) + k)
                # print(request.text)
                json_text = str(request.text)
                print(os.path.join(k + '.json') + '文件不存在,自动创建')
                    # print('待写入小姐姐数据' + name, json_text)
                file = open(os.path.join('./json/' + name + '/' + k + '.json'), 'w', encoding="utf-8")
                file.write(json_text)
                file.close()
                print(os.path.join(k + '.json') + '文件创建并写入成功')
                print('开始写入' + k + '.xls')
                _savexsl(name, k)
                keep = False
            except Exception as e:
                print(datetime.datetime.now(),k)
                # 延时10s后重试
                time.sleep(10)
                count = count + 1
                print('重试' + str(count) +k)
                print(url)
        print(datetime.datetime.now())

def _savexsl(dirName, name):
    with open(os.path.join('./json/' + dirName + '/' + name + '.json'), 'r', encoding='utf-8') as f:
        rows = json.load(f)
        xsldata = rows['data']
        lenlist = len(xsldata)
        if lenlist != 0:
            header = tuple([i for i in xsldata[0].keys()])
            data = []
            for row in xsldata:
                body = []
                for v in row.values():
                    body.append(v)
                data.append(tuple(body))
            data = tablib.Dataset(*data, headers=header)
            print(os.path.join(name + '.xls') + '文件不存在,自动创建')
            open(os.path.join('./xls/' + dirName + '/' + name + '.xls'), 'wb').write(data.xls)
            print(name + '.xls文件写入完成')
        else:
            print(os.path.join('./json/' + dirName + '/' + name + '.json') + "数据为空,不写入xsl")

# def message2server(sckey, content):
#     print("server 酱推送开始")
#     data = {"text": "每日签到", "desp": content.replace("\n", "\n\n")}
#     requests.post(url=f"https://sc.ftqq.com/{sckey}.send", data=data)
#     return
#
# def message2server_turbo(sendkey, content):
#     print("server 酱 Turbo 推送开始")
#     data = {"text": "每日签到", "desp": content.replace("\n", "\n\n")}
#     requests.post(url=f"https://sctapi.ftqq.com/{sendkey}.send", data=data)
#     return
#
# def message2qmsg(content,type):
#     print("qmsg 酱推送开始",type,datetime.datetime.now())
#     params = {"msg": content}
#     res = requests.post(url="https://qmsg2.zendee.cn/send/34f6724a53c3f973d664281db83e4b16", params=params)
#     print("qmsg 酱推送完成",type,datetime.datetime.now(),res.text,res)
#     # return



if __name__ == '__main__':
    path = './json/location/'
    if os.path.exists(path):
        print('检测到省市区json文件,将开始抓取数据')
        _readfile(path)
    else:
        print('未检测到省市区json文件,将开始获取省市区信息')
        os.system("python ./city.py")
        _readfile(path)
