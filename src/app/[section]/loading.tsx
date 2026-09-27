export default function SectionLoading() {
  return (
    <article className="article">
      <p className="sr-only" role="status">
        loading page
      </p>
      <div aria-hidden="true">
        <div className="dest-copy">
          <span className="skel-slot">
            <i className="skel-mark" />
          </span>
          <span className="skel-slot">
            <i className="skel-mark skel-intro-short" />
          </span>
        </div>
        <div className="dest-note">
          <span className="skel-slot">
            <i className="skel-mark skel-intro-short" />
          </span>
        </div>
        <ul className="dest-list">
          <li>
            <span className="skel-slot">
              <i className="skel-mark skel-item" />
            </span>
          </li>
          <li>
            <span className="skel-slot">
              <i className="skel-mark skel-item" />
            </span>
          </li>
          <li>
            <span className="skel-slot">
              <i className="skel-mark skel-item-short" />
            </span>
          </li>
        </ul>
      </div>
    </article>
  );
}
