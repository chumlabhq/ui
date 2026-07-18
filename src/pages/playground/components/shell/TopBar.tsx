import { Link } from "react-router-dom";
import AnnouncementBanner from "../../../../components/AnnouncementBanner";
import UserMenu from "../../../../components/UserMenu";
import logoLight from "../../../../assets/images/logo-light.png";

// App chrome, matching the site's main/demo header: the shared stealth
// announcement strip on top, then the same 64px bar — Chumlab logo (36px) + a
// hairline divider + "Playground" on the left, UserMenu on the right. Chrome
// stays petrol-dark by brand (Decision 1), so the logo is the light variant.
export default function TopBar() {
  return (
    <>
      <AnnouncementBanner />
      <header className="bg-bg-base" style={{ borderBottom: "0.5px solid var(--border-faint)" }}>
        <div className="w-full px-5 sm:px-6 md:px-8">
          <div className="flex h-[64px] items-center gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="-ml-1 flex items-center text-fg" aria-label="Chumlab home">
                <img
                  src={logoLight}
                  alt="Chumlab"
                  style={{ height: 36, width: "auto", objectFit: "contain" }}
                />
              </Link>
              <span className="h-6 w-px bg-border-faint" aria-hidden />
              <span className="font-display text-[19px] font-semibold tracking-tight text-fg">
                Playground
              </span>
            </div>
            <span className="flex-1" />
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
