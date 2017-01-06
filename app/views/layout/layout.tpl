<!doctype html>
<html>
<head>
<meta name="charset" content="utf-8" />
<title>{{title}}</title>
{% block head %}{% endblock %}
</head>
<body>
{% include "./header.tpl" %}
{% block body %}{% endblock %}
{% include "./footer.tpl" %}
</body>
</html>
