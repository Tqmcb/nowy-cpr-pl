import base64,json,sys
src = open("/Users/admin/Downloads/nowy-cpr-pl/src/pages/WyrobDetail.tsx").read()
EXP = "export default function WyrobDetail"
end = src.index(EXP)

# Build the corrected markdownToHtml function
lt = chr(60)
gt = chr(62)
sl = chr(47)
q = chr(34)
d = chr(36)

# The correct function text
lines_fn = []
lines_fn.append("function markdownToHtml(markdown: string): string {")
lines_fn.append("  if (!markdown) return "";")
lines_fn.append("  let html = markdown;")
# h1
r = lt+"h1 class="+q+"text-3xl font-bold text-white my-6"+q+gt+d+"1"+lt+sl+"h1"+gt
lines_fn.append("  html = html.replace(/^"+chr(35)+" (.+)"+d+"/gm, "+repr(chr(39))+"+r+"+repr(chr(39))+");") 
