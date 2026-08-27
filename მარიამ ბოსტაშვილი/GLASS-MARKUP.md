# Glass markup contract

`css/glass.css` styles markup that does not exist in the HTML yet — the CRM
JavaScript builds it at runtime. This file is the reference for **what HTML to
produce** so the styles apply.

Nothing here is required by the PRD. It is a visual contract: match these class
names and the glass look appears for free. Use any structure you like and the
styles simply will not attach.

Every render target below is already an empty element in the page.

---

## Clients page — `#clientsArea`

Wrap the cards in `.client-grid`, then one `.client-card` per client.
`data-id` is what your click handlers read to know which client was hit.

```html
<div class="client-grid">
  <article class="client-card" data-id="1">
    <div class="client-card__top">
      <img class="client-card__avatar" src="…" alt="" loading="lazy" />
      <div class="client-card__id">
        <div class="client-card__name">Emily Johnson</div>
        <div class="client-card__company">Dooley, Kozey and Cronin</div>
        <div class="client-card__email">emily.johnson@x.dummyjson.com</div>
      </div>
    </div>

    <div class="client-card__meta">
      <span class="client-card__value">$5,000</span>
      <span class="badge badge-lead">Lead</span>
    </div>

    <div class="client-card__foot">
      <select class="input" data-role="status">
        <option>Lead</option>
        <option>Contacted</option>
        <option>Won</option>
        <option>Lost</option>
      </select>
      <button class="client-card__del" data-role="delete" aria-label="Delete Emily Johnson">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        </svg>
      </button>
    </div>
  </article>
</div>
```

### Status badge

One class per pipeline stage. The dot before the text is drawn by CSS.

| status      | class              |
| ----------- | ------------------ |
| `Lead`      | `badge badge-lead` |
| `Contacted` | `badge badge-contacted` |
| `Won`       | `badge badge-won`  |
| `Lost`      | `badge badge-lost` |

The PRD asks for this mapping to come from a `switch` or a lookup object —
a lookup keeps it to one line:

```js
const BADGE = { Lead: 'badge-lead', Contacted: 'badge-contacted', Won: 'badge-won', Lost: 'badge-lost' };
```

---

## Clients page — list states

All three go straight into `#clientsArea`, replacing whatever is there.

```html
<!-- loading -->
<div class="list-state">
  <div class="spinner"></div>
  Loading clients...
</div>

<!-- error (the PRD fixes this wording) -->
<div class="list-state">
  <div class="list-state__title">Could not load clients. Check your connection and try again.</div>
  <button class="btn btn-outline" id="retryBtn">Retry</button>
</div>

<!-- empty -->
<div class="list-state">
  <div class="list-state__title">No clients found.</div>
  <div>Try a different search or filter.</div>
</div>
```

---

## Clients page — details modal → `#detailBody`

```html
<div class="detail-head">
  <img class="detail-head__avatar" src="…" alt="" />
  <div>
    <div class="detail-head__name">Emily Johnson</div>
    <div class="detail-head__company">Dooley, Kozey and Cronin</div>
  </div>
</div>

<div class="detail-rows">
  <div class="detail-row"><span class="detail-row__key">Email</span><span class="detail-row__val">…</span></div>
  <div class="detail-row"><span class="detail-row__key">Phone</span><span class="detail-row__val">…</span></div>
  <div class="detail-row"><span class="detail-row__key">Status</span><span class="detail-row__val"><span class="badge badge-lead">Lead</span></span></div>
  <div class="detail-row"><span class="detail-row__key">Deal value</span><span class="detail-row__val">$5,000</span></div>
  <div class="detail-row"><span class="detail-row__key">Client since</span><span class="detail-row__val">7/5/2026</span></div>
</div>

<h4 class="card-title mb-2">Notes</h4>
<div class="notes-list" id="notesList">
  <div class="note">
    <div class="note__text">Called, interested</div>
    <div class="note__date">05/07/2026, 14:22</div>
  </div>
</div>
<!-- when there are none: <p class="notes-empty">No notes yet.</p> -->

<div class="note-add">
  <input class="input" id="noteInput" type="text" placeholder="Add a note…" />
  <button class="btn btn-outline" id="noteAddBtn">Add</button>
</div>

<button class="btn btn-primary btn-block mt-1" id="remindBtn">Remind me in 1 min</button>
```

---

## Dashboard — `#statCards`

Four of these inside the existing `.grid.grid-4`. Use `.stat-num` for the
number: it picks up the gradient.

```html
<div class="stat">
  <div class="stat__top">
    <span class="stat__label">Total Clients</span>
    <span class="stat__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      </svg>
    </span>
  </div>
  <div class="stat-num">30</div>
</div>
```

The icon is optional — `.stat__top` works with only the label.

---

## Dashboard — `#pipeline`

One row per status. `style="width:…%"` is the share of the total.

```html
<div class="pipe-row">
  <div class="pipe-row__head">
    <span>Lead</span>
    <span class="pipe-row__count">18</span>
  </div>
  <div class="pipe-bar">
    <div class="pipe-bar__fill is-lead" style="width:60%"></div>
  </div>
</div>
```

Fill classes: `is-lead`, `is-contacted`, `is-won`, `is-lost` — same colours as
the badges, so a stage reads the same everywhere.

---

## Dashboard — `#recent`

```html
<div class="recent-row">
  <img class="client-card__avatar" src="…" alt="" style="width:3.6rem;height:3.6rem" />
  <div class="recent-row__info">
    <div class="recent-row__name">Emily Johnson</div>
    <div class="recent-row__company">Dooley, Kozey and Cronin</div>
  </div>
  <span class="badge badge-lead">Lead</span>
  <span class="recent-row__date">7/5/2026</span>
</div>
```

