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

# <span style="font-size: 24px; color: #e55343; font-family: Noto Serif SC, Songti SC, SimSun, serif">一、AWGN</span>

![通信系统](/uploads/pasted-image-1793849291127.png "通信系统")

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px">　　图中的通信系统可以概括为：数据源产生二进制比特，基带调制将比特映射为可输出信号，发射机将其发送出去，信号经过AWGN信道时，会受到随机噪声的干扰，被叠加一高斯白噪声n(t)，随后接收机接收，解调器解调，最终还原为原始比特。</span>

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px">　　AWGN全称是Additive White Gaussian Noise，翻译为加性高斯白噪声，其核心表达式为：r(t) = s(t) + n(t),其中n(t)是信道中的高斯白噪声。若采用BPSK（二进制相控键移）调制，其使用两种相差180°的载波相位分别代表二进制0和1，也就是说比特1会发送+1而比特0会发出-1，当噪声达到一定程度时，便会使得接收机误判而产生误码。</span>

![相关接收机](/uploads/pasted-image-1793940216958.png "相关接收机")

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px">　　这是一个常见的相关接收机结构，输出信号首先由Bit mapping映射为每比特能量</span>$\sqrt{E_b}$<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px"> ,接下来将其与基函数相乘，形成发送波形，途中高斯噪声n(t)被添加，接收端使用相同基函数相乘，最后在一个符号周期内积分并在t＝Ts时抽样，最终得到离散的接受信号，因此有</span>：

<figure class="firefly-aligned-image" data-align="center"><img src="/uploads/20261106-122617.png" alt="推导过程" title="推导过程" /><figcaption>推导过程</figcaption></figure>

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px">　　也就是说，</span><span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px; background-color: #f7db22">连续时间的带噪信号，经过接收机处理后，可以简化成一个离散的随机变量。</span>

# <span style="color: #e55848; font-size: 24px; font-family: Noto Serif SC, Songti SC, SimSun, serif">二、调制与信道编码的重要性</span>

<span style="font-family: PingFang SC, Microsoft YaHei, sans-serif; font-size: 16px">　　上文说到的BPSK 全称是 Binary Phase Shift Keying，即二进制相移键控，其使用两种相差180°的载波相位分别代表二进制0和1，即：</span>

<figure class="firefly-aligned-image" data-align="center"><img src="/uploads/pasted-image-1793954367879.png" alt="" title="" /></figure>

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px">　　由上文所述，实际上无论是何种调制方法，都会有极大的可能性产生误码，因此信道编码在信息传输中就具有很高的重要性，</span><span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 16px; color: #ed3f2c">其利用增加的冗余信息，在噪声存在时尽可能的恢复正确的数据。</span>

<figure class="firefly-aligned-image" data-align="center"><img src="/uploads/pasted-image-1793954401734.png" alt="信息传输链路" title="" /></figure>
