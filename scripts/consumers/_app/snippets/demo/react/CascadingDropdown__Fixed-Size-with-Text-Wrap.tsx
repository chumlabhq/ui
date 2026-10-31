import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";

export default function CascadingDropdownExample() {
  return (
    <CascadingDropdown
      options={
        [
          {
            value: "frontend",
            label: "Frontend Development Frameworks & Libraries",
            selectionMode: "multi",
            children: [
              {
                value: "react",
                label:
                  "React — A JavaScript library for building user interfaces"
              },
              {
                value: "vue",
                label: "Vue.js — The progressive JavaScript framework"
              },
              {
                value: "angular",
                label:
                  "Angular — Platform for building mobile and desktop web apps"
              },
              {
                value: "svelte",
                label:
                  "Svelte — Cybernetically enhanced web apps with zero runtime"
              }
            ]
          },
          {
            value: "backend",
            label: "Backend & Server-Side Technologies",
            selectionMode: "multi",
            children: [
              {
                value: "node",
                label:
                  "Node.js — JavaScript runtime built on Chrome's V8 engine"
              },
              {
                value: "django",
                label:
                  "Django — The web framework for perfectionists with deadlines"
              },
              {
                value: "rails",
                label:
                  "Ruby on Rails — Convention over configuration web framework"
              },
              {
                value: "go",
                label:
                  "Go (Golang) — Efficient, reliable, and fast compiled language by Google"
              }
            ]
          },
          {
            value: "devops",
            label: "DevOps, CI/CD & Cloud Infrastructure",
            selectionMode: "single",
            children: [
              {
                value: "docker",
                label:
                  "Docker — Build, ship, and run distributed applications"
              },
              {
                value: "k8s",
                label:
                  "Kubernetes — Production-grade container orchestration at scale"
              },
              {
                value: "terraform",
                label:
                  "Terraform — Infrastructure as code for multi-cloud provisioning"
              }
            ]
          }
        ]
      }
      value={{}}
      onValueChange={() => {}}
      placeholder="Select technologies..."
      classes={
        {
                     ...({
           root: "",
           control: "",
        trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
        content: "rounded-cl-md shadow-lg overflow-visible bg-cl-bg-panel border border-cl-border",
           item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[highlighted]:bg-cl-bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text first:rounded-t-cl-md last:rounded-b-cl-md",
        subContent: "min-w-[180px] rounded-cl-md shadow-lg ms-1 bg-cl-bg-panel border border-cl-border",
           subPositioner: "",
           subItem: "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[highlighted]:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text first:rounded-t-cl-md last:rounded-b-cl-md",
           label: "block text-sm font-medium mb-1 text-cl-text-secondary",
           message: "text-sm mt-1 text-cl-error data-[valid]:text-cl-success",
           icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary",
           itemIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
           itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
           itemControl: "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input",
           empty: "px-3 py-4 text-sm text-center text-cl-text-secondary",
           loading: "px-3 py-4 text-sm text-center text-cl-text-secondary"
         }),
        content: "rounded-cl-md shadow-lg overflow-visible w-full max-w-[260px] bg-cl-bg-panel border border-cl-border",
                     item: "flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm leading-snug hover:bg-cl-bg-hover text-cl-text first:rounded-t-cl-md last:rounded-b-cl-md",
        subContent: "rounded-cl-md shadow-lg ms-1 w-full max-w-[280px] max-h-[260px] overflow-y-auto bg-cl-bg-panel border border-cl-border",
                     subItem: "flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm leading-snug hover:bg-cl-bg-hover text-cl-text-secondary first:rounded-t-cl-md last:rounded-b-cl-md"
                   }
      }
    />
  );
}
