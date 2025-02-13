"use client";

import useRefreshToken from "@/hooks/useRefreshToken";

export default function RefreshTokenProvider() {
  useRefreshToken();
  return null;
}
