import Image from "next/image";
import { pageImages } from "@/lib/site";
import { founderProfile } from "@/lib/brief";

export function Founder() {
  return (
    <section className="founder">
      <div className="wrap founder-layout">
        <aside className="founder-aside">
          <figure className="founder-portrait">
            <Image
              src={pageImages.partners.src}
              alt="Exhibium leadership in an executive boardroom setting"
              width={640}
              height={800}
              sizes="(max-width: 900px) 100vw, 36vw"
            />
          </figure>
          <p className="kicker">Fernando Williams Profile</p>
          <h2>Fernando Williams</h2>
          <p className="founder-meta">
            Founder &amp; Director · Chief Strategist · 25+ years
            <br />
            United States · Latin America · Middle East
            <br />
            Retail consultant · Speaker · Trainer
          </p>
        </aside>
        <div className="founder-main">
          <p>{founderProfile.intro}</p>
          <p>{founderProfile.emotional}</p>
          <p>{founderProfile.background}</p>
          <p>{founderProfile.expansion}</p>
        </div>
      </div>
    </section>
  );
}
