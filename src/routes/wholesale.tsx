import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wholesale")({
  component: () => <Outlet />,
});
