#!/bin/bash
# Mobile Testing Script
# Run this to verify mobile optimizations

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       Mobile Optimization Testing Checklist                ║"
echo "╚════════════════════════════════════════════════════════════╝"

echo ""
echo "1. Build Check"
npm run build 2>/dev/null && echo "✅ Build successful" || echo "❌ Build failed"

echo ""
echo "2. File Structure Check"
files=(
  "lib/hooks/useMediaQuery.ts"
  "lib/server/rateLimit.ts"
  "lib/server/csrf.ts"
  "lib/utils/mobile.ts"
  "components/SmoothScroller.tsx"
  "components/TerminalContactForm.tsx"
  ".env.example"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
  fi
done

echo ""
echo "3. Mobile Testing Instructions"
echo ""
echo "   iPhone/iPad (Safari):"
echo "   1. Open DevTools (Safari > Develop > ...)"
echo "   2. Check Responsive Design Mode size 390x844"
echo "   3. Test:"
echo "      - Tap on form inputs"
echo "      - Type message"
echo "      - Verify no zoom occurs"
echo "      - Check keyboard doesn't cover form"
echo ""
echo "   Android (Chrome):"
echo "   1. Open DevTools (F12)"
echo "   2. Toggle Device Toolbar (Ctrl+Shift+M)"
echo "   3. Select Samsung Galaxy S21 (360x800)"
echo "   4. Test same interactions as iOS"
echo ""
echo "   All Devices:"
echo "   1. Horizontal scroll on Project section"
echo "   2. Vertical scroll smoothness"
echo "   3. No layout shifts"
echo "   4. Touch responsiveness"
echo "   5. Form submission success"

echo ""
echo "4. Browser Console"
echo "   ⚠ Should have NO errors"
echo "   ⚠ No hydration mismatch warnings"
echo ""
