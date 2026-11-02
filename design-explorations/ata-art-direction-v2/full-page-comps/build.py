import json
HEROES={
 'architecture':dict(img='A_d.jpg',pos='center',eyebrow='Guided journeys to Eritrea',h='Come home<br>to <em>Eritrea</em>',sub='One journey, arranged by people who know the road and confirmed with you personally.',shade='radial-gradient(95% 80% at 14% 92%,rgba(14,8,4,.9),rgba(14,8,4,.45) 55%,rgba(14,8,4,0) 78%),linear-gradient(0deg,rgba(14,8,4,.55),rgba(14,8,4,0) 36%)'),
 'people':dict(img='C_d.jpg',pos='center',eyebrow='Travel with someone on your side',h='Someone who knows<br>the road <em>home</em>',sub='Tell us who is travelling. A person at Amanuel Travel replies and plans it with you.',shade='linear-gradient(90deg,rgba(14,8,4,.85),rgba(14,8,4,.35) 55%,rgba(14,8,4,0) 80%),linear-gradient(0deg,rgba(14,8,4,.5),rgba(14,8,4,0) 40%)'),
 'landscape':dict(img='land_hero.jpg',pos='center',eyebrow='From the highlands to the Red Sea',h='From the plateau<br>to the <em>coast</em>',sub='A road that drops from Asmara toward Massawa. We plan the journey with you.',shade='linear-gradient(90deg,rgba(14,8,4,.82),rgba(14,8,4,.3) 60%,rgba(14,8,4,0)),linear-gradient(0deg,rgba(14,8,4,.55),rgba(14,8,4,0) 40%)'),
}
T=open('tpl.html').read()
for k,v in HEROES.items():
    s=T
    for a,b in v.items(): s=s.replace('{{'+a+'}}',b)
    s=s.replace('{{name}}',k)
    open(f'{k}.html','w').write(s)
