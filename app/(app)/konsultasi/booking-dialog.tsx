"use client";

import { useState } from "react";
import { buttonClass, cx } from "@/app/components/ui";
import { CheckCircleIcon } from "@/app/components/icons";
import { NUTRITIONISTS, BOOKING_TIME_SLOTS } from "@/lib/content";
import { setBooking, type Booking } from "@/lib/booking";
import { fromISODate, shiftDate, formatShortDate, WEEKDAYS_SHORT } from "@/lib/date";

export function BookingDialog({
  today,
  onClose,
  onBooked,
}: {
  today: string;
  onClose: () => void;
  onBooked: (booking: Booking) => void;
}) {
  const days = Array.from({ length: 5 }, (_, index) => shiftDate(today, index + 1));

  const [nutritionistId, setNutritionistId] = useState(NUTRITIONISTS[0].id);
  const [date, setDate] = useState(days[0]);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const nutritionist = NUTRITIONISTS.find((item) => item.id === nutritionistId)!;

  const confirm = () => {
    if (!time) return;
    const booking: Booking = {
      nutritionistId,
      date,
      time,
      bookedAt: new Date().toISOString(),
    };
    setBooking(booking);
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="booking-title" className="font-serif text-xl text-ink">
            {confirmed ? "Sesi Terjadwal" : "Jadwalkan Konsultasi"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-11 w-11 place-items-center rounded-md text-muted transition-colors hover:bg-mist hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {confirmed ? (
          <div className="mt-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-soft text-sage">
              <CheckCircleIcon className="h-7 w-7" />
            </span>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Sesi 30 menit dengan <span className="font-medium text-ink">{nutritionist.name}</span>{" "}
              terjadwal pada{" "}
              <span className="font-medium text-ink">
                {WEEKDAYS_SHORT[fromISODate(date).getDay()]}, {formatShortDate(date)} · {time} WIB
              </span>
              .
            </p>
            <p className="mt-3 text-xs text-muted">
              Tautan panggilan video akan dikirim ke email Anda mendekati waktu sesi.
            </p>
            <button
              type="button"
              onClick={() => onBooked({ nutritionistId, date, time: time!, bookedAt: new Date().toISOString() })}
              className={buttonClass("primary", "mt-6 w-full")}
            >
              Selesai
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium text-ink">Pilih Ahli Gizi</p>
              <div className="space-y-2">
                {NUTRITIONISTS.map((item) => {
                  const active = item.id === nutritionistId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setNutritionistId(item.id)}
                      className={cx(
                        "w-full rounded-lg border p-3 text-left transition-colors",
                        active ? "border-sage bg-sage-soft" : "border-line hover:border-sage/50",
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-ink">{item.name}</span>
                        {active && <CheckCircleIcon className="h-4 w-4 shrink-0 text-sage" />}
                      </span>
                      <span className="mt-0.5 block text-xs text-sage">{item.specialty}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-body">{item.bio}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-ink">Pilih Hari</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((day) => {
                  const active = day === date;
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDate(day)}
                      className={cx(
                        "shrink-0 rounded-md border px-3 py-2 text-center text-xs transition-colors",
                        active ? "border-sage bg-sage text-white" : "border-line text-body hover:border-sage/50",
                      )}
                    >
                      <span className="block">{WEEKDAYS_SHORT[fromISODate(day).getDay()]}</span>
                      <span className="block font-medium">{formatShortDate(day)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-ink">Pilih Jam</p>
              <div className="grid grid-cols-4 gap-2">
                {BOOKING_TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={time === slot}
                    onClick={() => setTime(slot)}
                    className={cx(
                      "rounded-md border px-2 py-2 text-xs transition-colors",
                      time === slot ? "border-sage bg-sage text-white" : "border-line text-body hover:border-sage/50",
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={confirm}
              disabled={!time}
              className={buttonClass("primary", "w-full")}
            >
              Konfirmasi Jadwal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
