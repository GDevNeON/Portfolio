import DeviceSupportFrame from '../components/DeviceSupportFrame'
import GlassStack from '../components/GlassStack'
import GlassStackVertical from '../components/GlassStackVertical'
import { siteConfig } from '../siteConfig'

export default function Home() {
  const aboutImages =
    siteConfig.about.images.length > 0
      ? siteConfig.about.images
      : siteConfig.projects[0]?.images ?? []

  return (
    <div className="page">
      <section className="section hero revealSection" id="home" data-scroll-section>
        <div className="heroGrid">
          <div className="heroLeft">
            <div className="pill">{siteConfig.title}</div>

            <h1 className="heroTitle">
              {siteConfig.name}
              <br />
              <span className="heroAccent">{siteConfig.ui.home.heroAccent}</span>
            </h1>

            <p className="heroText">{siteConfig.tagline}</p>

            <div className="heroActions">
              <button
                type="button"
                className="btnPrimary"
                onClick={() =>
                  document
                    .getElementById('projects')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                {siteConfig.ui.home.viewProjects}
              </button>
              <button
                type="button"
                className="btnGhost"
                onClick={() =>
                  document
                    .getElementById('about')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                {siteConfig.ui.home.aboutMe}
              </button>
            </div>
          </div>

          <div className="heroRight" aria-hidden="true">
            <div className="heroCard heroCard--a" />
            <div className="heroCard heroCard--b" />
            <div className="heroCard heroCard--c" />

            <div className="heroBadge glass">
              <div className="badgeLabel">{siteConfig.ui.home.currently}</div>
              <div className="badgeValue">{siteConfig.ui.home.openToWork}</div>
              <div className="badgeDotRow">
                <span className="badgeDot" /> {siteConfig.ui.home.available}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section revealSection" id="stack" data-scroll-section>
        <h2 className="sectionTitle">
          {siteConfig.ui.home.techStack} <span className="titleAccent">{siteConfig.ui.home.stackAccent}</span>
        </h2>

        <div className="stackGrid">
          {siteConfig.techStack.map((t) => (
            <div key={t.name} className="stackCard">
              <div className="stackName">{t.name}</div>
              <div className="stackHint">{t.hint}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section revealSection" id="projects" data-scroll-section>
        <h2 className="sectionTitle">
          {siteConfig.ui.home.selectedWorks} <span className="titleAccent">{siteConfig.ui.home.worksAccent}</span>
        </h2>

        <div className="projects">
          {siteConfig.projects.map((p, idx) => {
            const reverse = idx % 2 === 1
            const glassFirst = p.id === 'fin-mobile' || p.id === 'indie-game'

            return (
              <article
                key={p.id}
                className={['project', reverse ? 'project--reverse' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="projectMedia">
                  <div
                    className={['projectShowcase', glassFirst ? 'projectShowcase--glassFirst' : '']
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {glassFirst ? (
                      <>
                        <div className="projectGlass">
                          <GlassStackVertical images={p.images} alt={p.title} flip kind={p.kind} />
                        </div>
                        <DeviceSupportFrame kind={p.kind} />
                      </>
                    ) : (
                      <>
                        <DeviceSupportFrame kind={p.kind} />
                        <div className="projectGlass">
                          <GlassStackVertical images={p.images} alt={p.title} kind={p.kind} />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="projectInfo">
                  <div className="projectTitleRow">
                    <span className={['projectMark', `projectMark--${p.kind}`].join(' ')} />
                    <h3 className="projectTitle">{p.title}</h3>
                  </div>

                  <p className="projectDesc">{p.description}</p>

                  <div className="tagRow">
                    {p.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {p.link ? (
                    <a className="projectLink" href={p.link} target="_blank" rel="noreferrer">
                      {siteConfig.ui.home.viewProject}
                    </a>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section about revealSection" id="about" data-scroll-section>
        <div className="aboutIcon" aria-hidden="true">
          <div className="aboutRing aboutRing--a" />
          <div className="aboutRing aboutRing--b" />
          <div className="aboutRing aboutRing--c" />
        </div>

        <div className="aboutGrid">
          <div className="aboutLeft">
            <h2 className="aboutTitle">{siteConfig.about.headline}</h2>
            <p className="aboutText">{siteConfig.about.body}</p>

            <div className="aboutStats">
              {siteConfig.about.highlights.map((h) => (
                <div key={h.label} className="statCard">
                  <div className="statValue">{h.value}</div>
                  <div className="statLabel">{h.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="aboutRight">
            <div className="aboutMedia">
              <GlassStack images={aboutImages} alt="About" />
            </div>

            <div className="aboutNote glass">
              <div className="aboutNoteTitle">{siteConfig.ui.home.focus}</div>
              <div className="aboutNoteBody">{siteConfig.ui.home.focusDescription}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
