import { createFileRoute } from "@tanstack/react-router";
import { HauntedApp } from "@/components/haunted-app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <HauntedApp />;
}
