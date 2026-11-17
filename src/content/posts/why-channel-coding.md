---
title: why channel coding——以汉明码举例
published: 2026-11-15
updated: 2026-11-17
description: 计算了误码率例题，分析74汉明码原理并计算了编码后误码率
image: /uploads/pasted-image-1794803072657.png
category: 科研
tags:
  - 科研
draft: false
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

# <span style="font-family: Times New Roman, Times, serif; font-size: 16px">　</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">　</span><span style="font-family: Times New Roman, Times, serif; font-size: 24px">一、误码率计算</span>

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　如果想了解信道编码的实际功效，我们先从这个例题看起：已知 BPSK 通信系统的传输速率、发射功率和噪声功率谱密度，计算系统的误码率（BER），并判断是否满足要求。已知目标误码率 </span>$P_b$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为1e-5，平均每10万个比特错1个比特；比特传输速率 </span>$R_b$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为 1Mbps，每秒可以传输 1e6 个比特，最大发射功率 </span>$P_{max}$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为 1mW，噪声功率谱密度 </span>$N_0$<span style="font-family: Times New Roman, Times, serif; font-size: 18px"> 为 2e-10W/Hz，它描述了噪声强度。</span>

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

# <span style="font-size: 24px; font-family: Times New Roman, Times, serif">二、（7，4）汉明码原理</span>

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

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　这3个额外比特就是纠错的关键。原始信息为1011，而经典的7位汉明码会在第1，2，4位添加校验位p，而剩余的3，5，6，7位则是原始信息d1-d4。</span>

<figure class="firefly-aligned-image" data-align="center"><img src="/uploads/pasted-image-1794833547825.png" alt="" title="" /><figcaption>7位汉明码</figcaption></figure>

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　接下来确定校验位，我们使用偶校验，每一组参与校验的比特中，1的个数必须为偶数，3个额外比特分别对4位原始数据中的3位进行校验，P1负责校验第124位，由于是偶校验，有：</span>

$$
P_1\oplus d_1\oplus d_2\oplus d_4=0
$$

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　对比原始数据可知，P1=0相对的，P2负责校验第1，3，4位，P4负责校验2，3，4位，同样根据异或运算可知，P2=1，P4=0，这样我们就得到了完整的码字：</span>

<figure class="firefly-aligned-image" data-align="center"><img src="/uploads/pasted-image-1794847285509.png" alt="" title="" /><figcaption>完整7位码字</figcaption></figure>

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　关于三位校验码负责校验的位数，实际上设计的非常精妙：3个二进制数刚好拥有8种排列组合方式，抛去代表无错的000，剩下的7种则刚好可以校验出7个位置的错误，汉明码设计的核心就是可以让每个位置的校验结果等于它自己的二进制编号。如图：</span>

<figure class="firefly-aligned-image" data-align="center"><img src="/uploads/pasted-image-1794883620534.png" alt="" title="" /><figcaption>二进制编号</figcaption></figure>

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">例如，个位为1的数字为001，011，101，111，刚好被对应1，3，5，7，这便是P1负责校验的位数，P2，P4也以此类推，例如5号位置发生了翻转，由0变为1，接收端负责校验的S1对P1，d1, d2, d4进行偶校验，显然校验失败，由此类推，S2校验成功，S3由于包含第5位，也校验失败，最终得到二进制数位101，刚好对应第5位。这样，接收端将第5位进行翻转，便可以重新得到正确的信息，由于进行了偶校验，因此只能最多检查出1位错误，如果超过1位，将无法进行纠错。</span>

# <span style="font-size: 24px; font-family: Times New Roman, Times, serif">三、编码后的误码率</span>

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　对编码后的误码率进行近似计算，有公式：</span>

$$
P_B \approx \sum_{j=2}^{7} \frac{j}{7} \binom{7}{j} p^j (1-p)^{7-j}
$$

<span style="font-family: Times New Roman, Times, serif; font-size: 18px">　　其中当j≥2时会发生误码，误码的概率服从二项分布，而由比特误码率推广到码字时，我们需再乘以j/7。考虑所有情况后，得到74汉明码误码率公式为：</span>

$$
\begin{aligned}
P_B &= 9p^2(1-p)^5&\quad + 19p^3(1-p)^4 \
&\quad + 16p^4(1-p)^3 \
&\quad + 12p^5(1-p)^2 \
&\quad + 7p^6(1-p) + p^7
\end{aligned}
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　接下来我们重新计算译码前的误码率，由于码率下降到了</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">4/7</span><span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">，因此传输速率为：</span>

$$
R_c=R_b/R=1.75Mbps
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　每编码比特能量为：</span>

$$
E_c=P/R_c=5.714e-10J
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　带入误码率公式：</span>

$$
P=Q\left(\sqrt{\frac{2E_c}{N_0}}\right)
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　</span><span style="font-family: Times New Roman, Times, serif; font-size: 18px">查表后得到，P=8.41e-3，这是经过BPSK解调，但尚未译码的误码率，将其带入误码率公式最终可以计算得到:</span>

$$
P_B=6.22e-4
$$

<span style="font-family: Noto Serif SC, Songti SC, SimSun, serif; font-size: 18px">　　对比发现误码率确实发生了下降，但是依旧尚未达到目标误码率，这是因为加入校验比特虽然增强了纠错能力，却同时降低了每个传输比特的能量。纠错能力带来的收益，必须超过码率下降带来的能量损失，才能获得真正的编码增益。</span>
