import Image from "next/image";
import { pageImages } from "@/lib/site";
import { executiveSummary } from "@/lib/brief";

export function Statement({ showMedia = true }: { showMedia?: boolean }) {
  return (
    <section className="statement">
      <div className={`wrap${showMedia ? " statement-layout" : ""}`}>
        <div className="statement-copy">
          <p className="kicker">{executiveSummary.kicker}</p>
          <h2>{executiveSummary.headline}</h2>
          <p className="lede">{executiveSummary.primary}</p>
          <p className="lede statement-board">{executiveSummary.board}</p>
        </div>
        {showMedia ? (
          <figure className="statement-media">
            <Image
              src={pageImages.about.src}
              alt={pageImages.about.alt}
              width={920}
              height={720}
              sizes="(max-width: 900px) 100vw, 44vw"
            />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
