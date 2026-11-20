"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ErpForm, { ErpFormValues, erpToForm } from "@/components/admin/ErpForm";

export default function EditErpPage() {
  const { id } = useParams<{ id: string }>();
  const [values, setValues] = useState<ErpFormValues | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/portfolio/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        setValues(erpToForm((await res.json()).data));
      } catch {
        setError(true);
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="font-medium text-[var(--sub)]">Failed to load this ERP.</p>
        <Link href="/erp-manager" className="text-[var(--accent)] hover:underline">
          Back to ERP Systems
        </Link>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[var(--ink)]" size={32} />
      </div>
    );
  }

  return <ErpForm id={id} initial={values} />;
}
