"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  americasView,
  atlasTransform,
  regionViews,
  viewForPin,
} from "@/lib/atlasView";
import {
  countProjects,
  getAllProjectCount,
  getPin,
  groupProjectsByCountry,
  getProjectsByRegion,
  mapPins,
  projectRegions,
  projectToPercent,
  type RegionId,
} from "@/lib/projects";
import { getProjectImage } from "@/lib/projectMedia";

export function Atlas() {
  const [active, setActive] = useState<RegionId>("usa");
  const [activePin, setActivePin] = useState<string>("usa-fl");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    "usa-united-states-sedanos"
  );
  const [lightbox, setLightbox] = useState(false);

  const current = projectRegions.find((r) => r.id === active)!;
  const regionProjects = useMemo(() => getProjectsByRegion(active), [active]);
  const countryGroups = useMemo(() => groupProjectsByCountry(active), [active]);
  const regionPins = useMemo(
    () => mapPins.filter((p) => p.region === active),
    [active]
  );

  const selectedPin = getPin(activePin) ?? regionPins[0] ?? null;
  const selectedProject =
    regionProjects.find((p) => p.id === activeProjectId) ??
    regionProjects.find((p) => p.pinId === activePin) ??
    regionProjects[0] ??
    null;

  const total = getAllProjectCount();
  const regionCount = countProjects(active);
  const selectedImage = selectedProject
    ? getProjectImage(selectedProject.id)
    : null;

  const mapView = useMemo(() => {
    // Prefer pinned project zoom; otherwise region frame (Americas-first for USA/LatAm).
    if (selectedPin) {
      return viewForPin(selectedPin.lat, selectedPin.lon, 3.4);
    }
    if (active === "mena") return regionViews.mena;
    if (active === "latam") return regionViews.latam;
    if (active === "usa") return regionViews.usa;
    return americasView;
  }, [active, selectedPin]);

  const stageStyle = {
    ...atlasTransform(mapView),
    ["--map-zoom" as string]: String(mapView.zoom),
  };

  const selectRegion = (regionId: RegionId) => {
    setActive(regionId);
    const firstProject = getProjectsByRegion(regionId)[0];
    const firstPin =
      firstProject?.pinId ?? mapPins.find((p) => p.region === regionId)?.id;
    if (firstPin) setActivePin(firstPin);
    setActiveProjectId(firstProject?.id ?? null);
    setLightbox(false);
  };

  const selectPin = (pinId: string, regionId: RegionId) => {
    setActive(regionId);
    setActivePin(pinId);
    const firstOnPin = getProjectsByRegion(regionId).find(
      (p) => p.pinId === pinId
    );
    setActiveProjectId(firstOnPin?.id ?? null);
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
              <span>Zoomed regional map</span>
              <span>
                Focus · {current.label} · {regionCount} projects
              </span>
            </div>

            <div className="atlas-geo">
              <div className="atlas-geo-stage" style={stageStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/world-map.svg"
                  alt="World map focused on Exhibium project regions"
                  className={`atlas-geo-img is-${active}`}
                />
                <div
                  className={`atlas-geo-tint is-${active}`}
                  aria-hidden="true"
                />

                {mapPins.map((pin) => {
                  const { left, top } = projectToPercent(pin.lat, pin.lon);
                  const hot = pin.region === active;
                  const selected = activePin === pin.id;
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      className={`geo-pin${hot ? " is-hot" : ""}${selected ? " is-selected" : ""}`}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      aria-label={`${pin.label}, ${pin.place}`}
                      onClick={() => selectPin(pin.id, pin.region)}
                    >
                      <span className="geo-pin-pulse" />
                      <span className="geo-pin-core" />
                      {selected ? (
                        <span className="geo-pin-tip">
                          {selectedProject?.name ?? pin.place}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="atlas-map-legend">
              <span>
                <i className="dot" /> Active region
              </span>
              <span>
                <i className="dot pulse" /> Selected project
              </span>
            </div>
          </div>

          <aside
            className="atlas-panel"
            style={{ ["--region-accent" as string]: current.accent }}
          >
            <p className="atlas-count">
              {regionCount} projects · {countryGroups.length}{" "}
              {countryGroups.length === 1 ? "market" : "markets"}
            </p>
            <h3>{current.label}</h3>
            <p className="atlas-blurb">{current.blurb}</p>

            {selectedProject && selectedPin ? (
              <div className="atlas-featured">
                {selectedImage ? (
                  <button
                    type="button"
                    className="atlas-featured-media"
                    onClick={() => setLightbox(true)}
                    aria-label={`View larger image of ${selectedProject.name}`}
                  >
                    <Image
                      src={selectedImage}
                      alt={`${selectedProject.name} project`}
                      width={640}
                      height={400}
                      className="atlas-featured-img"
                      unoptimized
                    />
                    <span className="atlas-featured-media-label">
                      View photo
                    </span>
                  </button>
                ) : null}
                <span>Selected project</span>
                <strong>{selectedProject.name}</strong>
                <em>
                  {selectedProject.country} · {selectedPin.place}
                </em>
                <p className="atlas-featured-desc">
                  {selectedProject.description}
                </p>
              </div>
            ) : null}

            <ul className="atlas-pin-list">
              {regionPins.map((pin) => (
                <li key={pin.id}>
                  <button
                    type="button"
                    className={activePin === pin.id ? "is-on" : undefined}
                    onClick={() => selectPin(pin.id, pin.region)}
                  >
                    <span className="pin-dot" />
                    <span>
                      <strong>{pin.place}</strong>
                      <small>
                        {
                          regionProjects.filter(
                            (project) => project.pinId === pin.id
                          ).length
                        }{" "}
                        projects here
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="atlas-catalog">
              <p className="atlas-more-label">
                Click a project to zoom &amp; view its photo
              </p>
              {countryGroups.map((group) => (
                <div key={group.country} className="atlas-group">
                  <h4>{group.country}</h4>
                  <ul className="name-cloud dense">
                    {group.projects.map((project) => (
                      <li key={project.id}>
                        <button
                          type="button"
                          className={
                            selectedProject?.id === project.id
                              ? "project-chip is-on"
                              : "project-chip"
                          }
                          onClick={() =>
                            selectProject(
                              project.id,
                              project.pinId,
                              project.region
                            )
                          }
                        >
                          {project.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {lightbox && selectedProject && selectedImage ? (
        <div
          className="atlas-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.name}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="atlas-lightbox-close"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            ×
          </button>
          <figure
            className="atlas-lightbox-figure"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={selectedProject.name}
              width={1400}
              height={900}
              className="atlas-lightbox-img"
              unoptimized
            />
            <figcaption>
              <strong>{selectedProject.name}</strong>
              <span>
                {selectedProject.country} · {selectedPin?.place}
              </span>
              <p>{selectedProject.description}</p>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  );
}
