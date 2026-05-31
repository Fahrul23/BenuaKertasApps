# Edit Mode Behavior - Custom Order Page

## Current Implementation

### Individual Edit (Edit Button on Each Item)
**Flow:**
1. User is on Step 8 (Review Order)
2. User clicks "Edit" button on a specific item (e.g., "Bahan")
3. `isEditMode` is set to `true`
4. User is redirected to the specific step (e.g., Step 3 for Bahan)
5. User makes changes
6. Next button shows **"Update"** text
7. When user clicks "Update", they return to Step 8 (Review Order)
8. `isEditMode` is reset to `false`

**Code:**
```javascript
const handleEditStep = (step) => {
  setIsEditMode(true);
  setCurrentStep(step);
};

const handleNext = () => {
  if (isEditMode) {
    setCurrentStep(8);  // Return to review
    setIsEditMode(false);
  } else {
    // Normal flow
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  }
};
```

### Edit All (Edit Semua Button)
**Flow:**
1. User is on Step 8 (Review Order)
2. User clicks "Edit Semua" button
3. `isEditMode` is set to `false`
4. User is redirected to Step 1
5. User goes through normal flow (Step 1 → 2 → 3 → ... → 8)
6. Next button shows normal text ("Tentukan Ukuran", "Tentukan Bahan", etc.)
7. User can navigate through all steps normally

**Code:**
```javascript
const handleEditAll = () => {
  setIsEditMode(false);  // Normal flow, not edit mode
  setCurrentStep(1);     // Start from beginning
};
```

### Back Button Behavior
- **During Individual Edit**: Clicking back returns to Step 8 (Review) and cancels edit mode
- **During Normal Flow**: Clicking back goes to previous step
- **During Edit All Flow**: Clicking back goes to previous step (normal behavior)

**Code:**
```javascript
const handlePrev = () => {
  if (isEditMode) {
    setCurrentStep(8);      // Return to review
    setIsEditMode(false);   // Cancel edit mode
  } else {
    // Normal flow
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }
};
```

## Summary

| Action | isEditMode | Starting Step | Next Button Text | Next Button Behavior |
|--------|-----------|---------------|------------------|---------------------|
| Individual Edit | `true` | Specific step (1-7) | "Update" | Return to Step 8 |
| Edit Semua | `false` | Step 1 | Normal text | Go to next step |
| Normal Flow | `false` | Any step | Normal text | Go to next step |

## Verification Checklist

✅ Individual edit sets `isEditMode = true`
✅ Individual edit navigates to specific step
✅ Next button shows "Update" during individual edit
✅ Update button returns to Step 8
✅ Edit Semua sets `isEditMode = false`
✅ Edit Semua starts from Step 1
✅ Edit Semua uses normal flow with regular button text
✅ Back button during edit returns to Step 8
✅ Back button during normal flow goes to previous step

## Implementation Status

**STATUS: ✅ COMPLETE**

The edit mode behavior is correctly implemented according to requirements:
- Individual edits use "Update" button and return to review
- "Edit Semua" restarts normal flow from step 1
- All navigation logic works as expected
