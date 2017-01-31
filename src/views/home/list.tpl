{% set path = "app/views/" %}
{% extends path + "layout/layout.tpl" %}

{% block head %}
<link href="/assets/css/antd.min.css"  media="all" rel="stylesheet" />
{% endblock %}

<!--body block-->
{% block body %}
<h2>{{datePicker | safe }}</h2>

<div id="app"></div>


<script src="/assets/js/dist/about.js"></script>
{% endblock %}
