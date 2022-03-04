# nba98爬虫

#### 介绍
将nba98的信息爬取并保存为json和xls文件,可以爬取大到省市区,小到街道居民楼的小姐姐信息,也许她就在你的身边,也许她就是你的女神~

#### 软件架构
python


#### 安装教程

```bash
git clone https://gitee.com/first-love-cloud/nba98.git && cd nba98 && pip install -r requirements.txt
```

#### 使用说明

##### 1. 获取省市区
```bash
python city.py
```
##### 2. 获取小姐姐信息
```bash
python main.py
```
##### 3.爬取json结果

##### 1.[省级json数据](https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/json/province/)
##### 2.[市级json数据](https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/json/city/)
##### 3.[区县json数据](https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/json/area/)

##### 3.爬取xls结果
##### 1.[省级xsl数据](https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/xls/province/)
##### 2.[市级xsl数据](https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/xls/city/)
##### 3.[区县xsl数据](https://cdn.jsdelivr.net/gh/first-love-cloud/nba98@master/xls/area/)



#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
