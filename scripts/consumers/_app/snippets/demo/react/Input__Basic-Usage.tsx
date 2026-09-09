import { Input } from "@chumlab/ui/input";

export default function InputExample() {
  return (
    <div className="flex flex-col gap-4 w-full sm:max-w-sm">
      <Input label="Full Name" placeholder="Enter your name..." />
      <Input
        label="Email"
        placeholder="you@example.com"
        description="We'll never share your email"
      />
      <Input label="Password" type="password" placeholder="Enter password..." required />
    </div>
  );
}
