import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// 탭에서 16px 안팎으로 줄어들어 폰트 대신 굵은 획(2.5)의 도형으로 C·L·H를 직접 그림
// 배경(#09090b)보다 밝은 zinc-700 테두리, 글자는 foreground(#fafafa)
export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="30" height="30" rx="6" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
        {/* C */}
        <path
          d="M11 10.25H7.5Q4.75 10.25 4.75 13V19Q4.75 21.75 7.5 21.75H11"
          fill="none"
          stroke="#fafafa"
          strokeWidth="2.5"
        />
        {/* L */}
        <rect x="12.25" y="9" width="2.5" height="14" fill="#fafafa" />
        <rect x="12.25" y="20.5" width="7.5" height="2.5" fill="#fafafa" />
        {/* H */}
        <rect x="21" y="9" width="2.5" height="14" fill="#fafafa" />
        <rect x="26" y="9" width="2.5" height="14" fill="#fafafa" />
        <rect x="21" y="14.75" width="7.5" height="2.5" fill="#fafafa" />
      </svg>
    ),
    size,
  );
}
