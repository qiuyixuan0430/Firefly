---
title: 对AWGN信道模型的理解
published: 2026-11-05
updated: 2026-11-05
description: AWGN信道模型（高斯加性白噪声）
image: /uploads/pasted-image-1793849291127.png
category: 科研
tags:
  - 科研
draft: true
pinned: false
comment: true
author: Siyue
lang: ''
sourceLink: ''
licenseName: ''
licenseUrl: ''
password: ''
passwordHint: ''
---

![通信系统](/uploads/pasted-image-1793849291127.png "通信系统")

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px">　　图中的通信系统可以概括为：数据源产生二进制比特，基带调制将比特映射为可输出信号，发射机将其发送出去，信号经过AWGN信道时，会受到随机噪声的干扰，被叠加一高斯白噪声n(t)，随后接收机接收，解调器解调，最终还原为原始比特。</span>

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px">　　AWGN全称是Additive White Gaussian Noise，翻译为加性高斯白噪声，其核心表达式为：r(t) = s(t) + n(t),其中n(t)是信道中的高斯白噪声。若采用BPSK（二进制相控键移）调制，其使用两种相差180°的载波相位分别代表二进制0和1，也就是说比特1会发送+1而比特0会发出-1，当噪声达到一定程度时，便会使得接收机误判而产生误码。</span>

![相关接收机](/uploads/20261106-121435.png "相关接收机")

这是一个常见的相关接收机结构，输出信号首先由Bit mapping映射为每比特能量
