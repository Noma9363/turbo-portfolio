"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-md text-sm bg-zinc-800 text-zinc-500 cursor-not-allowed"
      >
        로딩 중...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400">{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded-md text-sm border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 rounded-md text-sm bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors"
    >
      Google로 로그인
    </button>
  );
}