---

## Toast

If your `toast()` helper builds this shape, it is styled already:

```html
<div class="toast-wrap">
  <div class="toast success">
    <span>Client added</span>
    <button class="toast-x" aria-label="Close">&times;</button>
  </div>
</div>
```

Types: `success` · `error` · `info`. The PRD asks for auto-dismiss after 3s or
an X button. Add `.leaving` to play the exit animation, then remove the node on
`animationend`.

---

## What you do not have to wire

`js/glass-ui.js` handles these on its own — do not call anything from your
render code:

- **Staggered reveal.** A `MutationObserver` watches `#clientsArea`,
  `#statCards`, `#recent` and `#pipeline`. Any `.client-card`, `.stat`,
  `.recent-row` or `.pipe-row` you insert fades in with an increasing delay.
- **Pointer tilt** on `.card`, `.client-card` and `.stat`, delegated from
  `<body>`, so it covers cards created after page load.
- **Sticky topbar.** Frosts once `.content` is scrolled.

## Modals

`app.css` already defines the behaviour: add `.open` to the `.modal-backdrop`
to show it, remove it to hide. `glass.css` only changes how it looks.

---

## Notification bell — `#notifList`  (BONUS, not in the PRD)

The PRD's follow-up reminder is a toast that disappears after 3 seconds. The
bell gives it somewhere to live. It **adds to** the toast — `P4.8` still
requires the toast itself, so keep both.

### One notification

`is-unread` draws the violet rail and shows the dot. Drop the class to mark it
read — no other change needed.

```html
<div class="notif-item is-unread" data-id="…">
  <span class="notif-item__icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  </span>
  <div class="notif-item__body">
    <div class="notif-item__title">Follow up: Emily Johnson</div>
    <div class="notif-item__text">Reminder you set a minute ago</div>
  </div>
  <span class="notif-item__time">now</span>
  <span class="notif-item__dot"></span>
</div>
```

Empty list:

```html
<div class="notif-empty">
  <div class="notif-empty__icon" aria-hidden="true">&#9203;</div>
  No notifications yet.
</div>
```

### The badge

`hidden` is on the element in the HTML, so an empty bell never shows a "0":

```js
notifBadge.hidden = unreadCount === 0;
notifBadge.textContent = unreadCount;
```

For the pop animation, add `.is-new` to `#notifBtn` and remove it on
`animationend`. New rows: add `.is-entering` when you prepend them.

### Hooks

| id | purpose |
| --- | --- |
| `#notifBtn` | the bell — carries `aria-expanded` |
| `#notifMenu` | wrapper — you toggle `.is-open` on this |
| `#notifBadge` | unread count |
| `#notifList` | render target |
| `#notifClearBtn` | "Mark all read" |

### One thing to watch

The bell and the account menu are two separate `.dropdown`s side by side in the
topbar. If both get `.is-open` their panels overlap. Close the other one when
you open either — the usual single-open rule:

```js
document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('is-open'));
```

### Storage

`crm_users`, `crm_session`, `crm_clients` and `crm_theme` are fixed by the PRD.
If you persist notifications, use a fifth key of your own (e.g.
`crm_notifications`) — do not overload the four required ones.

---

## Dashboard — stat sub-line and activity rows

### A warning before you build these

The 10x-glass mock shows `▲ 12.4% vs last month`, `New message from Sarah Chen`
and `Quarterly quota $412k of $650k`. **None of those can be computed here.**
They were hard-coded demo text. `crm_clients` stores only the present — there is
no history, no messages, no target. Printing them would be inventing data, and
"where does 12.4% come from?" is exactly the kind of question an assessor asks.

Use the sub-line for figures that really are derived from state.

### Stat with a sub-line

```html
<div class="stat">
  <div class="stat__top">
    <span class="stat__label">Total Clients</span>
    <span class="stat__icon"><!-- optional --></span>
  </div>
  <div class="stat-num">30</div>
  <div class="stat__delta stat__delta--up">▲ 3 <span>new this week</span></div>
</div>
```

Modifiers: `--up` green, `--down` red, none = muted. The `<span>` tail always
stays muted, so the number leads.

The PRD's four stats, and an honest sub-line for each:

| stat | value | sub-line |
| --- | --- | --- |
| Total Clients | `clients.length` | `▲ N new this week` (`--up` when N > 0) |
| Active Deals | not Won and not Lost | `not Won or Lost` (neutral) |
| Won Revenue | sum of Won `dealValue` | `▲ N deals won` |
| New This Week | `createdAt` within 7 days | `last 7 days` (neutral) |

### Activity row → `#recent`

This is the PRD's Recent Clients (`P3.4`), drawn richer. Every field comes from
a real client, and the time from `createdAt`.

```html
<div class="section-head">
  <h3 class="section-head__title">Recent activity</h3>
  <a class="section-head__link" href="clients.html">View all clients →</a>
</div>

<div class="activity-row">
  <span class="activity-row__icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    </svg>
  </span>
  <div class="activity-row__body">
    <div class="activity-row__title">Vertex Studio added as a client</div>
    <div class="activity-row__text">Lead · $8,200</div>
  </div>
  <span class="activity-row__time">3h ago</span>
</div>
```

`.recent-row` from earlier is still there if you want the plainer list; both
are styled. Pick one.

### Quarterly quota

`.pipe-row` / `.pipe-bar` already covers this shape — it is the same bar. A
quota is honest only if you declare the target yourself rather than implying
the data knows it:

```js
const Q3_TARGET = 650000;              // a goal you set, not data
const pct = Math.round((wonRevenue / Q3_TARGET) * 100);
```

That is defensible at the exam: the target is a constant you chose, and the
progress against it is real arithmetic.
