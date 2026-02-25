src = open("/Users/admin/Downloads/nowy-cpr-pl/src/pages/WyrobDetail.tsx").read()
bs = chr(92)
nl_esc = bs + chr(110)
d1 = chr(36) + chr(49)
p = chr(39)
lt = chr(60)
gt = chr(62)
sl = chr(47)
q = chr(34)

line_p1 = "  html = html.replace(/" + nl_esc + nl_esc + "([^#<" + nl_esc + "].+?)" + nl_esc + nl_esc + "/gs, " + p + lt+"p class="+q+"text-slate-300 leading-relaxed my-4"+q+gt+d1+lt+sl+"p"+gt + p + ");"
line_p2 = "  html = html.replace(/" + nl_esc + nl_esc + "([^#<" + nl_esc + "].+?)" + chr(36) + "/gs, " + p + lt+"p class="+q+"text-slate-300 leading-relaxed my-4"+q+gt+d1+lt+sl+"p"+gt + p + ");"

# Find the broken section - from the 8th replace (blockquote) to return html
# The broken part starts after blockquote line and ends before return html
lines = src.split(chr(10))
new_lines = []
skip_until_return = False
inserted = False
i = 0
while i < len(lines):
    line = lines[i]
    if not inserted and "html.replace(/^> " in line:
        new_lines.append(line)
        # now skip everything until "return html" and insert our two lines
        i += 1
        while i < len(lines) and "return html" not in lines[i]:
            i += 1
        new_lines.append(line_p1)
        new_lines.append(line_p2)
        new_lines.append("  return html;")
        inserted = True
        # skip the original return html line
        i += 1
        continue
    new_lines.append(line)
    i += 1

new_src = chr(10).join(new_lines)
open("/Users/admin/Downloads/nowy-cpr-pl/src/pages/WyrobDetail.tsx","w").write(new_src)
print("wrote", len(new_src), "bytes")

# Verify
check = open("/Users/admin/Downloads/nowy-cpr-pl/src/pages/WyrobDetail.tsx").read()
fn_s = check.index("function markdownToHtml")
fn_e = check.index("export default function WyrobDetail")
fn = check[fn_s:fn_e]
for j, ln in enumerate(fn.split(chr(10))):
    print(j, repr(ln))