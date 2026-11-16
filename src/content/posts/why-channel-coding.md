---
title: why channel coding
published: 2026-11-15
updated: 2026-11-16
description: ''
image: /uploads/pasted-image-1794803072657.png
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

<span style="font-size: 18px; font-family: Noto Serif SC, Songti SC, SimSun, serif">　　首先我们需要计算每比特能量 </span>$E_b$<span style="font-size: 18px; font-family: Noto Serif SC, Songti SC, SimSun, serif">,有，</span>

$$
P=E_b/T_b
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　其中P为平均信号功率，</span>$T_b$<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px"> 为传输一个比特所用的时间，那么比特速率为</span>：

$$
R_b=1/T_b
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　所以：</span>

$$
E_b=P/R_b
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　带入题目数据后可以算出：</span>

$$
E_b=\frac{1e-3}{1e6}=1e-9J
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　接下来我们计算一个重要的值：</span>

$$
E_b/N_0
$$

<span style="font-size: 18px; font-family: Noto Serif SC, Songti SC, SimSun, serif">　　这个量对信道编码来说尤为重要，它衡量了每比特信号能量与噪声功率谱密度的比值，带入我们刚刚算出的结果，可以得到这个比值为5.我们将其转化为分贝</span>值：

$$
(\frac{E_b}{N_0})_{dB}=10log_{10}(\frac{E_b}{N_0})
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">带入后得到结果大约为7dB.</span>

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　对于 AWGN 信道中的相干 BPSK 系统，有一个非常重要的公</span><span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">式：</span>

$$

P_B=Q\left(\sqrt{\frac{2E_b}{N_0}}\right)

$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif">　</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">　其中Q（x)是高斯函数，它被用来计算高斯分布的尾部概率，有，</span>

$$

Q(x)=\frac{1}{\sqrt{2\pi}}\int_x^{+\infty}e^{-t^2/2}\,dt

$$

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　现在我们可以将上面的计算结果带入，并查Q函数表，得到：</span>

$$
P_b=7.83e-4=0.0783\%
$$

　<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　这意味着每传输100万比特，会有783个比特出错。显然这个误码率已经远高于我们的目标误码率，在1mW传输功率下，误码率大约是目标误码率的7.83倍。</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px; color: #e13f2d">增大发射功率可以大幅度降低误码率</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">，因为它使得信号的幅度被拉大，使得接受端更不容易误判，</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px; color: #e34231">但如果发射功率一定，就需要使用信道编码这一手段了。</span>

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　我们使用经典的（7，4，1）汉明码（Hamming code) 举例，参数为 (n ,k ,t) 的汉明码，n=7代表每个编码后的码字为7比特，k=4代表每个编码携带4比特原始信息，t=1代表最多可以保证纠正一个比特错误。也就是说，如果原始信息为1011，经过汉明编码后的信息为：</span>

$$

\underbrace{1011}_{\text{4位信息}}
\xrightarrow{\text{编码}}
\underbrace{0110011}_{\text{7位码字}}

$$

　<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　这里的0110011是采用一种常见的偶校验汉明码位序得到的示例。编码器增加了3个校验比特，所以码率为：</span>

$$

{R=\frac{k}{n}=\frac47\approx0.5714}

$$

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　这3个额外比特就是纠错的关键。</span>
