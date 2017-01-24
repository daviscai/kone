{% set path = "app/views/" %}
{% extends path + "layout/layout.tpl" %}

<!--head block-->
{% block head %}
<link type="text/css" href="" rev="stylesheet" rel="stylesheet"  />
{% endblock %}

<!--body block-->
{% block body %}
<h2>{{title}}</h2>

<form action="/home/reg" method="POST">
  <input type="hidden" name="_csrf" value="{{ csrf }}" />
  <input type="email" name="email" placeholder="Email" />
  <input type="password" name="password" placeholder="Password" />
  <button type="submit">Register</button>
</form>


{% endblock %}
