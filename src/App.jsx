import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

const categories = [
  "Food",
  "Transport",
  "Bills",
  "Education",
  "Entertainment",
  "Shopping",
  "Health",
  "Other"
];

const categoryEmoji = {
  Food: "🍔",
  Transport: "🚇",
  Bills: "🧾",
  Education: "📚",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Health: "💊",
  Other: "📌"
};

const emptyForm = {
  title: "",
  amount: "",
  category: "Food",
  date: "",
  note: ""
};

function money(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const titleRef = useRef(null);

  // Mock API data loading
  useEffect(() => {
    fetch("/expenses.json")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load expenses");
        return response.json();
      })
      .then((data) => setExpenses(data))
      .catch(() => setNotice("Could not load the demo expense data."))
      .finally(() => setLoading(false));
  }, []);

  // Focus the first form field whenever the form page is opened
  useEffect(() => {
    if (page === "add") {
      window.setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [page]);

  const total = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount), 0),
    [expenses]
  );

  const average = useMemo(
    () => (expenses.length ? Math.round(total / expenses.length) : 0),
    [expenses.length, total]
  );

  const thisMonthTotal = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return expenses
      .filter((item) => {
        const date = new Date(`${item.date}T00:00:00`);
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + Number(item.amount);
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return expenses
      .filter((item) => {
        const matchesSearch =
          !term ||
          item.title.toLowerCase().includes(term) ||
          item.note.toLowerCase().includes(term);

        const matchesCategory =
          categoryFilter === "All" || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, search, categoryFilter]);

  const recentExpenses = useMemo(
    () => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [expenses]
  );

  const changeForm = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
  }, []);

  const saveExpense = useCallback(
    (event) => {
      event.preventDefault();

      if (!form.title.trim() || !form.amount || !form.date) {
        setNotice("Please fill in the title, amount and date.");
        return;
      }

      const expense = {
        id: editingId ?? Date.now(),
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        note: form.note.trim()
      };

      setExpenses((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? expense : item))
          : [expense, ...current]
      );

      setNotice(editingId ? "Expense updated successfully." : "Expense added successfully.");
      resetForm();
      setPage("expenses");
    },
    [editingId, form, resetForm]
  );

  const editExpense = useCallback((expense) => {
    setForm({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date,
      note: expense.note || ""
    });
    setEditingId(expense.id);
    setPage("add");
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((current) => current.filter((item) => item.id !== id));
    setNotice("Expense deleted.");
  }, []);

  const goTo = useCallback((target) => {
    setPage(target);
    setNotice("");
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "expenses", label: "All Expenses", icon: "▤" },
    { id: "analytics", label: "Analytics", icon: "▥" }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">₹</div>
          <div>
            <h1>ExpenseFlow</h1>
            <p>Smart money tracking</p>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => goTo(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              <span className="nav-arrow">›</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-tip">
          <div className="tip-star">✦</div>
          <strong>Stay on top of spending</strong>
          <p>Track every rupee and build better habits.</p>
        </div>

        <div className="sidebar-footer">⚙ Settings</div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <h2>{page === "dashboard" ? "Dashboard" : page === "expenses" ? "All Expenses" : page === "analytics" ? "Analytics" : "Add Expense"}</h2>
            <p>Here's what's happening with your money.</p>
          </div>
          <div className="profile">VP</div>
        </header>

        <main className="content">
          {notice && <div className="notice">{notice}</div>}

          {page === "dashboard" && (
            <>
              <section className="hero">
                <div>
                  <p className="eyebrow">✦ FINANCIAL OVERVIEW</p>
                  <h3>Make every rupee <span>count.</span></h3>
                  <p>Understand your spending, stay within your goals, and make smarter decisions.</p>
                </div>
                <button className="primary-button hero-button" onClick={() => goTo("add")}>
                  + Add Expense
                </button>
              </section>

              <section className="stats-grid">
                <StatCard label="Total Expenses" value={money(total)} hint="All recorded expenses" icon="₹" />
                <StatCard label="This Month" value={money(thisMonthTotal)} hint="Current month spending" icon="↗" />
                <StatCard label="Transactions" value={expenses.length} hint="Total entries" icon="▤" />
                <StatCard label="Average Spend" value={money(average)} hint="Per transaction" icon="$" />
              </section>

              <section className="dashboard-grid">
                <div className="card">
                  <div className="card-heading">
                    <div>
                      <h3>Recent Expenses</h3>
                      <p>Your latest transactions</p>
                    </div>
                    <button className="text-button" onClick={() => goTo("expenses")}>View all →</button>
                  </div>

                  {loading ? (
                    <div className="empty">Loading expenses...</div>
                  ) : (
                    <ExpenseTable expenses={recentExpenses} onEdit={editExpense} onDelete={deleteExpense} compact />
                  )}
                </div>

                <CategoryCard totals={categoryTotals} total={total} />
              </section>
            </>
          )}

          {page === "expenses" && (
            <section className="card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">TRANSACTIONS</p>
                  <h3>All Expenses</h3>
                  <p>Search, filter, edit and delete your expenses.</p>
                </div>
                <button className="primary-button" onClick={() => goTo("add")}>+ Add Expense</button>
              </div>

              <div className="filters">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search expenses..."
                />
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option>All</option>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>

              <ExpenseTable expenses={filteredExpenses} onEdit={editExpense} onDelete={deleteExpense} />
            </section>
          )}

          {page === "analytics" && (
            <section className="analytics-page">
              <div className="stats-grid">
                <StatCard label="Total Spending" value={money(total)} hint="Across all categories" icon="₹" />
                <StatCard label="Transactions" value={expenses.length} hint="Recorded expenses" icon="▤" />
                <StatCard label="Average Spend" value={money(average)} hint="Per transaction" icon="↗" />
              </div>

              <CategoryCard totals={categoryTotals} total={total} large />

              <div className="card">
                <div className="card-heading">
                  <div>
                    <h3>Category Breakdown</h3>
                    <p>Amount and share of total spending.</p>
                  </div>
                </div>
                <div className="breakdown">
                  {categoryTotals.map(([name, value]) => (
                    <div className="breakdown-row" key={name}>
                      <span>{categoryEmoji[name]} {name}</span>
                      <strong>{money(value)}</strong>
                      <span>{total ? Math.round((value / total) * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {page === "add" && (
            <section className="card form-card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">TRANSACTION</p>
                  <h3>{editingId ? "Edit Expense" : "Add New Expense"}</h3>
                  <p>Enter the details of your expense.</p>
                </div>
              </div>

              <form className="expense-form" onSubmit={saveExpense}>
                <label>
                  Expense Title
                  <input ref={titleRef} name="title" value={form.title} onChange={changeForm} placeholder="e.g. Grocery Shopping" />
                </label>

                <label>
                  Amount
                  <input name="amount" type="number" min="1" value={form.amount} onChange={changeForm} placeholder="Enter amount" />
                </label>

                <label>
                  Category
                  <select name="category" value={form.category} onChange={changeForm}>
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label>
                  Date
                  <input name="date" type="date" value={form.date} onChange={changeForm} />
                </label>

                <label className="full-width">
                  Note
                  <textarea name="note" value={form.note} onChange={changeForm} placeholder="Optional note about this expense" rows="4" />
                </label>

                <div className="form-actions full-width">
                  <button type="submit" className="primary-button">{editingId ? "Update Expense" : "Add Expense"}</button>
                  <button type="button" className="secondary-button" onClick={() => { resetForm(); goTo("expenses"); }}>Cancel</button>
                </div>
              </form>
            </section>
          )}
        </main>

        <footer>ExpenseFlow • Built with React</footer>
      </section>
    </div>
  );
}

function StatCard({ label, value, hint, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function CategoryCard({ totals, total, large = false }) {
  return (
    <div className={`card category-card ${large ? "large" : ""}`}>
      <div className="card-heading">
        <div>
          <h3>Spending by Category</h3>
          <p>Where your money goes</p>
        </div>
      </div>

      <div className="category-list">
        {totals.length === 0 ? (
          <div className="empty">No category data yet.</div>
        ) : (
          totals.map(([name, value]) => {
            const percentage = total ? (value / total) * 100 : 0;

            return (
              <div className="category-item" key={name}>
                <div className="category-top">
                  <span>{categoryEmoji[name]} {name}</span>
                  <strong>{money(value)}</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ExpenseTable({ expenses, onEdit, onDelete, compact = false }) {
  if (!expenses.length) {
    return <div className="empty">No expenses found.</div>;
  }

  return (
    <div className="expense-table">
      <div className="table-head">
        <span>EXPENSE</span>
        <span>CATEGORY</span>
        <span>DATE</span>
        <span>AMOUNT</span>
        {!compact && <span>ACTIONS</span>}
      </div>

      {expenses.map((expense) => (
        <div className="expense-row" key={expense.id}>
          <div className="expense-name">
            <div className="category-icon">{categoryEmoji[expense.category]}</div>
            <div>
              <strong>{expense.title}</strong>
              <small>{expense.note || "Expense entry"}</small>
            </div>
          </div>

          <span className="category-pill">{expense.category}</span>
          <span>{formatDate(expense.date)}</span>
          <strong className="amount">{money(expense.amount)}</strong>

          {!compact && (
            <div className="actions">
              <button className="edit-button" onClick={() => onEdit(expense)}>Edit</button>
              <button className="delete-button" onClick={() => onDelete(expense.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;