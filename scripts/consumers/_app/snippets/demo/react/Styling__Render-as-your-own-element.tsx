import { Button } from "@chumlab/ui/button";

export default function StylingExample() {
  return (
    <div className="flex items-center gap-6">
      <Button>A real button</Button>
      <Button asChild>
        <a href="#asChild">An anchor wearing Button</a>
      </Button>
    </div>
  );
}
