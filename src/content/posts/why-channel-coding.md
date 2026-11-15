---
title: why channel coding
published: 2026-11-15
updated: 2026-11-15
description: ''
image: ''
category: ''
tags: []
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

<span style="font-family: Times New Roman, Times, serif; font-size: 16px">　</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">　如果想了解信道编码的实际功效，我们先从这个例题看起：已知 BPSK 通信系统的传输速率、发射功率和噪声功率谱密度，计算系统的误码率（BER），并判断是否满足要求。已知目标误码率 </span>$P_b$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为1e-5，平均每10万个比特错1个比特；比特传输速率 </span>$R_b$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为 1Mbps，每秒可以传输 1e6 个比特，最大发射功率 </span>$P_{max}$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为 1mW，噪声功率谱密度 </span>$N_0$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为 2e-10W/Hz，它描述了噪声强度。</span>

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　现在我们需要知道，1：当发射功率1mW时，实际的误码率是多少；2：误码率能否达到目标误码率</span><span style="font-size: 18px">？</span>

首先我们需要计算每比特能量 $E_b$,有，

$$
P=E_b/T_b
$$

其中P为平均信号功率，$T_b$ 为传输一个比特所用的时间，那么比特速率为：

$$
R_b=1/T_b
$$

所以：

$$
E_b=P/R_b
$$

带入题目数据后可以算出：

$$
E_b=1e-3/1e6=1e-9J
$$

接下来我们计算一个重要的值：

$$
E_b/N_0
$$

这个量对信道编码来说尤为重要，它衡量了每比特信号能量与噪声功率谱密度的比值，带入我们刚刚算出的结果，可以得到这个比值为5.我们将其转化为分贝值：

$$
{E_b/N_0}_{dB}=10log_{10}{（E_b/N_0）}
$$

带入后得到结果大约为7dB.
