import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// 탭에서 16px 안팎으로 줄어들어 보이므로 테두리는 배경(#09090b)보다 밝은 zinc-700으로 지정
// 내장 폰트는 굵기가 400뿐이라 fontWeight가 안 먹어서 text-stroke로 굵게 처리
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          border: "2px solid #3f3f46",
          borderRadius: 6,
          color: "#fafafa",
          fontSize: 13,
          letterSpacing: -0.5,
          WebkitTextStroke: "1px #fafafa",
        }}
      >
        CLH
      </div>
    ),
    size,
  );
}
