import Link from "next/link";
import { inp } from "./checkoutConstants";

interface ContactSectionProps {
  email: string;
  newsletter: boolean;
  authenticated: boolean;
  onEmailChange: (value: string) => void;
  onNewsletterChange: (checked: boolean) => void;
}

export function ContactSection({
  email,
  newsletter,
  authenticated,
  onEmailChange,
  onNewsletterChange,
}: ContactSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-medium">Liên hệ</h2>
        {!authenticated && (
          <span className="text-xs text-gray-500">
            Đã có tài khoản?{" "}
            <Link href="/auth/signin" className="text-black underline">
              Đăng nhập
            </Link>
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder=" "
          className={inp}
        />
        <label className="absolute left-3 top-1.5 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
          Email
        </label>
      </div>

      <label className="flex items-center gap-2.5 mt-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => onNewsletterChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 accent-black"
        />
        <span className="text-sm text-gray-700">
          Gửi cho tôi tin tức và ưu đãi qua email
        </span>
      </label>
    </div>
  );
}
