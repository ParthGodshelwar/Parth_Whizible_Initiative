import { Suspense } from "react";
import { WhizLoading } from "app/components";

export default function WhizSuspense({ children }) {
  return <Suspense fallback={<WhizLoading />}>{children}</Suspense>;
}
