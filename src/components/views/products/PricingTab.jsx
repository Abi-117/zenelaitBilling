import { useState, useEffect } from "react";
import Card from "../../ui/Card";
import { Plus, Trash2 } from "lucide-react";

const PricingTab = () => {
  /* ---------------- STATE ---------------- */
  const [pricing, setPricing] = useState({ cost: "", selling: "", mrp: "" });
  
  // Default variants: Retail + Wholesale
  const defaultVariants = [
    { id: "retail", label: "Retail", selling: "", mrp: "" },
    { id: "wholesale", label: "Wholesale", selling: "", mrp: "" },
  ];
  
  const [variants, setVariants] = useState(defaultVariants);
  const [errors, setErrors] = useState({});
  const [profitMargins, setProfitMargins] = useState({});

  /* ---------------- PROFIT MARGIN ---------------- */
  useEffect(() => {
    const margins = {};
    const baseCost = Number(pricing.cost) || 0;

    variants.forEach((v) => {
      const sell = Number(v.selling || pricing.selling) || 0;
      margins[v.id] = baseCost > 0 ? (((sell - baseCost) / baseCost) * 100).toFixed(1) : "0";
    });

    setProfitMargins(margins);
  }, [pricing, variants]);

  /* ---------------- VARIANT ACTIONS ---------------- */
  const addVariant = () => {
    setVariants([
      ...variants,
      { id: crypto.randomUUID(), label: "", selling: "", mrp: "" },
    ]);
  };

  const updateVariant = (id, field, value) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (id) => {
    // Always keep Retail & Wholesale
    if (variants.length <= 2) return;
    setVariants(variants.filter((v) => v.id !== id));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};
    const cost = Number(pricing.cost);
    const selling = Number(pricing.selling);
    const mrp = Number(pricing.mrp);

    // Base pricing
    if (!pricing.cost) e.cost = "Cost is required";
    if (!pricing.selling) e.selling = "Selling is required";
    if (!pricing.mrp) e.mrp = "MRP is required";
    if (!e.selling && selling < cost) e.selling = "Selling < Cost not allowed";
    if (!e.mrp && mrp < selling) e.mrp = "MRP < Selling not allowed";

    // Variants
    variants.forEach((v, i) => {
      const vsell = Number(v.selling || pricing.selling);
      const vmrp = Number(v.mrp || pricing.mrp);
      if (!v.label) e[`label_${i}`] = "Label required";
      if (vsell < selling) e[`selling_${i}`] = "Variant selling < Base selling";
      if (vmrp < vsell) e[`mrp_${i}`] = "Variant MRP < Selling";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheck = () => {
    if (validate()) {
      alert("Pricing ✅ Valid");
    } else {
      alert("Pricing ❌ Invalid, check fields");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* BASE PRICING */}
      <Card>
        <h3 className="font-semibold mb-4">Base Pricing</h3>
        <div className="grid grid-cols-3 gap-4">
          {["cost", "selling", "mrp"].map((f) => (
            <div key={f} className="flex flex-col">
              <input
                type="number"
                className="input"
                placeholder={f.toUpperCase()}
                value={pricing[f]}
                onChange={(e) => setPricing({ ...pricing, [f]: e.target.value })}
              />
              {errors[f] && <span className="text-xs text-red-500">{errors[f]}</span>}
            </div>
          ))}
        </div>
      </Card>

      {/* VARIANTS */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Variants</h3>
          <button
            onClick={addVariant}
            className="flex items-center gap-1 text-blue-600 text-sm"
          >
            <Plus size={14} /> Add Variant
          </button>
        </div>

        {variants.map((v, i) => (
          <div key={v.id} className="grid grid-cols-5 gap-3 items-center mb-2">
            <div className="flex flex-col">
              <input
                className="input"
                placeholder="Label"
                value={v.label}
                onChange={(e) => updateVariant(v.id, "label", e.target.value)}
                disabled={v.id === "retail" || v.id === "wholesale"} // cannot remove default
              />
              {errors[`label_${i}`] && <span className="text-xs text-red-500">{errors[`label_${i}`]}</span>}
            </div>

            <div className="flex flex-col">
              <input
                type="number"
                className="input"
                placeholder="Selling"
                value={v.selling || pricing.selling}
                onChange={(e) => updateVariant(v.id, "selling", e.target.value)}
              />
              {errors[`selling_${i}`] && <span className="text-xs text-red-500">{errors[`selling_${i}`]}</span>}
            </div>

            <div className="flex flex-col">
              <input
                type="number"
                className="input"
                placeholder="MRP"
                value={v.mrp || pricing.mrp}
                onChange={(e) => updateVariant(v.id, "mrp", e.target.value)}
              />
              {errors[`mrp_${i}`] && <span className="text-xs text-red-500">{errors[`mrp_${i}`]}</span>}
            </div>

            <div className="text-right font-semibold text-green-600">
              {profitMargins[v.id]}%
            </div>

            {(v.id !== "retail" && v.id !== "wholesale") && (
              <button
                onClick={() => removeVariant(v.id)}
                className="text-rose-500"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </Card>

      {/* VALIDATE BUTTON */}
      <div className="text-right">
        <button
          onClick={handleCheck}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Validate Pricing
        </button>
      </div>
    </div>
  );
};

export default PricingTab;
