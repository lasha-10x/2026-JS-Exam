

Entry 1: Debugging Email Validation
Goal: Fix email validation in my JavaScript form.
1. First Attempt:
   Prompt: "My email validation isn't working."
   Tool: Vibe (mistreal AI)
   Result: AI gave generic advice about regex, but it didn’t match my exact issue.
   Rejected: Too broad; didn’t address my specific code.

2. Refined Prompt (Clarified):
   Prompt: "Why does this email validation fail?[pasted code]. The error is that it always passes, even for invalid emails like 'user@example'." 
   Tool: Vibe
   Result: AI identified the issue (`!emailRegex` was checking the regex object, not the email string) and provided a fix using `.test()`.
   Used: Implemented the fix, and it worked.

What I Learned:
Vague prompts - vague answers. Adding code snippets and specific errors leads to better solutions.
Debugging tip: Always check if you’re testing the right thing (`.test()` for regex, not the regex object itself).

Entry 2: Generating Unique IDs for Clients
Goal: Ensure manually added clients in my CRM have unique IDs.
Prompt: "How do I generate unique IDs for clients in JavaScript? My current code uses `result.id` from an API, but it keeps returning the same ID (209)."
Tool: Vibe

Result:
Adapted: AI suggested using Date.now() + Math.random() or crypto.randomUUID() and completely replacing the API-generated ID. I instead implemented result.id + Date.now() + Math.random() because I still needed the API response while ensuring the generated ID remained unique.

What I Learned:
how to evaluate AI-generated code, understand why it works, and modify it to meet my project's requirements instead of using it exactly as suggested.

Entry 3: Fixing Client Filtering
Goal: Fix a bug where filtering clients by status doesn’t work.
Prompt: "My client filter isn’t working. Here’s my getVisibleClients() function: [pasted code]. Why does it always return all clients?"
Tool: Vibe (Mistral AI)
Result:

Used: AI pointed out that the activeStatusFilter was not being applied correctly in the filter method.
Adapted: Fixed the condition to c.status === activeStatusFilter.

What I Learned:
Debugging array methods (filter, sort) requires careful attention to conditions.
Always log intermediate values (e.g., console.log(activeStatusFilter)) to verify assumptions.


Entry 4: Modal Dialogs (Open/Close Logic)
Goal: Fix a bug where modals don’t close when clicking outside.
Prompt: "My modal doesn’t close when clicking the backdrop. Here’s my event listener: [pasted code]."
Tool: Vibe (Mistral AI)
Result:
Used: AI suggested using e.target.closest() to check if the click was outside the modal.
Adapted: Added a condition to close the modal only if the click target is the backdrop.

What I Learned:
Event delegation (e.target.closest()) is useful for handling clicks on dynamic elements.
Always test edge cases, like clicking the modal itself.

Entry 5: Debugging Duplicate Client Creation
Goal: Fix the issue where tapping the "Add Client" button twice creates duplicate clients.
Prompt: "On my add client button, when I tap it twice, it creates the same client twice. How do I prevent this?"
Tool: Vibe (Mistral AI)
Result:
Used: AI suggested disabling the submit button during form submission to prevent multiple submissions.
Adapted: Implemented the solution by disabling the button at the start of handleAddClientSubmit and re-enabling it in the finally block.

What I Learned:
Race conditions can occur in asynchronous operations.
Disabling UI elements during processing is a simple way to prevent duplicate actions.
Always re-enable UI elements after completion, even if an error occurs.


