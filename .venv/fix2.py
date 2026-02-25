src = open("/Users/admin/Downloads/nowy-cpr-pl/src/pages/WyrobDetail.tsx").read()
bs = chr(92)
nl_esc = bs + chr(110)
d1 = chr(36) + chr(49)
p = chr(39)
line_p1 = "  html = html.replace(/" + nl_esc + nl_esc + "([^#<" + nl_esc + "].+?)" + nl_esc + nl_esc + "/gs, " + p + chr(60)+"p class="+chr(34)+"text-slate-300 leading-relaxed my-4"+chr(34)+chr(62)+d1+chr(60)+chr(47)+"p"+chr(62) + p + ");"
line_p2 = "  html = html.replace(/" + nl_esc + nl_esc + "([^#<" + nl_esc + "].+?)" + chr(36) + "/gs, " + p + chr(60)+"p class="+chr(34)+"text-slate-300 leading-relaxed my-4"+chr(34)+chr(62)+d1+chr(60)+chr(47)+"p"+chr(62) + p + ");"
print(repr(line_p1))
print(repr(line_p2))