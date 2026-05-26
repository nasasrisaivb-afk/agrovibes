export type MainCategory = "produce" | "machinery" | "knowledge" | "services";

export type SubCategory = string;

export const SUBCATEGORIES: Record<
  MainCategory,
  Array<{ label: string; value: string }>
> = {
  produce: [
    { label: "All", value: "all" },
    { label: "Fruits", value: "Fruits" },
    { label: "Vegetables", value: "Vegetables" },
    { label: "Grains", value: "Grains" },
    { label: "Spices", value: "Spices" },
    { label: "Organic", value: "Organic" },
    { label: "Dairy", value: "Dairy" },
    { label: "Eggs", value: "Eggs" },
  ],
  machinery: [
    { label: "All", value: "all" },
    { label: "Tractors", value: "Tractor" },
    { label: "Harvesting", value: "Harvester" },
    { label: "Irrigation", value: "Irrigation" },
    { label: "Tools", value: "Tools" },
    { label: "Technology", value: "Technology" },
  ],
  knowledge: [
    { label: "All", value: "all" },
    { label: "Courses", value: "Courses" },
    { label: "Workshops", value: "Workshops" },
    { label: "Consultations", value: "Consultations" },
    { label: "Certifications", value: "Certifications" },
  ],
  services: [
    { label: "All", value: "all" },
    { label: "Rental", value: "Rental" },
    { label: "Labor", value: "Labor" },
    { label: "Transport", value: "Transport" },
    { label: "Processing", value: "Processing" },
    { label: "Storage", value: "Storage" },
  ],
};

interface CategoryFilterProps {
  mainCategory: MainCategory;
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function CategoryFilter({
  mainCategory,
  selected,
  onChange,
}: CategoryFilterProps) {
  const options = SUBCATEGORIES[mainCategory];

  const toggle = (value: string) => {
    if (value === "all") {
      onChange(["all"]);
      return;
    }
    const withoutAll = selected.filter((s) => s !== "all");
    if (withoutAll.includes(value)) {
      const next = withoutAll.filter((s) => s !== value);
      onChange(next.length === 0 ? ["all"] : next);
    } else {
      onChange([...withoutAll, value]);
    }
  };

  return (
    <fieldset
      className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2.5 border-0 p-0 m-0"
      aria-label="Subcategory filters"
    >
      {options.map((opt) => {
        const isActive =
          selected.includes(opt.value) ||
          (opt.value === "all" && selected.length === 0);
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-smooth border ${
              isActive
                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
            data-ocid="subcategory-filter"
            aria-pressed={isActive}
          >
            {opt.label}
          </button>
        );
      })}
    </fieldset>
  );
}
