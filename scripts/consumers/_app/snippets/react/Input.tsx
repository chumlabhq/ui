import { Input } from "@chumlab/ui/input";

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 380 }}>
      <Input label="Full Name" placeholder="Enter your name..." />
      <Input label="Email" placeholder="you@example.com" description="We'll never share your email" />
      <Input label="Password" type="password" placeholder="Enter password..." required />
    </div>
  );
}
