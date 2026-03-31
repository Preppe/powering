interface PageHeaderProps {
  onAddClick: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  title: string;
  description: string;
  buttonLabel: string;
}

export function PageHeader({
  onAddClick,
  search,
  onSearchChange,
  title,
  description,
  buttonLabel,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">{title}</h2>
        <p className="text-on-surface-variant font-medium">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cerca..."
            className="pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 w-56 transition-all"
          />
        </div>
        <button
          onClick={onAddClick}
          className="px-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined">add_circle</span>
          {buttonLabel}
        </button>
      </div>
    </header>
  );
}
