"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import { experiences, type Experience } from "./data";
import styles from "./experience.module.css";

function Logo({ experience }: { experience: Experience }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.logo} style={{ background: experience.background, color: experience.background === "#ffffff" ? "#111111" : "#ffffff" }}>
      {failed ? <span role="img" aria-label={`${experience.company} logo unavailable`}>{experience.initials}</span> : (
        // Original logo assets retain their aspect ratio within a consistent tile.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={experience.logo} alt={`${experience.company} logo`} width={56} height={56} className={experience.fullBleedLogo ? styles.fullBleed : undefined} onError={() => setFailed(true)} />
      )}
    </div>
  );
}

function Dates({ experience }: { experience: Experience }) {
  return <p className={styles.dates}>{experience.start} <span aria-hidden="true">—</span><span className={styles.srOnly}> to </span> {experience.end}</p>;
}

function Status({ experience }: { experience: Experience }) {
  if (!experience.incoming && experience.end !== "Present") return null;
  return <span className={styles.status}><span aria-hidden="true" className={experience.incoming ? styles.outlineDot : styles.dot} />{experience.incoming ? "Incoming" : "Current"}</span>;
}

function Entries() {
  return (
    <ol className={styles.timeline} aria-label="Experience, most recent first">
      {experiences.map((experience) => (
        <li className={styles.entry} key={experience.company}>
          <div className={styles.timelineDate}><Dates experience={experience} /><Status experience={experience} /></div>
          <Logo experience={experience} />
          <article className={styles.details}>
            <div className={styles.entryHeader}>
              <div className={styles.identity}>
                <p className={styles.company}>{experience.company}</p>
                <h2 className={styles.role}>{experience.role}</h2>
              </div>
              <div className={styles.headerDate}><Dates experience={experience} /><Status experience={experience} /></div>
            </div>
            {experience.subtitle && <p className={styles.subtitle}>{experience.subtitle}</p>}
            <p className={styles.description}>{experience.description}</p>
            {experience.location && <p className={styles.location}>{experience.location}</p>}
          </article>
        </li>
      ))}
    </ol>
  );
}

export default function ExperiencePageClient() {
  return (
    <div className={styles.shell}>
      <CustomCursor />
      <Navbar />
      <main className={styles.main}>
        <header className={styles.hero}>
          <h1>EXPERIENCE</h1>
          <div className={styles.heroBottom}>
            <p>The teams I’ve joined. The work I’ve contributed.</p>
            <span className={styles.heroCaption}>2023 — 2027</span>
          </div>
        </header>
        <Entries />
      </main>
      <Footer />
    </div>
  );
}
