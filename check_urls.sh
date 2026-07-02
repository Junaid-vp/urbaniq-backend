urls=(
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80"
  "https://images.unsplash.com/photo-1502672260266-1c1cd2cb928c?w=1600&q=80"
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80"
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80"
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600&q=80"
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
  "https://images.unsplash.com/photo-1599818815197-009b0b4685ff?w=1600&q=80"
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&q=80"
  "https://images.unsplash.com/photo-1616422285623-146437d80df3?w=1600&q=80"
)
for url in "${urls[@]}"; do
  echo "$url: $(curl -s -o /dev/null -w "%{http_code}" "$url")"
done
