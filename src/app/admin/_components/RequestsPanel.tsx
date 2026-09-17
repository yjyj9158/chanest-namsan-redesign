"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, ChevronDown, Pencil, Plus, Send, X } from "lucide-react";
import { type RequestStatus, type RequestType } from "../_data/mock";
import { useAdmin } from "../_context/AdminContext";
import { supabase } from "@/lib/supabase";
import { cn, formatTimeAgo } from "@/lib/utils";

type QuickReply = {
  id: string;
  text: string;
  sort_order: number;
};

const TYPE_FILTERS: { id: "all" | RequestType; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "order", label: "주문" },
  { id: "amenity", label: "요청" },
  { id: "question", label: "문의" },
];

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "unanswered") {
    return (
      <span className="inline-flex items-center rounded-full bg-admin-alert-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-alert">
        ● 미답변
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-admin-ok-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-ok">
      ✓ 답변완료
    </span>
  );
}

function TypeBadge({ type }: { type: RequestType }) {
  if (type === "order") {
    return (
      <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.62rem] font-medium text-gold-dark">
        주문
      </span>
    );
  }
  if (type === "amenity") {
    return (
      <span className="rounded-full bg-[#e8eef5] px-2 py-0.5 text-[0.62rem] font-medium text-[#4a6a8a]">
        요청
      </span>
    );
  }
  return (
    <span className="rounded-full bg-[#eee8f3] px-2 py-0.5 text-[0.62rem] font-medium text-[#6a5a7d]">
      문의
    </span>
  );
}

export function RequestsPanel() {
  const { requests, answerRequest, loading } = useAdmin();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [managerOpen, setManagerOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | RequestType>("all");

  useEffect(() => {
    let cancelled = false;

    async function loadQuickReplies() {
      const { data, error } = await supabase
        .from("quick_replies")
        .select("*")
        .order("sort_order");
      if (cancelled || error) return;
      setQuickReplies(
        (data ?? []).map((row) => ({
          id: String(row.id),
          text: row.text,
          sort_order: Number(row.sort_order) || 0,
        })),
      );
    }

    void loadQuickReplies();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      typeFilter === "all"
        ? requests
        : requests.filter((r) => r.type === typeFilter),
    [requests, typeFilter]
  );

  function sendAnswer(id: string, reply: string) {
    answerRequest(id, reply);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function submitReply(e: FormEvent, id: string) {
    e.preventDefault();
    sendAnswer(id, drafts[id] ?? "");
  }

  async function addQuickReply() {
    const text = newText.trim();
    if (!text) return;
    const sort_order =
      quickReplies.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1;
    const { data, error } = await supabase
      .from("quick_replies")
      .insert({ text, sort_order })
      .select("id, text, sort_order")
      .single();
    if (error || !data) return;
    setQuickReplies((prev) => [
      ...prev,
      {
        id: String(data.id),
        text: data.text,
        sort_order: Number(data.sort_order) || sort_order,
      },
    ]);
    setNewText("");
  }

  function startEdit(item: QuickReply) {
    setEditingId(item.id);
    setEditingText(item.text);
  }

  async function saveEdit() {
    if (!editingId) return;
    const text = editingText.trim();
    if (!text) return;
    const { error } = await supabase
      .from("quick_replies")
      .update({ text })
      .eq("id", editingId);
    if (error) return;
    setQuickReplies((prev) =>
      prev.map((item) => (item.id === editingId ? { ...item, text } : item)),
    );
    setEditingId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  async function removeQuickReply(id: string) {
    const { error } = await supabase.from("quick_replies").delete().eq("id", id);
    if (error) return;
    setQuickReplies((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-serif text-3xl">요청·문의</h1>
        <p className="mt-1 text-sm text-muted">
          게스트 Q&A (로컬 미리보기)
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setTypeFilter(f.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[0.72rem] font-medium transition-colors",
              typeFilter === f.id
                ? "bg-charcoal text-white"
                : "border border-line bg-white text-muted hover:border-gold/40"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-line bg-white">
        <button
          type="button"
          onClick={() => setManagerOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          aria-expanded={managerOpen}
        >
          <span className="text-sm font-medium text-charcoal">
            빠른 답변 편집
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform",
              managerOpen && "rotate-180"
            )}
          />
        </button>

        {managerOpen && (
          <div className="space-y-3 border-t border-line px-4 py-4">
            <p className="text-xs text-muted">
              문구를 추가·수정·삭제하면 아래 모든 미답변 카드의 칩에 바로
              반영됩니다.
            </p>

            <ul className="space-y-2">
              {quickReplies.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 rounded-xl border border-line bg-cream/60 px-3 py-2.5"
                >
                  {editingId === item.id ? (
                    <>
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit();
                          }
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="min-w-0 flex-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm outline-none focus:border-gold/50"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={!editingText.trim()}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-admin-ok transition-colors hover:bg-admin-ok-bg disabled:opacity-40"
                        aria-label="저장"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white"
                        aria-label="취소"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="min-w-0 flex-1 text-sm leading-relaxed text-charcoal">
                        {item.text}
                      </p>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white hover:text-gold-dark"
                        aria-label="수정"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuickReply(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-admin-alert-bg hover:text-admin-alert"
                        aria-label="삭제"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addQuickReply();
                  }
                }}
                placeholder="새 빠른 답변 문구"
                className="min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none placeholder:text-muted-light focus:border-gold/50"
              />
              <button
                type="button"
                onClick={addQuickReply}
                disabled={!newText.trim()}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-charcoal px-3.5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                추가
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="space-y-3">
        {loading && filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
            불러오는 중…
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
            해당 유형의 요청이 없습니다.
          </p>
        )}

        {filtered.map((req) => (
          <article
            key={req.id}
            className="rounded-2xl border border-line bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-2xl tracking-wide">
                  Room {req.room}
                </div>
                <div className="mt-1.5">
                  <TypeBadge type={req.type} />
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-charcoal">
              {req.message}
            </p>
            <div className="mt-2 text-xs text-muted-light">
              {formatTimeAgo(req.createdAt)}
            </div>

            {req.status === "answered" && req.reply ? (
              <div className="mt-4 rounded-xl bg-admin-ok-bg/70 px-4 py-3">
                <div className="text-[0.65rem] font-medium tracking-wider text-admin-ok uppercase">
                  운영자 답변
                </div>
                <p className="mt-1 text-sm leading-relaxed text-charcoal">
                  {req.reply}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => sendAnswer(req.id, item.text)}
                        className="max-w-full rounded-full border border-line bg-cream px-3 py-1.5 text-left text-[0.72rem] leading-snug text-charcoal transition-colors hover:border-gold"
                        title={item.text}
                      >
                        <span className="line-clamp-2">{item.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => submitReply(e, req.id)}
                  className="flex flex-col gap-2 sm:flex-row sm:items-end"
                >
                  <label className="sr-only" htmlFor={`reply-${req.id}`}>
                    답변 작성
                  </label>
                  <textarea
                    id={`reply-${req.id}`}
                    rows={2}
                    value={drafts[req.id] ?? ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [req.id]: e.target.value,
                      }))
                    }
                    placeholder="직접 입력…"
                    className="min-w-0 flex-1 resize-none rounded-xl border border-line bg-cream px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-light focus:border-gold/50"
                  />
                  <button
                    type="submit"
                    disabled={!(drafts[req.id] ?? "").trim()}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-charcoal px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                    보내기
                  </button>
                </form>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
