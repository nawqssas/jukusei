import { useState, useEffect } from 'react';

const STORAGE_KEY = 'jukusei_data';

function getElapsed(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}日`;
  if (hours > 0) return `${hours}時間`;
  if (minutes > 0) return `${minutes}分`;
  return '今';
}

const DIFFICULTY_LABELS = ['易', '中', '難'];
const DIFFICULTY_COLORS = ['#8DBF6A', '#E8A84A', '#E86A6A'];

export default function App() {
  const [screen, setScreen] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newDiscovery, setNewDiscovery] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setQuestions(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (data) => {
    setQuestions(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    const q = {
      id: Date.now(),
      text: newQuestion.trim(),
      createdAt: new Date().toISOString(),
      discoveries: [],
    };
    save([q, ...questions]);
    setNewQuestion('');
    setScreen('questions');
  };

  const addDiscovery = () => {
    if (!newDiscovery.trim() || !selectedQuestion) return;
    const d = {
      id: Date.now(),
      text: newDiscovery.trim(),
      difficulty,
      createdAt: new Date().toISOString(),
      elapsed: getElapsed(selectedQuestion.createdAt),
    };
    const updated = questions.map((q) =>
      q.id === selectedQuestion.id
        ? { ...q, discoveries: [...q.discoveries, d] }
        : q
    );
    save(updated);
    setSelectedQuestion((prev) => ({
      ...prev,
      discoveries: [...prev.discoveries, d],
    }));
    setNewDiscovery('');
    setDifficulty(1);
    setScreen('questions');
  };

  const deleteQuestion = (id) => {
    save(questions.filter((q) => q.id !== id));
    setDeleteConfirm(null);
  };

  const s = {
    app: {
      minHeight: '100vh',
      background: '#0F1117',
      color: '#E8EAF0',
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid #1E2130',
      position: 'sticky',
      top: 0,
      background: '#0F1117',
      zIndex: 20,
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      color: '#E8EAF0',
      cursor: 'pointer',
      padding: '4px 8px',
      fontSize: 20,
      lineHeight: 1,
      borderRadius: 6,
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: '#8DBF6A',
      cursor: 'pointer',
      fontSize: 13,
      padding: '4px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    content: {
      flex: 1,
      padding: '20px 20px 100px',
      overflowY: 'auto',
    },
    fab: {
      position: 'fixed',
      bottom: 28,
      right: 24,
      width: 52,
      height: 52,
      borderRadius: '50%',
      background: '#8DBF6A',
      color: '#0F1117',
      border: 'none',
      fontSize: 24,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(141,191,106,0.35)',
      zIndex: 15,
    },
    card: {
      background: '#161922',
      borderRadius: 12,
      padding: '16px 18px',
      marginBottom: 12,
      border: '1px solid #1E2130',
    },
    cardText: {
      fontSize: 15,
      lineHeight: 1.6,
      marginBottom: 8,
      color: '#E8EAF0',
      cursor: 'pointer',
    },
    meta: {
      fontSize: 11,
      color: '#4A5568',
      letterSpacing: '0.04em',
    },
    badge: (count) => ({
      display: 'inline-block',
      marginLeft: 8,
      padding: '1px 7px',
      borderRadius: 20,
      fontSize: 10,
      background: count > 0 ? 'rgba(141,191,106,0.15)' : 'transparent',
      color: count > 0 ? '#8DBF6A' : '#4A5568',
      border: `1px solid ${count > 0 ? '#8DBF6A44' : '#1E2130'}`,
    }),
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    deleteBtn: {
      background: 'none',
      border: 'none',
      color: '#4A5568',
      fontSize: 11,
      cursor: 'pointer',
      padding: '4px 0',
    },
    sheet: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 100,
    },
    sheetInner: {
      background: '#161922',
      width: '100%',
      maxWidth: 480,
      margin: '0 auto',
      borderRadius: '20px 20px 0 0',
      padding: '28px 24px 40px',
      border: '1px solid #1E2130',
    },
    sheetTitle: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 20,
      color: '#E8EAF0',
    },
    textarea: {
      width: '100%',
      background: '#0F1117',
      border: '1px solid #2A2F40',
      borderRadius: 10,
      color: '#E8EAF0',
      fontSize: 15,
      padding: '14px',
      resize: 'none',
      outline: 'none',
      fontFamily: 'inherit',
      lineHeight: 1.6,
      boxSizing: 'border-box',
    },
    difficultyRow: {
      display: 'flex',
      gap: 10,
      marginTop: 16,
    },
    diffBtn: (active, i) => ({
      flex: 1,
      padding: '10px 0',
      borderRadius: 8,
      border: `1px solid ${active ? DIFFICULTY_COLORS[i] : '#2A2F40'}`,
      background: active ? `${DIFFICULTY_COLORS[i]}22` : 'transparent',
      color: active ? DIFFICULTY_COLORS[i] : '#4A5568',
      fontSize: 13,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }),
    submitBtn: {
      width: '100%',
      marginTop: 20,
      padding: '14px',
      borderRadius: 10,
      background: '#8DBF6A',
      color: '#0F1117',
      border: 'none',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
    },
    cancelBtn: {
      width: '100%',
      marginTop: 10,
      padding: '12px',
      borderRadius: 10,
      background: 'transparent',
      color: '#4A5568',
      border: '1px solid #1E2130',
      fontSize: 14,
      cursor: 'pointer',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#4A5568',
      fontSize: 14,
      lineHeight: 2,
    },
    elapsedBig: {
      fontFamily: 'monospace',
      fontSize: 28,
      color: '#8DBF6A',
      fontWeight: 700,
    },
    discoveryCard: {
      background: '#0F1117',
      borderRadius: 8,
      padding: '14px',
      marginBottom: 10,
      borderLeft: '3px solid #8DBF6A44',
    },
    menuDropdown: {
      position: 'absolute',
      top: 56,
      right: 16,
      background: '#1E2130',
      borderRadius: 10,
      border: '1px solid #2A2F40',
      zIndex: 50,
      minWidth: 160,
      overflow: 'hidden',
    },
    menuItem: {
      display: 'block',
      width: '100%',
      padding: '14px 18px',
      background: 'none',
      border: 'none',
      color: '#E8EAF0',
      fontSize: 14,
      textAlign: 'left',
      cursor: 'pointer',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 40,
    },
    confirmBox: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '0 24px',
    },
    confirmInner: {
      background: '#161922',
      borderRadius: 14,
      padding: '24px',
      width: '100%',
      maxWidth: 360,
      border: '1px solid #2A2F40',
    },
  };

  const questionsWithDiscoveries = questions.filter(
    (q) => q.discoveries.length > 0
  );

  return (
    <div style={s.app}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        button:active { opacity: 0.75; }
      `}</style>

      <header style={s.header}>
        {screen === 'discoveryList' || screen === 'discoveryDetail' ? (
          <>
            <button
              style={s.backBtn}
              onClick={() => {
                if (screen === 'discoveryDetail') setScreen('discoveryList');
                else setScreen('questions');
              }}
            >
              ← {screen === 'discoveryDetail' ? '発見一覧' : '問い'}
            </button>
            <span style={{ width: 32 }} />
          </>
        ) : (
          <>
            <span style={{ width: 32 }} />
            <button style={s.menuBtn} onClick={() => setMenuOpen((v) => !v)}>
              ⋮
            </button>
          </>
        )}
      </header>

      {menuOpen && (
        <>
          <div style={s.overlay} onClick={() => setMenuOpen(false)} />
          <div style={s.menuDropdown}>
            <button
              style={s.menuItem}
              onClick={() => {
                setMenuOpen(false);
                setScreen('discoveryList');
              }}
            >
              💡 発見一覧
            </button>
          </div>
        </>
      )}

      <div style={s.content}>
        {screen === 'questions' &&
          (questions.length === 0 ? (
            <div style={s.emptyState}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🌱</div>
              最初の問いを立ててみましょう
              <br />
              右下の ＋ から記録できます
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                style={{
                  ...s.card,
                  animation:
                    q.discoveries.length === 0
                      ? 'pulse 3s ease-in-out infinite'
                      : 'none',
                }}
              >
                <div
                  style={s.cardText}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setScreen('addDiscovery');
                  }}
                >
                  {q.text}
                </div>
                <div style={s.cardFooter}>
                  <div style={s.meta}>
                    {new Date(q.createdAt).toLocaleDateString('ja-JP')}
                    <span style={s.badge(q.discoveries.length)}>
                      {q.discoveries.length > 0
                        ? `発見 ${q.discoveries.length}`
                        : '熟成中'}
                    </span>
                  </div>
                  <button
                    style={s.deleteBtn}
                    onClick={() => setDeleteConfirm(q.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          ))}

        {screen === 'discoveryList' &&
          (questionsWithDiscoveries.length === 0 ? (
            <div style={s.emptyState}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>💡</div>
              まだ発見が記録されていません
              <br />
              問いをタップして発見を記録しましょう
            </div>
          ) : (
            questionsWithDiscoveries.map((q) => (
              <div
                key={q.id}
                style={{ ...s.card, cursor: 'pointer' }}
                onClick={() => {
                  setSelectedQuestion(q);
                  setScreen('discoveryDetail');
                }}
              >
                <div style={{ ...s.cardText, marginBottom: 6 }}>{q.text}</div>
                <div style={s.meta}>
                  <span style={s.badge(q.discoveries.length)}>
                    発見 {q.discoveries.length}
                  </span>
                  <span style={{ marginLeft: 8 }}>
                    最新：
                    {getElapsed(
                      q.discoveries[q.discoveries.length - 1].createdAt
                    )}
                    前
                  </span>
                </div>
              </div>
            ))
          ))}

        {screen === 'discoveryDetail' && selectedQuestion && (
          <>
            <div style={{ ...s.meta, marginBottom: 20, lineHeight: 1.8 }}>
              問いを立ててから{' '}
              <span
                style={{
                  color: '#8DBF6A',
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}
              >
                {getElapsed(selectedQuestion.createdAt)}
              </span>{' '}
              経過
            </div>
            {[...selectedQuestion.discoveries].reverse().map((d) => (
              <div key={d.id} style={s.discoveryCard}>
                <div
                  style={{
                    fontSize: 14,
                    color: '#E8EAF0',
                    lineHeight: 1.7,
                    marginBottom: 10,
                  }}
                >
                  {d.text}
                </div>
                <div style={{ display: 'flex', gap: 12, ...s.meta }}>
                  <span style={{ color: DIFFICULTY_COLORS[d.difficulty] }}>
                    難易度：{DIFFICULTY_LABELS[d.difficulty]}
                  </span>
                  <span>問いから {d.elapsed} 後</span>
                  <span>
                    {new Date(d.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {screen === 'questions' && (
        <button style={s.fab} onClick={() => setScreen('addQuestion')}>
          ＋
        </button>
      )}

      {screen === 'addQuestion' && (
        <div style={s.sheet} onClick={() => setScreen('questions')}>
          <div style={s.sheetInner} onClick={(e) => e.stopPropagation()}>
            <div style={s.sheetTitle}>今、何が気になっていますか？</div>
            <textarea
              style={{ ...s.textarea, height: 100 }}
              placeholder="例：なぜ朝は頭が冴えているのか"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              autoFocus
            />
            <button style={s.submitBtn} onClick={addQuestion}>
              記録する
            </button>
            <button style={s.cancelBtn} onClick={() => setScreen('questions')}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {screen === 'addDiscovery' && selectedQuestion && (
        <div style={s.sheet} onClick={() => setScreen('questions')}>
          <div style={s.sheetInner} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.meta, marginBottom: 6 }}>問い</div>
            <div
              style={{
                fontSize: 14,
                color: '#C8CACD',
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              {selectedQuestion.text}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <span style={s.elapsedBig}>
                {getElapsed(selectedQuestion.createdAt)}
              </span>
              <span style={s.meta}>経過</span>
            </div>
            <textarea
              style={{ ...s.textarea, height: 90 }}
              placeholder="どんな発見がありましたか？"
              value={newDiscovery}
              onChange={(e) => setNewDiscovery(e.target.value)}
              autoFocus
            />
            <div style={{ ...s.meta, marginTop: 16, marginBottom: 8 }}>
              難易度
            </div>
            <div style={s.difficultyRow}>
              {DIFFICULTY_LABELS.map((label, i) => (
                <button
                  key={i}
                  style={s.diffBtn(difficulty === i, i)}
                  onClick={() => setDifficulty(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button style={s.submitBtn} onClick={addDiscovery}>
              発見を記録する
            </button>
            <button style={s.cancelBtn} onClick={() => setScreen('questions')}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={s.confirmBox}>
          <div style={s.confirmInner}>
            <div
              style={{
                fontSize: 15,
                color: '#E8EAF0',
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              問いを削除しますか？
            </div>
            <div style={{ ...s.meta, marginBottom: 24, lineHeight: 1.8 }}>
              この問いに紐づく発見もすべて削除されます。
            </div>
            <button
              style={{ ...s.submitBtn, marginTop: 0, background: '#E86A6A' }}
              onClick={() => deleteQuestion(deleteConfirm)}
            >
              削除する
            </button>
            <button style={s.cancelBtn} onClick={() => setDeleteConfirm(null)}>
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
