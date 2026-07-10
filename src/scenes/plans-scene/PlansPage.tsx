"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type PlanId = "free" | "plus" | "pro";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  features: string[];
  cta: string;
  recommended?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: "0 VND",
    cta: "Tiếp tục với Free",
    features: [
      "Xem preview 1–2 phút mỗi tác phẩm",
      "Tối đa 5 cultural insights mỗi tác phẩm",
      "Shadowing chỉ có trong preview",
      "Có Virtual Ticket Booth",
      "Không có extended learning tools",
    ],
  },
  {
    id: "plus",
    name: "Plus Plan",
    price: "50.000 VND/tháng",
    cta: "Chọn Plus",
    recommended: true,
    features: [
      "Xem đầy đủ thư viện tác phẩm",
      "Không giới hạn preview",
      "Tối đa 5 cultural insights mỗi tác phẩm",
      "Shadowing chỉ có trong preview",
      "Có Virtual Ticket Booth",
      "Không có extended learning tools",
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "131.000 VND/tháng hoặc 1.287.000 VND/năm",
    cta: "Chọn Pro",
    features: [
      "Xem đầy đủ thư viện tác phẩm",
      "Cultural insights không giới hạn",
      "Shadowing đầy đủ",
      "Có tất cả tính năng cao cấp",
      "Auto-translation và export flashcard",
    ],
  },
];

type PlansPageProps = {
  storySlug: string;
};

export function PlansPage({ storySlug }: PlansPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  const selectedPlanName = useMemo(() => {
    return PLANS.find((plan) => plan.id === selectedPlan)?.name ?? null;
  }, [selectedPlan]);

  const continueLabel =
    selectedPlan === "free" ? "Tiếp tục xem preview" : "Tiếp tục xem đầy đủ";
  const continueMode = selectedPlan === "free" ? "preview" : "full";

  function handleSelectPlan(planId: PlanId) {
    localStorage.setItem("selectedPlan", planId);
    setSelectedPlan(planId);
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col selection:bg-white/20 font-body antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-16 pt-32 pb-28 overflow-hidden">
        <section className="mb-12">
          <h1 className="text-[clamp(3rem,11vw,108px)] font-bold tracking-normal leading-none text-white mb-9 break-words">
            SUBSCRIPTION
          </h1>
          <div className="max-w-3xl text-sm md:text-base text-white/75 font-light leading-relaxed">
            <p>
              Chọn gói trải nghiệm phù hợp để tiếp tục mở khóa tác phẩm trong
              thư viện Việt Văn.
            </p>
            <p>
              Đây là bước kiểm thử MVP, tập trung vào luồng chọn gói trước khi
              tích hợp thanh toán thật.
            </p>
          </div>
        </section>

        {selectedPlanName && (
          <section className="mb-7 border border-white/15 bg-white/[0.04] px-4 py-3 md:px-5">
            <p className="text-sm text-white font-medium mb-1">
              Đã chọn {selectedPlanName}.
            </p>
            <p className="text-xs md:text-sm text-white/55 font-light leading-relaxed">
              Đây là đăng ký mô phỏng phục vụ kiểm thử MVP. Không phát sinh
              giao dịch thật.
            </p>
            <Link
              href={`/watch/${encodeURIComponent(storySlug)}?mode=${continueMode}`}
              className="inline-flex mt-4 border border-white bg-white text-black px-5 py-2.5 text-xs tracking-[0.18em] uppercase font-medium hover:bg-white/90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors"
            >
              {continueLabel}
            </Link>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-10 items-stretch">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <article
                key={plan.id}
                className={`relative flex min-h-[460px] flex-col px-7 py-8 shadow-[12px_18px_0_rgba(255,255,255,0.03)] transition-colors ${
                  isSelected
                    ? "border border-white bg-[#4b4b4b]"
                    : "border border-white/5 bg-[#2e2e2e]"
                } ${plan.recommended ? "lg:-mt-5 lg:min-h-[500px]" : ""}`}
              >
                {plan.recommended && (
                  <div className="absolute right-5 top-5 border border-white/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/75">
                    Đề xuất
                  </div>
                )}

                <div className="text-center mb-8 pt-5">
                  <h2 className="text-2xl font-bold uppercase tracking-normal text-white mb-3">
                    {plan.name}
                  </h2>
                  <p className="text-lg md:text-xl font-semibold text-white/90 leading-snug">
                    {plan.price}
                  </p>
                </div>

                <ul className="space-y-4 text-sm text-white/72 font-light leading-relaxed">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-white/60" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`mt-auto w-full border px-5 py-3 text-xs tracking-[0.18em] uppercase font-medium focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/70 focus-visible:outline-offset-4 transition-colors ${
                    isSelected
                      ? "border-white bg-white text-black"
                      : "border-white/25 text-white/85 hover:border-white hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </article>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
