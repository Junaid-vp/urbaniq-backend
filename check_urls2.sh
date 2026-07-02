urls=(
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
  "https://images.unsplash.com/photo-1581457816867-b778c1bfa7d9?w=1600&q=80"
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&q=80"
  "https://images.unsplash.com/photo-1533038590840-1c70cc693c04?w=1600&q=80"
)
for url in "${urls[@]}"; do
  echo "$url: $(curl -s -o /dev/null -w "%{http_code}" "$url")"
done
