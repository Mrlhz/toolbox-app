# Toolbox 工具箱

清理指定目录的的广告文件

### 使用

- 清理广告文件

```s
# cmd进入清理路径，默认处理当前路径
t c

# or d: dirname r: recycleBin
t c  -d=F:\ads -r=F:\ads

# 帮助
t
t -h
t --help

# Do not do this
# 在F: 
t c
t c  -d=F:\ -r=F:\

# 路径有空格
t c -r='F:\喵糖映画\镜酱 2B白色婚纱 希尔 [33P367MB]'
```


- 文件夹扁平化

```s
# global default 
# cd target path
t flat
# alias
t f

# before
# i want to get the target directory
example
├── bar
│   └── 02
│       └── 03
│           └── target2
│               ├── 03.txt
│               └── 04.txt
└── foo
    └── 01
        └── 02
            └── 03
                └── target1
                    ├── 01.txt
                    └── 02.txt

# after
example
├── bar
│   └── 02
│       └── 03
├── foo
│   └── 01
│       └── 02
│           └── 03
├── target1
│   ├── 01.txt
│   └── 02.txt
└── target2
    ├── 03.txt
    └── 04.txt
```
