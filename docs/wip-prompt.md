以下のレビューをもらいました。修正すべきものと修正すべきでないものを判断して、修正してください。

---

In
@src/client/features/recipe-detail/components/contents/barista/BaristaCard.test.tsx
around lines 147 - 162, Remove the unnecessary eslint-disable comment at the top
of the BaristaCard.test.tsx test case; specifically delete the line "//
eslint-disable-next-line sonarjs/assertions-in-tests" above the
it('SNSリンクがない場合、リンクセクションを表示しないこと'...) block so the test uses the existing valid
assertion (expect(...).not.toBeInTheDocument()) without disabling the sonarjs
rule.

---

In
@src/client/features/recipe-detail/components/contents/barista/BaristaCard.test.tsx
around lines 187 - 200, The toggle button in the BaristaCard component is
missing the id referenced by the region's aria-labelledby; update the
BaristaCard component to add id="barista-toggle-button" to the toggle button
element (the same button that controls the accordion/visibility), ensuring the
region with aria-labelledby="barista-toggle-button" correctly references it so
the test and ARIA labeling pass.

---

In
@src/client/features/recipe-detail/components/contents/barista/BaristaCard.tsx
around lines 30 - 35, The button in the BaristaCard component is missing the id
referenced by aria-labelledby, breaking the ARIA relationship; add
id="barista-toggle-button" (or make the id value match the existing
aria-labelledby on the details region) to the button element that uses
onClick={handleToggle} and aria-controls="barista-details" so screen readers can
resolve the control-label relationship while leaving the rest of the attributes
(aria-expanded, aria-controls, aria-label) unchanged.

---

In
@src/client/features/recipe-detail/components/contents/header/RecipeHeader.tsx
around lines 21 - 22, The RecipeHeader title element is missing the required
font-serif class per todo.md; update the h1 in RecipeHeader (the element
rendering {title}) so its className includes "font-serif" alongside the existing
"text-card-foreground mb-3 text-2xl md:text-3xl" to match the specified styling.
