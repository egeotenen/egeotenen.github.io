---
layout: minimal
title: CV
permalink: /cv/
redirect_from:
  - /resume
---

<div markdown="0">
<div class="page-head">
<h1>Curriculum Vitae</h1>
<p class="role">Updated regularly. The PDF has the full list of publications, talks, teaching, and service.</p>
</div>

<p style="margin-top:2rem"><a class="button" href="https://drive.google.com/file/d/13zjRBxsA7dh16msCBnNLrMqLzDwaMAk0/view?usp=share_link" target="_blank" rel="noopener">View CV (PDF) ↗</a></p>

<section aria-labelledby="pos-h">
<h2 id="pos-h">Positions</h2>
<ul class="dated">
<li><span class="when">2026–</span><span>Postdoctoral Researcher<span class="sub">IT University of Copenhagen</span></span></li>
<li><span class="when">2026–</span><span>Affiliate Researcher<span class="sub">Pioneer Centre for Artificial Intelligence · Psychology of Technology Institute</span></span></li>
</ul>
</section>

<section aria-labelledby="edu-h">
<h2 id="edu-h">Education</h2>
<ul class="dated">
{% for e in site.data.education %}<li><span class="when">{{ e.year }}</span><span>{{ e.degree }}{% if e.link %} · <a href="{{ e.link }}" target="_blank" rel="noopener">{{ e.link_label }}</a>{% endif %}<span class="sub">{{ e.detail }}</span></span></li>
{% endfor %}
</ul>
</section>
</div>
