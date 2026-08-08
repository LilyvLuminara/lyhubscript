"use client";

export interface FilterState {
  status: string;
  access: string;
  sort: string;
}

export default function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
}) {
  return (
    <aside className="w-full md:w-52 shrink-0 space-y-6 font-mono text-sm">
      <div>
        <p className="text-ash text-xs uppercase tracking-wider mb-2">Status</p>
        {["all", "working", "patched", "unverified"].map((s) => (
          <label key={s} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={value.status === s}
              onChange={() => onChange({ ...value, status: s })}
              className="accent-white"
            />
            {s === "all" ? "semua" : s}
          </label>
        ))}
      </div>
      <div>
        <p className="text-ash text-xs uppercase tracking-wider mb-2">Akses</p>
        {["all", "free", "key", "paid"].map((s) => (
          <label key={s} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="radio"
              name="access"
              checked={value.access === s}
              onChange={() => onChange({ ...value, access: s })}
              className="accent-white"
            />
            {s === "all" ? "semua" : s}
          </label>
        ))}
      </div>
      <div>
        <p className="text-ash text-xs uppercase tracking-wider mb-2">Urutkan</p>
        <select
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
          className="w-full bg-void border border-line px-2 py-1.5"
        >
          <option value="newest">Terbaru</option>
          <option value="popular">Terpopuler</option>
          <option value="views">Views terbanyak</option>
        </select>
      </div>
    </aside>
  );
}
