import React from 'react';
import { Link } from 'react-router-dom';
import architecture from '../../assets/3TierArch.png';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-grid" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="page-eyebrow">AWS · Application architecture</p>
          <h1 id="home-title">
            Build on a resilient <span>three-tier foundation.</span>
          </h1>
          <p className="hero-description">
            Explore how a web, application, and database tier work together
            to create a scalable cloud application.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" to="/db">
              Explore database demo <span aria-hidden="true">→</span>
            </Link>
            <a className="text-link" href="#architecture">View architecture</a>
          </div>
        </div>

        <div className="architecture-card" id="architecture">
          <div className="architecture-card-header">
            <strong>System architecture</strong>
            <span>3 connected tiers</span>
          </div>
          <div className="architecture-image-frame">
            <img src={architecture} alt="Diagram of the three-tier web application architecture" />
          </div>
        </div>
      </section>

      <section aria-labelledby="tiers-title">
        <div className="section-heading">
          <h2 id="tiers-title">A clear separation of concerns</h2>
          <p>Each tier has a focused role in the application.</p>
        </div>
        <div className="tier-grid">
          <article className="tier-card">
            <div className="tier-card-top">
              <span className="tier-number">01 / PRESENTATION</span>
              <span className="tier-icon" aria-hidden="true">◫</span>
            </div>
            <h3>Web tier</h3>
            <p>A responsive React interface for the people using your application.</p>
          </article>
          <article className="tier-card">
            <div className="tier-card-top">
              <span className="tier-number">02 / LOGIC</span>
              <span className="tier-icon" aria-hidden="true">⌘</span>
            </div>
            <h3>Application tier</h3>
            <p>An Express service that handles requests and application behavior.</p>
          </article>
          <article className="tier-card">
            <div className="tier-card-top">
              <span className="tier-number">03 / STORAGE</span>
              <span className="tier-icon" aria-hidden="true">▤</span>
            </div>
            <h3>Database tier</h3>
            <p>A MySQL database that stores and serves application records.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
