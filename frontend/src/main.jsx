import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
const API = "/api";
function App() {
  const [tasks, setTasks] = useState([]),
    [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 }),
    [filter, setFilter] = useState("ALL"),
    [query, setQuery] = useState(""),
    [showForm, setShowForm] = useState(false),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(null),
    [error, setError] = useState("");
  const load = async () => {
    try {
      setError("");
      const [a, b] = await Promise.all([
        fetch(`${API}/tasks`),
        fetch(`${API}/tasks/stats`),
      ]);
      if (!a.ok || !b.ok) throw Error("Backend unavailable");
      setTasks(await a.json());
      setStats(await b.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const visible = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesFilter = filter === "ALL" || task.status === filter;
        const text = `${task.title} ${task.description || ""} ${task.assignee || ""}`.toLowerCase();
        return matchesFilter && text.includes(query.toLowerCase());
      }),
    [filter, query, tasks],
  );
  const update = async (task, status) => {
    setSaving(task.id);
    try {
      const response = await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status }),
      });
      if (!response.ok) throw Error("Could not update task");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };
  const create = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: f.get("title"),
        description: f.get("description"),
        priority: f.get("priority"),
        assignee: f.get("assignee"),
        status: "TODO",
      }),
    });
    e.currentTarget.reset();
    setShowForm(false);
    load();
  };
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">F</span>
          <div>
            <b>f-FreeFlow</b>
            <small>DevOps Capstone</small>
          </div>
        </div>
        <nav>
          <a className="active">
            ▦ <span>Dashboard</span>
          </a>
          <a>
            ✓ <span>My Tasks</span>
          </a>
          <a>
            ◫ <span>Projects</span>
          </a>
          <a>
            ◌ <span>Activity</span>
          </a>
        </nav>
        <div className="side-bottom">
          <div className="upgrade">
            <strong>Ship with confidence.</strong>
            <p>Build, deploy and observe your application.</p>
          </div>
          <div className="profile">
            <div className="avatar">AR</div>
            <div>
              <b>Aashu</b>
              <small>Developer</small>
            </div>
            <span>⋮</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <header>
          <div>
            <p className="eyebrow">WORKSPACE / OVERVIEW</p>
            <h1>Good morning, Aashu.</h1>
            <p className="muted">
              A clear view of what needs your attention today.
            </p>
          </div>
          <button className="primary" onClick={() => setShowForm(true)}>
            ＋ New task
          </button>
        </header>
        {error && (
          <div className="alert">
            ⚠ {error}. Start the backend and PostgreSQL, then refresh.
          </div>
        )}
        <section className="stats">
          <Stat label="Total tasks" value={stats.total} icon="▦" />
          <Stat label="To do" value={stats.todo} icon="○" />
          <Stat label="In progress" value={stats.inProgress} icon="◔" />
          <Stat label="Completed" value={stats.done} icon="✓" />
        </section>
        <section className="content-grid">
          <div className="panel tasks-panel">
            <div className="panel-head">
              <div>
                <h2>Tasks</h2>
                <p className="muted">Track work across the product team.</p>
              </div>
              <div className="task-tools">
                <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" /></label>
                <div className="filters">
                {["ALL", "TODO", "IN_PROGRESS", "DONE"].map((x) => (
                  <button
                    className={filter === x ? "selected" : ""}
                    onClick={() => setFilter(x)}
                    key={x}
                  >
                    {x === "ALL" ? "All" : x.replace("_", " ")}
                  </button>
                ))}
                </div>
              </div>
            </div>
            {loading ? (
              <div className="empty">Loading tasks…</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Assignee</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div className="task-title">
                            <span
                              className={`dot ${t.status.toLowerCase()}`}
                            ></span>
                            <div>
                              <b>{t.title}</b>
                              <small>{t.description || "No description added"}</small>
                            </div>
                          </div>
                        </td>
                        <td>{t.assignee}</td>
                        <td>
                          <span
                            className={`priority ${t.priority.toLowerCase()}`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <select className={`status-select ${t.status.toLowerCase()}`} value={t.status} disabled={saving === t.id} onChange={(e) => update(t, e.target.value)} aria-label={`Status for ${t.title}`}>
                            <option value="TODO">To do</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visible.length && (
                  <div className="empty">No tasks in this filter.</div>
                )}
              </div>
            )}
          </div>
          <aside className="panel activity">
            <div className="panel-head">
              <div>
                <h2>Recent activity</h2>
                <p className="muted">Latest workspace events.</p>
              </div>
            </div>
            <Activity
              icon="✓"
              text="Monitoring dashboard completed"
              time="12 min ago"
            />
            <Activity
              icon="◔"
              text="Release task moved to in progress"
              time="38 min ago"
            />
            <Activity
              icon="＋"
              text="New onboarding task created"
              time="1 hr ago"
            />
            <Activity
              icon="↗"
              text="Deployment pipeline passed"
              time="2 hrs ago"
            />
            <div className="pipeline">
              <span>CI</span>
              <i></i>
              <span>Build</span>
              <i></i>
              <span>Scan</span>
              <i></i>
              <span>Deploy</span>
            </div>
          </aside>
        </section>
        {showForm && (
          <div className="modal-backdrop">
            <form className="modal" onSubmit={create}>
              <div className="modal-head">
                <div>
                  <p className="eyebrow">CREATE TASK</p>
                  <h2>Add a new task</h2>
                </div>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <label>
                Task title
                <input
                  name="title"
                  required
                  placeholder="e.g. Configure production ingress"
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  placeholder="What needs to be done?"
                />
              </label>
              <div className="form-row">
                <label>
                  Priority
                  <select name="priority">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                  </select>
                </label>
                <label>
                  Assignee
                  <input name="assignee" defaultValue="Aashu Ravaliya" />
                </label>
              </div>
              <button className="primary full">Create task</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
function Stat({ label, value, icon }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>Updated just now</span>
      </div>
    </div>
  );
}
function Activity({ icon, text, time }) {
  return (
    <div className="activity-row">
      <span className="activity-icon">{icon}</span>
      <div>
        <b>{text}</b>
        <small>{time}</small>
      </div>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
