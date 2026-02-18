# Component Selection Test Cases

## Test 1: Dashboard
**Prompt:** "Create a sales dashboard with charts and KPI cards"

**Expected Categories:** dashboard, charts, data

**Expected Components:** Should include KPICard, LineChart, BarChart, DataTable, Grid, Flex

**Token Savings:** ~30-40k tokens (from 150 components to ~40)

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Test 2: Animated Landing Page
**Prompt:** "Build an animated landing page for a SaaS product with 3D effects"

**Expected Categories:** landing page, animated, 3d, gradient

**Expected Components:** Hero, FeatureGrid, ThreeDCard, AnimatedBeam, WavyBackground

**Token Savings:** ~35k tokens (from 150 to ~50)

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Test 3: Simple Form
**Prompt:** "Contact form with name, email, and message"

**Expected Categories:** form

**Expected Components:** Input, Textarea, Button, Label, Flex, Stack

**Token Savings:** ~40k tokens (from 150 to ~25)

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Test 4: E-commerce Product Page
**Prompt:** "Product showcase page with image gallery and pricing"

**Expected Categories:** ecommerce, cards

**Expected Components:** ProductCard, Image, Grid, Button, Badge, Rating

**Token Savings:** ~35k tokens

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Test 5: Blog Layout
**Prompt:** "Blog homepage with article cards"

**Expected Categories:** blog, cards

**Expected Components:** MediaCard, BlogCard, Grid, Image, Avatar, Badge

**Token Savings:** ~35k tokens

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Test 6: Data-Heavy Admin Panel
**Prompt:** "Admin panel with data grid, filters, and user management"

**Expected Categories:** dashboard, data, form

**Expected Components:** DataGrid, DataTable, Input, Select, Button, Badge

**Token Savings:** ~35k tokens

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Test 7: Portfolio Website
**Prompt:** "Creative portfolio with animated backgrounds and hover effects"

**Expected Categories:** animated, hover, backgrounds

**Expected Components:** HoverEffect, CardHoverEffect, WavyBackground, Grid, Image

**Token Savings:** ~35k tokens

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Test 8: Authentication Flow
**Prompt:** "Login page with email, password, and social login buttons"

**Expected Categories:** form, buttons

**Expected Components:** Input, Button, Label, Flex, Section

**Token Savings:** ~40k tokens

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Selection time:
- Generation time:
- Token reduction:

---

## Performance Benchmarks

**Target Metrics:**
- Component selection time: < 1 second
- Total generation time: < 5 seconds
- Token reduction: > 60%
- Cache hit rate: > 30% for repeated prompts

**Actual Results:** (Fill in after testing)
- Avg selection time: ___ms
- Avg generation time: ___ms
- Avg token reduction: ___%
- Cache hit rate: ___%

---

## Cache Testing

### Test 9: Cache Hit Test
**Prompt:** Repeat "Create a sales dashboard with charts and KPI cards" immediately after Test 1

**Expected Behavior:**
- Cache hit should occur
- Selection time should be < 10ms
- Same components should be selected

**Status:** ⏳ Pending

**Actual Results:**
- Cache hit:
- Selection time:
- Components match:

---

### Test 10: Cache Expiry Test
**Prompt:** Repeat prompt after 6 minutes (beyond 5-minute TTL)

**Expected Behavior:**
- Cache miss should occur
- Selection time should be normal (~500ms)
- LLM selection should run again

**Status:** ⏳ Pending

**Actual Results:**
- Cache hit:
- Selection time:
- LLM called:

---

## Edge Cases

### Test 11: Vague Prompt
**Prompt:** "Make something cool"

**Expected Behavior:**
- Should select broad categories or fall back to all components
- Should not fail/error

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Error occurred:

---

### Test 12: Very Specific Prompt
**Prompt:** "3D card with neon glow effect and animated border"

**Expected Categories:** 3d, neon, animated

**Expected Components:** ThreeDCard, NeonButton, AnimatedBorder, MovingBorder

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Precision:

---

### Test 13: Mixed Requirements
**Prompt:** "Dashboard with animated charts, glassmorphism cards, and a contact form"

**Expected Categories:** dashboard, animated, glassmorphism, form, charts, cards

**Expected Behavior:**
- Should combine multiple categories
- Should include 50-70 components

**Status:** ⏳ Pending

**Actual Results:**
- Categories selected:
- Components selected:
- Coverage:

---

## Test Execution Instructions

1. **Setup:**
   ```bash
   npm run dev
   ```

2. **Run Manual Tests:**
   - Open http://localhost:3000
   - Enter each test prompt
   - Observe console output for selection metrics
   - Record results in this document

3. **Check Telemetry:**
   ```bash
   curl http://localhost:3000/api/telemetry
   ```

4. **Automated Testing (Future):**
   - Create Jest tests for component selection
   - Add regression tests for common prompts
   - Set up CI/CD testing

---

## Success Criteria

- ✅ All prompts generate valid UI
- ✅ Selection time < 1 second for all tests
- ✅ Token reduction > 60% on average
- ✅ Cache works correctly (hit and expiry)
- ✅ No errors or fallbacks to all components
- ✅ Telemetry accurately captures metrics

---

## Notes

- Record any unexpected behavior
- Note which prompts work best/worst
- Identify areas for improvement in category mappings
- Document any performance bottlenecks
