---
layout: minimal
title: Publications
permalink: /publications/
---

<div markdown="0">
<div class="page-head">
<h1>Publications</h1>
<p class="role">Also on <a href="https://scholar.google.com/citations?user=m7zQwMIAAAAJ" target="_blank" rel="noopener">Google Scholar</a> and <a href="https://orcid.org/0000-0001-9887-5603" target="_blank" rel="noopener">ORCID</a>.</p>
</div>

{% assign current = "" %}
{% for pub in site.data.publications %}
{% capture y %}{{ pub.year }}{% endcapture %}
{% if y != current %}
{% unless current == "" %}</ul></section>{% endunless %}
<section class="year-group"><h2>{{ y }}</h2><ul class="pubs">
{% assign current = y %}
{% endif %}
{% include pub.html pub=pub %}
{% endfor %}
</ul></section>
</div>
