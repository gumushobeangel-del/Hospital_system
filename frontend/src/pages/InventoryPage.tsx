import { useState } from "react";
import { Icon } from "../components/Icons";
import { InventoryItem } from "../types";

interface InventoryPageProps {
  inventory: InventoryItem[];
  onRestock: (id: string, amount: number) => void;
  searchQuery: string;
}

export function InventoryPage({
  inventory,
  onRestock,
  searchQuery,
}: InventoryPageProps) {
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = inventory.filter((item) => {
    const matchSearch =
      searchQuery === "" ||
      `${item.name} ${item.category} ${item.location}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchCat = categoryFilter === "All" || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="inventory" size={13} />
            <span>CENTRAL PHARMACY & SUPPLY DEPOT</span>
          </div>
          <h1>Medical Supplies & Inventory</h1>
          <p className="page-subtitle">
            Monitor real-time pharmaceuticals, PPE, IV fluids, and diagnostic kit stock levels.
          </p>
        </div>
      </div>

      <div className="filter-controls-card">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted">SUPPLY CATEGORY:</span>
          {["All", "Pharmaceuticals", "Consumables", "PPE", "Diagnostic Supplies", "Surgical"].map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${categoryFilter === cat ? "active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Inventory Stock Levels</h2>
            <p>Showing {filtered.length} inventory catalogue items</p>
          </div>
          <span className="badge badge-teal">{filtered.length} SKUs Monitored</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU CODE</th>
                <th>SUPPLY ITEM</th>
                <th>CATEGORY</th>
                <th>DEPOT LOCATION</th>
                <th>STOCK LEVEL</th>
                <th>THRESHOLD</th>
                <th>STATUS</th>
                <th>RESTOCK</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const percent = Math.min(
                  100,
                  Math.round((item.stockLevel / (item.reorderThreshold * 2.5)) * 100)
                );
                return (
                  <tr key={item.id}>
                    <td className="font-mono text-xs font-bold text-muted">{item.id}</td>
                    <td>
                      <strong>{item.name}</strong>
                      <small className="block text-muted">Unit: {item.unit}</small>
                    </td>
                    <td>
                      <span className="badge badge-slate">{item.category}</span>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <div className="stock-level-cell">
                        <strong className="text-navy">{item.stockLevel}</strong>
                        <div className="mini-progress-bar">
                          <div
                            className={`mini-progress-fill ${
                              item.status === "Critical"
                                ? "bg-rose"
                                : item.status === "Low Stock"
                                ? "bg-amber"
                                : "bg-teal"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-muted">Min: {item.reorderThreshold}</span>
                    </td>
                    <td>
                      <span className={`status-pill status-${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        <span className="status-dot" />
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-xs btn-outline-teal"
                        onClick={() => onRestock(item.id, 50)}
                      >
                        + Restock (50)
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-table-state">
                    <Icon name="inventory" size={24} />
                    <p>No inventory items match filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
