import os
BT = chr(96)  # backtick
Q = chr(34)   # double quote
OUT = "/Users/admin/Downloads/nowy-cpr-pl/src/pages/Wyroby.tsx"

# Build Wyroby.tsx
W = []
W.append("import { useState, useEffect } from "+Q+"react"+Q+";")
W.append("import { useNavigate } from "+Q+"react-router-dom"+Q+";")
W.append("import { Header } from "+Q+"../components/Header"+Q+";")
W.append("import { Footer } from "+Q+"../components/Footer"+Q+";")
W.append("import { Container } from "+Q+"../components/Container"+Q+";")
