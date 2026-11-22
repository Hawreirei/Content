import soundfile as sf, numpy as np, json, sys
L=[l.strip() for l in open('vo/el/lines.txt') if l.strip()]
x,sr=sf.read('vo/el/full.wav'); h=int(.01*sr)
e=np.array([np.sqrt((x[i:i+h]**2).mean()) for i in range(0,len(x)-h,h)]); db=20*np.log10(e+1e-9); thr=db.max()-38
sil=db<thr
runs=[]; i=0
while i<len(sil):
    j=i
    while j<len(sil) and sil[j]==sil[i]: j+=1
    runs.append((bool(sil[i]),i*.01,j*.01)); i=j
# speech segments separated by silences >= .15
segs=[]; cur=None
for s,a,b in runs:
    if not s:
        if cur is None: cur=[a,b]
        else: cur[1]=b
    else:
        if b-a>=.15 and cur is not None: segs.append(cur); cur=None
if cur: segs.append(cur)
S=len(segs); n=len(L)
def exp(s): return len(s.replace('...',''))/14.5 + s.count('...')*.35 + s.count('.')*.1
E=[exp(s) for s in L]
INF=1e18; dp=np.full((n+1,S+1),INF); bk=np.zeros((n+1,S+1),int); dp[0][0]=0
for k in range(1,n+1):
    for j in range(k,S+1):
        for i in range(k-1,j):
            if dp[k-1][i]>=INF: continue
            d=segs[j-1][1]-segs[i][0]; c=dp[k-1][i]+(d-E[k-1])**2/E[k-1]
            if c<dp[k][j]: dp[k][j]=c; bk[k][j]=i
j=S; cuts=[]
for k in range(n,0,-1): i=bk[k][j]; cuts.append((i,j)); j=i
cuts=cuts[::-1]; out=[]
for k,(i,j) in enumerate(cuts):
    a,b=segs[i][0],segs[j-1][1]; out.append({'id':f'v{k+1:02}','a':round(a,2),'b':round(b,2),'segs':[[round(s[0],2),round(s[1],2)] for s in segs[i:j]]})
    print(f"v{k+1:02} {a:6.2f}-{b:6.2f} d={b-a:5.2f} exp={E[k]:5.2f} nseg={j-i}  {L[k][:40]}")
json.dump(out,open('vo/el/align.json','w'),indent=0)
