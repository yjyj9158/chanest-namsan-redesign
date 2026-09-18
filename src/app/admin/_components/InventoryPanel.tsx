"use client";

import { useState } from "react";
import { Minus, Pencil, Plus, X } from "lucide-react";
import { useAdmin } from "../_context/AdminContext";
import { formatKRWAmount, type MockInventoryItem } from "../_data/mock";
import { RoomsManager } from "./RoomsManager";
import { cn } from "@/lib/utils";

const LOW_STOCK = 3;
const MENU_CATEGORIES = [
  "Snack",
  "Soft Drink",
  "Whisky",
  "Wine",
  "Soju",
  "Highball",
] as const;

export function InventoryPanel() {
  const {
    inventory,
    updateInventoryQty,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    loading,
    inventoryError,
  } = useAdmin();
  const [editorOpen, setEditorOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(MENU_CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("0");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<string>(MENU_CATEGORIES[0]);
  const [editPrice, setEditPrice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MockInventoryItem | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  function startEdit(item: MockInventoryItem) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(
      MENU_CATEGORIES.includes(item.category as (typeof MENU_CATEGORIES)[number])
        ? item.category
        : MENU_CATEGORIES[0],
    );
    setEditPrice(String(item.price ?? 0));
  }

  async function handleAdd() {
    if (adding) return;
    setAdding(true);
    const ok = await addInventoryItem({
      name,
      category,
      price: Number(price) || 0,
      qty: Number(qty) || 0,
    });
    setAdding(false);
    if (ok) {
      setName("");
      setPrice("");
      setQty("0");
      setCategory(MENU_CATEGORIES[0]);
    }
  }

  async function handleSave(id: string) {
    if (savingId) return;
    setSavingId(id);
    const ok = await updateInventoryItem(id, {
      name: editName,
      category: editCategory,
      price: Number(editPrice) || 0,
    });
    setSavingId(null);
    if (ok) setEditingId(null);
  }

  async function handleDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    const ok = await deleteInventoryItem(pendingDelete.id);
    setDeleting(false);
    if (ok) setPendingDelete(null);
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-serif text-3xl">재고</h1>
        <p className="mt-1 text-sm text-muted">
          미니바 재고 수량 조정 (로컬 미리보기 · 원본 카테고리 유지)
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl">메뉴 관리</h2>
          <button
            type="button"
            onClick={() => setEditorOpen((open) => !open)}
            className="text-sm font-medium text-gold-dark underline-offset-4 hover:underline"
          >
            {editorOpen ? "접기" : "메뉴 편집"}
          </button>
        </div>

        {editorOpen && (
          <form
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5"
            onSubmit={(e) => {
              e.preventDefault();
              void handleAdd();
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="상품명"
              className="col-span-2 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold sm:col-span-1"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            >
              {MENU_CATEGORIES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="가격(원)"
              className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="초기 재고"
              className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={adding || !name.trim()}
              className="rounded-xl bg-charcoal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark disabled:opacity-40"
            >
              {adding ? "추가 중…" : "추가"}
            </button>
          </form>
        )}
      </section>

      {inventoryError && (
        <p className="rounded-xl border border-admin-alert/30 bg-admin-alert-bg px-4 py-3 text-sm text-admin-alert">
          {inventoryError}
        </p>
      )}

      {loading && inventory.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
          불러오는 중…
        </p>
      )}

      <div className="space-y-3">
        {inventory.map((item) => {
          const available = item.qty > 0;
          const isLow = available && item.qty <= LOW_STOCK;
          const isSoldOut = !available;
          const isEditing = editingId === item.id;

          return (
            <article
              key={item.id}
              className={cn(
                "rounded-2xl border bg-white p-4 shadow-sm",
                isSoldOut
                  ? "border-admin-alert/40"
                  : isLow
                    ? "border-admin-alert/35"
                    : "border-line"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="col-span-2 rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-1"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
                      >
                        {MENU_CATEGORIES.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={0}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-[0.65rem] font-medium tracking-widest text-gold uppercase">
                        {item.category}
                      </div>
                      <h2 className="mt-0.5 truncate font-serif text-xl">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        {formatKRWAmount(item.price)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {isSoldOut && (
                          <span className="inline-flex rounded-full bg-admin-alert-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-alert">
                            ● 품절
                          </span>
                        )}
                        {isLow && (
                          <span className="inline-flex rounded-full bg-admin-alert-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-alert">
                            ● 재고 부족
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => void handleSave(item.id)}
                        disabled={savingId === item.id || !editName.trim()}
                        className="rounded-full bg-charcoal px-3 py-2 text-xs font-medium text-white hover:bg-gold-dark disabled:opacity-40"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-full border border-line px-3 py-2 text-xs text-muted"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold-dark"
                        aria-label={`${item.name} 수정`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateInventoryQty(item.id, -1)}
                        disabled={item.qty === 0}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors enabled:hover:border-gold enabled:hover:text-gold-dark disabled:opacity-30"
                        aria-label={`${item.name} 수량 감소`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span
                        className={cn(
                          "min-w-[2rem] text-center font-serif text-2xl tabular-nums",
                          (isLow || isSoldOut) && "text-admin-alert"
                        )}
                      >
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateInventoryQty(item.id, 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-white transition-colors hover:bg-gold-dark"
                        aria-label={`${item.name} 수량 증가`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-light/70 transition-colors hover:text-admin-alert"
                        aria-label={`${item.name} 삭제`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {pendingDelete ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/40 p-4"
          onClick={() => !deleting && setPendingDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl">정말 삭제할까요?</h3>
            <p className="mt-2 text-sm text-muted">
              {pendingDelete.name} 상품이 고객 미니바에서도 사라집니다.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="rounded-full border border-line px-4 py-2 text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-40"
              >
                {deleting ? "삭제 중…" : "삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <RoomsManager />
    </div>
  );
}
