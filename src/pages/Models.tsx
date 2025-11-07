// src/pages/Models.tsx
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Brain, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MODELS, ModelInfo, saveSelectedModel } from "@/data/models";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const iconMap = {
  brain: Brain,
  zap: Zap,
  bot: Bot,
  sparkles: Sparkles,
} as const;

/** Helpers to read "Provider: X" and "Context: 131K" from features[] without changing your data shape */
function getProvider(m: ModelInfo): string {
  const provider = m.features.find((f) => /^Provider:\s*/i.test(f));
  return provider ? provider.replace(/^Provider:\s*/i, "") : "Unknown";
}
function parseContextToNumber(m: ModelInfo): number {
  // returns tokens count as an integer (e.g., 131_000 for 131K, 1_000_000 for 1M)
  const ctx = m.features.find((f) => /^Context:\s*/i.test(f));
  if (!ctx) return 0;
  const match = ctx.match(/Context:\s*([0-9.]+)\s*([kKmM]?)/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = (match[2] || "").toLowerCase();
  if (unit === "m") return Math.round(value * 1_000_000);
  if (unit === "k") return Math.round(value * 1_000);
  return Math.round(value);
}

type SortKey =
  | "name-asc"
  | "name-desc"
  | "context-desc"
  | "context-asc"
  | "provider-asc";

export default function Models() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // toolbar state
  const [search, setSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name-asc");

  // derived facets
  const badges = useMemo(
    () =>
      Array.from(new Set(MODELS.map((m) => m.badge))).sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );
  const providers = useMemo(
    () =>
      Array.from(new Set(MODELS.map(getProvider))).sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    let items = MODELS.filter((m) => {
      const matchesBadge =
        badgeFilter === "all" ? true : m.badge.toLowerCase() === badgeFilter;
      const prov = getProvider(m).toLowerCase();
      const matchesProvider =
        providerFilter === "all" ? true : prov === providerFilter;

      const hay =
        `${m.name} ${m.description} ${m.features.join(" ")}`.toLowerCase();
      const matchesSearch = s.length === 0 ? true : hay.includes(s);

      return matchesBadge && matchesProvider && matchesSearch;
    });

    items = items.slice().sort((a, b) => {
      switch (sortKey) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "provider-asc":
          return getProvider(a).localeCompare(getProvider(b));
        case "context-desc":
          return parseContextToNumber(b) - parseContextToNumber(a);
        case "context-asc":
          return parseContextToNumber(a) - parseContextToNumber(b);
        default:
          return 0;
      }
    });

    return items;
  }, [search, badgeFilter, providerFilter, sortKey]);

  const selectModel = (m: ModelInfo) => {
    saveSelectedModel(m.id);
    toast({ title: "Model selected", description: m.name });
    navigate("/chat");
  };

  const onKeyActivate =
    (m: ModelInfo) =>
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectModel(m);
      }
    };

  const clearFilters = () => {
    setSearch("");
    setBadgeFilter("all");
    setProviderFilter("all");
    setSortKey("name-asc");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Available Models</h1>
            <p className="text-lg text-muted-foreground">
              Search, filter, and sort — then click a model to use it in chat.
            </p>
          </div>

          {/* Toolbar */}
          <div className="grid gap-3 md:grid-cols-12 items-end">
            {/* Search */}
            <div className="md:col-span-5">
              <label className="text-xs font-medium text-muted-foreground">
                Search
              </label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models, descriptions, providers…"
                className="mt-1"
              />
            </div>

            {/* Badge filter */}
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                Badge
              </label>
              <Select
                value={badgeFilter}
                onValueChange={(v) => setBadgeFilter(v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All badges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All badges</SelectItem>
                  {badges.map((b) => (
                    <SelectItem key={b} value={b.toLowerCase()}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provider filter */}
            <div className="md:col-span-3">
              <label className="text-xs font-medium text-muted-foreground">
                Provider
              </label>
              <Select
                value={providerFilter}
                onValueChange={(v) => setProviderFilter(v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All providers" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all">All providers</SelectItem>
                  {providers.map((p) => (
                    <SelectItem key={p} value={p.toLowerCase()}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                Sort by
              </label>
              <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A → Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z → A)</SelectItem>
                  <SelectItem value="context-desc">Context (High → Low)</SelectItem>
                  <SelectItem value="context-asc">Context (Low → High)</SelectItem>
                  <SelectItem value="provider-asc">Provider (A → Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear */}
            <div className="md:col-span-12 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium">{filtered.length}</span> of{" "}
                {MODELS.length}
              </p>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 border rounded-lg">
              <p className="text-sm text-muted-foreground">
                No models match your current search/filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((model) => {
                const Icon = iconMap[model.icon];
                return (
                  <Card
                    key={model.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${model.name}`}
                    onClick={() => selectModel(model)}
                    onKeyDown={onKeyActivate(model)}
                    className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{model.badge}</Badge>
                      </div>
                      <CardTitle className="text-2xl mt-4">
                        {model.name}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {model.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Key Features:</p>
                        <ul className="space-y-1">
                          {model.features.map((feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
