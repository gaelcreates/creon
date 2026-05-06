import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5ead5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 44,
            background: "#ff7a00",
            border: "3px solid #100609",
            borderRadius: 999,
            fontFamily: "serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#100609",
            paddingBottom: 4,
          }}
        >
          C
        </div>
      </div>
    ),
    size,
  );
}
