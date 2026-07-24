"use client";

import { useMemo, useState } from "react";
import { AtlasGlobe } from "@/components/AtlasGlobe";
import {
  countProjects,
  getAllProjectCount,
  getProjectsByRegion,
  mapPins,
  projectRegions,
  type RegionId,
} from "@/lib/projects";

export function Atlas() {
  const [active, setActive] = useState<RegionId>("usa");
  const [activePin, setActivePin] = useState<string>("usa-fl");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    "usa-united-states-sedanos"
  );

  const current = projectRegions.find((r) => r.id === active)!;
  const regionProjects = useMemo(() => getProjectsByRegion(active), [active]);

  const total = getAllProjectCount();
  const regionCount = countProjects(active);

  const selectRegion = (regionId: RegionId) => {
    setActive(regionId);
    const firstProject = getProjectsByRegion(regionId)[0];
    const firstPin =
      firstProject?.pinId ?? mapPins.find((p) => p.region === regionId)?.id;
    if (firstPin) setActivePin(firstPin);
    setActiveProjectId(firstProject?.id ?? null);
  };

  const selectProject = (
    projectId: string,
    pinId: string,
    regionId: RegionId
  ) => {
    setActive(regionId);
    setActivePin(pinId);
    setActiveProjectId(projectId);
  };

  return (
    <section className="atlas">
      <div className="wrap">
        <div className="atlas-head">
          <p className="kicker">Project atlas</p>
          <h2>Selected work across continents.</h2>
          <p className="atlas-total">{total} projects mapped worldwide</p>
        </div>

        <div className="atlas-switch" role="tablist" aria-label="Regions">
          {projectRegions.map((r) => (
            <button
              key={r.id}
              type="button"
              className={active === r.id ? "is-on" : undefined}
              aria-selected={active === r.id}
              onClick={() => selectRegion(r.id)}
            >
              {r.label}
              <em>{countProjects(r.id)}</em>
            </button>
          ))}
        </div>

        <div className="atlas-map-layout">
          <div className="atlas-map-shell">
            <div className="atlas-map-chrome">
              <span>Interactive globe</span>
              <span>
                Focus · {current.label} · {regionCount} projects
              </span>
            </div>

            <AtlasGlobe region={active} activePin={activePin} />

            <div className="atlas-map-legend">
              <span>
                <i className="dot pulse" /> Selected market
              </span>
              <span>
                <i className="dot" /> Active region
              </span>
              <span>
                <i className="dot work" /> Other project markets
              </span>
            </div>
          </div>

          <aside
            className="atlas-panel atlas-panel-names"
            style={{ ["--region-accent" as string]: current.accent }}
          >
            <p className="atlas-count">{regionCount} projects</p>
            <h3>{current.label}</h3>
            <ul className="atlas-name-list">
              {regionProjects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    className={
                      activeProjectId === project.id ? "is-on" : undefined
                    }
                    onClick={() =>
                      selectProject(project.id, project.pinId, project.region)
                    }
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
