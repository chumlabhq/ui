import { Avatar } from "@chumlab/ui/avatar";

export default function AvatarExample() {
  return (
    <>
      {
        ["Custom 1", "Custom 2", "Custom 3"].map((n) => (
          <Avatar
            key={n}
            name={n}
            autoColor
            colors={
              {
                backgrounds: ["#e0f2fe", "#fce7f3", "#dcfce7"],
                text: ["#0369a1", "#be185d", "#15803d"]
              }
            }
          />
        ))
      }
      {
        ["Brand A", "Brand B", "Brand C", "Brand D"].map((n) => (
          <Avatar
            key={n}
            name={n}
            autoColor
            colors={
              {
                backgrounds: ["#1e40af", "#7c3aed", "#0e7490", "#b91c1c"],
                text: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"]
              }
            }
          />
        ))
      }
    </>
  );
}
